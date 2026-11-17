import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import PageLivePreview from '@/components/PageLivePreview';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

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
    });

    if (docs && docs.length > 0) {
      return {
        title: `${docs[0].title} — Promovêre`,
      };
    }
  } catch (e) {}

  return {
    title: 'Promovêre — Turismo LATAM',
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

  if (!pageDoc) {
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
