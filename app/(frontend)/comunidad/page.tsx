import PageLivePreview from '@/components/PageLivePreview';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Comunidad Promovêre | Espacio Exclusivo para Profesionales de Turismo',
  description:
    'Unite a la Comunidad Promovêre. Acceso exclusivo para agencias de viajes y operadores mayoristas: herramientas operativas, itinerarios con IA, promociones y fam tours.',
};

export default async function ComunidadLandingPage() {
  let comunidadPage: any = null;
  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;

  try {
    const payload = await getPayload({ config });

    const [pageRes, headerRes, footerRes, settingsRes] = await Promise.all([
      payload.find({
        collection: 'pages',
        where: {
          slug: { equals: 'comunidad' },
        },
        depth: 2,
        limit: 1,
      }),
      payload.findGlobal({ slug: 'header', depth: 2 }).catch(() => null),
      payload.findGlobal({ slug: 'footer', depth: 2 }).catch(() => null),
      payload.findGlobal({ slug: 'site-settings', depth: 2 }).catch(() => null),
    ]);

    if (pageRes.docs && pageRes.docs.length > 0) {
      comunidadPage = pageRes.docs[0];
    }
    headerData = headerRes;
    footerData = footerRes;
    siteSettings = settingsRes;
  } catch (error) {
    console.warn('Payload Comunidad Landing: usando configuración base.', error);
  }

  return (
    <PageLivePreview
      initialData={comunidadPage}
      headerData={headerData}
      footerData={footerData}
      siteSettings={siteSettings}
      slug="comunidad"
    />
  );
}
