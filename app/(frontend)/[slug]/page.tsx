import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import PageLivePreview from '@/components/PageLivePreview';
import { getMediaUrl } from '@/lib/media';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      depth: 1,
    });

    if (docs && docs.length > 0) {
      const page = docs[0] as any;
      const meta = page?.meta;
      const title = meta?.title || `${page.title} — Promovêre`;
      const description =
        meta?.description ||
        'Promovêre — Conectamos marcas y destinos de clase mundial con el trade turístico de América Latina.';
      const imageUrl = meta?.image ? getMediaUrl(meta.image) : undefined;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: imageUrl ? [{ url: imageUrl }] : undefined,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
        },
      };
    }
  } catch (e) {}

  return {
    title: 'Promovêre — Marketing Turístico',
    description: 'Especialistas en Promoción Turística y Comercialización Hotelera en LATAM.',
  };
}

export default async function DynamicInternalPage({ params }: PageProps) {
  const { slug } = await params;

  let pageDoc = null;
  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;

  try {
    const payload = await getPayload({ config });
    const [{ docs }, headerRes, footerRes, settingsRes] = await Promise.all([
      payload.find({
        collection: 'pages',
        where: {
          slug: { equals: slug },
        },
        depth: 2,
        limit: 1,
      }),
      payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
    ]);

    if (docs && docs.length > 0) {
      pageDoc = docs[0];
    }
    headerData = headerRes;
    footerData = footerRes;
    siteSettings = settingsRes;
  } catch (error) {
    console.error(`Error al consultar página con slug "${slug}":`, error);
  }

  if (!pageDoc || (pageDoc as any).isPublished === false) {
    notFound();
  }

  return (
    <PageLivePreview
      initialData={pageDoc}
      headerData={headerData}
      footerData={footerData}
      siteSettings={siteSettings}
      slug={slug}
    />
  );
}
