import PageLivePreview from '@/components/PageLivePreview';
import { getPayload } from 'payload';
import config from '@payload-config';
import { getMediaUrl } from '@/lib/media';
import { sortPressItemsNewestFirst } from '@/lib/press';
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
  let blogSettings: any = null;
  let blogPosts: any[] = [];
  let pressItems: any[] = [];

  try {
    const payload = await getPayload({ config });
    const [pagesRes, headerRes, footerRes, settingsRes, blogSettingsRes, blogRes, pressRes] = await Promise.all([
      payload
        .find({
          collection: 'pages',
          where: {
            slug: { equals: 'home' },
          },
          depth: 2,
        })
        .catch((err) => {
          console.error('Error consultando página home en Payload CMS:', err?.message || err);
          return { docs: [] };
        }),
      payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'blog-settings', depth: 1 }).catch(() => null),
      payload
        .find({
          collection: 'blog-posts',
          where: { status: { equals: 'published' } },
          sort: '-createdAt',
          depth: 1,
          limit: 6,
        })
        .catch(() => ({ docs: [] })),
      payload
        .find({
          collection: 'press-items',
          where: { status: { equals: 'published' } },
          sort: '-createdAt',
          depth: 1,
          limit: 100,
        })
        .catch(() => ({ docs: [] })),
    ]);

    if (pagesRes?.docs && pagesRes.docs.length > 0) {
      homePage = pagesRes.docs[0];
    }
    headerData = headerRes;
    footerData = footerRes;
    siteSettings = settingsRes;
    blogSettings = blogSettingsRes;
    blogPosts = blogRes?.docs || [];
    pressItems = sortPressItemsNewestFirst(pressRes?.docs || []).slice(0, 6);
  } catch (error) {
    console.warn('Payload Pages: cargando contenido estático por defecto.');
  }

  return (
    <PageLivePreview
      initialData={homePage}
      headerData={headerData}
      footerData={footerData}
      siteSettings={siteSettings}
      blogSettings={blogSettings}
      blogPosts={blogPosts}
      pressItems={pressItems}
      slug="home"
    />
  );
}
