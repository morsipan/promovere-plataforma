import PageLivePreview from '@/components/PageLivePreview';
import { getPayload } from 'payload';
import config from '@payload-config';
import { getMediaUrl } from '@/lib/media';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      depth: 1,
      limit: 1,
    });

    const page = docs?.[0] as any;
    const meta = page?.meta;
    const title =
      meta?.title ||
      (page?.title ? `${page.title} — Promovêre` : 'Promovêre — Marketing Turístico');
    const description =
      meta?.description ||
      'Conectamos marcas, cadenas hoteleras y destinos de clase mundial con el trade turístico de América Latina.';
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
  } catch (e) {
    return {
      title: 'Promovêre — Marketing Turístico',
      description: 'Especialistas en Promoción Turística y Comercialización Hotelera en LATAM.',
    };
  }
}

export default async function Home() {
  let homePage = null;
  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;

  try {
    const payload = await getPayload({ config });
    const [pagesRes, headerRes, footerRes, settingsRes] = await Promise.all([
      payload
        .find({
          collection: 'pages',
          where: {
            slug: { equals: 'home' },
          },
          depth: 2,
        })
        .catch(() => ({ docs: [] })),
      payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
    ]);

    if (pagesRes?.docs && pagesRes.docs.length > 0) {
      homePage = pagesRes.docs[0];
    }
    headerData = headerRes;
    footerData = footerRes;
    siteSettings = settingsRes;
  } catch (error) {
    console.warn('Payload Pages: cargando contenido estático por defecto.');
  }

  return (
    <PageLivePreview
      initialData={homePage}
      headerData={headerData}
      footerData={footerData}
      siteSettings={siteSettings}
      slug="home"
    />
  );
}
