import PageLivePreview from '@/components/PageLivePreview';
import { getPayload } from 'payload';
import config from '@payload-config';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let homePage = null;
  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;

  try {
    const payload = await getPayload({ config });
    const [{ docs }, headerRes, footerRes, settingsRes] = await Promise.all([
      payload.find({
        collection: 'pages',
        where: {
          slug: { equals: 'home' },
        },
        depth: 2,
      }),
      payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
    ]);

    if (docs && docs.length > 0) {
      homePage = docs[0];
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
