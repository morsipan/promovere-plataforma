import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import PageLivePreview from '@/components/PageLivePreview';
import { getMediaUrl } from '@/lib/media';

export const revalidate = 3600;

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

function normalizeServiceSlug(raw: string): string {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  return decoded
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchPublishedServicePage(rawSlug: string) {
  const normalized = normalizeServiceSlug(rawSlug);
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        and: [
          {
            or: [{ slug: { equals: normalized } }, { slug: { equals: rawSlug } }],
          },
          { isPublished: { equals: true } },
        ],
      },
      depth: 2,
      limit: 1,
    });
    return (docs?.[0] as any) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchPublishedServicePage(slug);

  if (!page) {
    return {
      title: 'Servicio no disponible — Promovêre',
    };
  }

  const meta = page?.meta;
  const title = meta?.title || `${page.title} — Servicios | Promovêre`;
  const description =
    meta?.description ||
    'Servicios estratégicos de Promovêre para marcas turísticas, destinos y cadenas hoteleras en América Latina.';
  const imageUrl = meta?.image ? getMediaUrl(meta.image) : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;

  const [pageDoc] = await Promise.all([
    fetchPublishedServicePage(slug),
    (async () => {
      try {
        const payload = await getPayload({ config });
        const [headerRes, footerRes, settingsRes] = await Promise.all([
          payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
          payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
          payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
        ]);
        headerData = headerRes;
        footerData = footerRes;
        siteSettings = settingsRes;
      } catch {}
    })(),
  ]);

  if (!pageDoc || pageDoc.isPublished === false) {
    notFound();
  }

  return (
    <PageLivePreview
      initialData={pageDoc}
      headerData={headerData}
      footerData={footerData}
      siteSettings={siteSettings}
      slug={pageDoc.slug || slug}
    />
  );
}
