import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommunityHero from '@/components/comunidad/landing/CommunityHero';
import CommercialToolsPreview from '@/components/comunidad/landing/CommercialToolsPreview';
import PromotionsEventsPreview from '@/components/comunidad/landing/PromotionsEventsPreview';
import SmartToolsPreview from '@/components/comunidad/landing/SmartToolsPreview';
import FeaturedProducts from '@/components/comunidad/landing/FeaturedProducts';
import WhatsAppBanner from '@/components/comunidad/landing/WhatsAppBanner';
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
  let landingData: any = null;

  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'comunidad' },
      },
      depth: 2,
      limit: 1,
    });

    if (docs && docs.length > 0) {
      const layout = (docs[0].layout as any[]) || [];
      const landingBlock = layout.find((b) => b.blockType === 'communityLanding');
      if (landingBlock) {
        landingData = landingBlock;
      }
    }
  } catch (error) {
    console.warn('Payload Comunidad Landing: usando configuración base de captura.');
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#4d4e4f] flex flex-col justify-between">
      {/* Navbar Institucional con CTA a Iniciar Sesión */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Principal con Switch Decorativo y Título "Bienvenido a tu espacio" */}
        <CommunityHero
          data={
            landingData && {
              title: landingData.heroTitle,
              subtitle: landingData.heroSubtitle,
              ctaText: landingData.heroCtaText,
            }
          }
        />

        {/* 2. Herramientas Comerciales (Pasaportes y Visas + FlightAware) con Candado */}
        <CommercialToolsPreview
          data={
            landingData && {
              badge: landingData.toolsBadge,
              title: landingData.toolsTitle,
              subtitle: landingData.toolsSubtitle,
            }
          }
        />

        {/* 3. Promociones, Eventos y Fam Tours (3 Columnas con botones azules al login) */}
        <PromotionsEventsPreview
          data={
            landingData && {
              badge: landingData.promotionsBadge,
              title: landingData.promotionsTitle,
              subtitle: landingData.promotionsSubtitle,
            }
          }
        />

        {/* 4. Herramientas Inteligentes para Vender (Mockup de IA Itinerarios + Fam Tour) */}
        <SmartToolsPreview
          data={
            landingData && {
              badge: landingData.smartToolsBadge,
              title: landingData.smartToolsTitle,
              subtitle: landingData.smartToolsSubtitle,
            }
          }
        />

        {/* 5. Productos Destacados (Postales Polaroid) & Destinos Principales */}
        <FeaturedProducts
          data={
            landingData && {
              badge: landingData.productsBadge,
              title: landingData.productsTitle,
              subtitle: landingData.productsSubtitle,
            }
          }
        />

        {/* 6. Franja de WhatsApp con Mockup de Teléfono y CTA */}
        <WhatsAppBanner
          data={
            landingData && {
              title: landingData.whatsappTitle,
              subtitle: landingData.whatsappSubtitle,
              ctaText: landingData.whatsappCtaText,
              phone: landingData.whatsappPhone,
            }
          }
        />
      </main>

      {/* Footer Oficial */}
      <Footer />
    </div>
  );
}
