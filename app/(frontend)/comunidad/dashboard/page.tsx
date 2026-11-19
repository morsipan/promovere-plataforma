import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { representationsContent } from '@/data/content';
import CommunityDashboardClient, {
  type DashboardRepresentation,
  type DashboardContentItem,
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
  let settings: DashboardCommunitySettings | null = null;

  try {
    const [repsRes, contentRes, settingsRes] = await Promise.all([
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
      settings={settings}
    />
  );
}
