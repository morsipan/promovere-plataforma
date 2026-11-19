import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { representationsContent } from '@/data/content';
import CommunityDashboardClient, {
  type DashboardRepresentation,
  type DashboardContentItem,
  type DashboardPromotion,
  type DashboardEvent,
  type DashboardCommunitySettings,
} from '@/components/comunidad/CommunityDashboardClient';

export const dynamic = 'force-dynamic';

function extractPlainText(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content.root?.children) {
    try {
      const texts: string[] = [];
      const traverse = (node: any) => {
        if (!node) return;
        if (typeof node.text === 'string') texts.push(node.text);
        if (Array.isArray(node.children)) {
          node.children.forEach(traverse);
        }
      };
      traverse(content.root);
      return texts.join(' ').trim();
    } catch {
      return '';
    }
  }
  return '';
}

export default async function ComunidadDashboardPage() {
  const payload = await getPayload({ config });
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });

  // Protección de ruta: Si no está autenticado, redirige al login de la comunidad
  if (!user) {
    redirect('/comunidad/login');
  }

  // Consultas en paralelo a Payload CMS
  let representations: DashboardRepresentation[] = [];
  let contentItems: DashboardContentItem[] = [];
  let promotions: DashboardPromotion[] = [];
  let events: DashboardEvent[] = [];
  let settings: DashboardCommunitySettings | null = null;

  try {
    const [repsRes, contentRes, promosRes, eventsRes, settingsRes] = await Promise.all([
      payload
        .find({
          collection: 'representations',
          where: {
            status: { equals: 'active' },
          },
          sort: 'order',
          depth: 1,
          limit: 50,
        })
        .catch(() => null),
      payload
        .find({
          collection: 'community-content',
          user,
          overrideAccess: false, // Aplica estrictamente canReadCommunityContent según el rol
          depth: 2,
          sort: '-createdAt',
          limit: 100,
        })
        .catch(() => null),
      payload
        .find({
          collection: 'community-promotions',
          user,
          overrideAccess: false,
          depth: 1,
          sort: 'validUntil',
          limit: 50,
        })
        .catch(() => null),
      payload
        .find({
          collection: 'community-events',
          user,
          overrideAccess: false,
          depth: 1,
          sort: 'eventDate',
          limit: 50,
        })
        .catch(() => null),
      payload
        .findGlobal({
          slug: 'community-settings',
          depth: 1,
        })
        .catch(() => null),
    ]);

    if (repsRes?.docs && repsRes.docs.length > 0) {
      representations = repsRes.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        brand: doc.brand,
        country: doc.country,
        category: doc.category,
        tag: doc.tag ?? null,
        description: doc.description || '',
        coverImage: doc.coverImage ?? null,
        coverImageUrl: doc.coverImageUrl ?? null,
        logo: doc.logo ?? null,
        websiteUrl: doc.websiteUrl ?? null,
        mediaKitUrl: doc.mediaKitUrl ?? null,
        contactEmail: doc.contactEmail ?? null,
        contactWhatsapp: doc.contactWhatsapp ?? null,
      }));
    }

    if (contentRes?.docs) {
      contentItems = contentRes.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        plainDescription: extractPlainText(doc.description),
        attachments: Array.isArray(doc.attachments) ? doc.attachments : [],
        coverImage: doc.coverImage ?? null,
        externalUrl: doc.externalUrl ?? null,
        ctaLabel: doc.ctaLabel ?? null,
        videoUrl: doc.videoUrl ?? null,
        representation: doc.representation ?? null,
        brand: doc.brand ?? null,
        highlight: doc.highlight ?? null,
        featured: Boolean(doc.featured),
        createdAt: doc.createdAt,
      }));
    }

    if (promosRes?.docs) {
      promotions = promosRes.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        promoType: doc.promoType,
        benefitBadge: doc.benefitBadge ?? null,
        description: doc.description || '',
        conditions: doc.conditions ?? null,
        validFrom: doc.validFrom ?? null,
        validUntil: doc.validUntil,
        ctaLabel: doc.ctaLabel ?? null,
        ctaUrl: doc.ctaUrl ?? null,
        coverImage: doc.coverImage ?? null,
        representation: doc.representation ?? null,
        featured: Boolean(doc.featured),
      }));
    }

    if (eventsRes?.docs) {
      events = eventsRes.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        modality: doc.modality,
        eventDate: doc.eventDate ?? null,
        locationOrPlatform: doc.locationOrPlatform ?? null,
        speaker: doc.speaker ?? null,
        description: doc.description || '',
        registrationUrl: doc.registrationUrl ?? null,
        recordingUrl: doc.recordingUrl ?? null,
        coverImage: doc.coverImage ?? null,
        materialAttachment: doc.materialAttachment ?? null,
        representation: doc.representation ?? null,
      }));
    }

    if (settingsRes) {
      settings = settingsRes as DashboardCommunitySettings;
    }
  } catch (e) {
    console.warn('Error al cargar datos del Dashboard de Comunidad:', e);
  }

  // Fallback seguro si la colección representations aún estuviera vacía
  if (representations.length === 0) {
    representations = representationsContent.items.map((item) => ({
      id: item.id,
      title: item.title,
      brand: item.brand,
      country: item.country,
      category: item.category,
      tag: item.tag,
      description: item.description,
      coverImageUrl: item.image,
      contactEmail: 'marketing@promovere.com.ar',
    }));
  }

  const firstName =
    (typeof user.name === 'string' && user.name.trim().split(' ')[0]) || 'Colega';

  return (
    <CommunityDashboardClient
      userName={firstName}
      userRole={String(user.role || 'minorista')}
      representations={representations}
      contentItems={contentItems}
      promotions={promotions}
      events={events}
      settings={settings}
    />
  );
}
