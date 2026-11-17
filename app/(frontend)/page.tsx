import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import RepresentationsSection from '@/components/RepresentationsSection';
import DistributionSection from '@/components/DistributionSection';
import PartnersSection from '@/components/PartnersSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FAQSection from '@/components/blocks/FAQSection';
import TestimonialsSection from '@/components/blocks/TestimonialsSection';
import CtaBannerSection from '@/components/blocks/CtaBannerSection';
import StatsSection from '@/components/blocks/StatsSection';
import GallerySection from '@/components/blocks/GallerySection';
import TimelineSection from '@/components/blocks/TimelineSection';
import RichTextSection from '@/components/blocks/RichTextSection';
import PromovereAnimCounterSection from '@/components/blocks/PromovereAnimCounterSection';
import { getPayload } from 'payload';
import config from '@payload-config';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let homePage = null;

  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
      },
      depth: 2,
    });
    if (docs && docs.length > 0) {
      homePage = docs[0];
    }
  } catch (error) {
    console.warn('Payload Pages: cargando contenido estático por defecto.');
  }

  // Extracción de bloques de contenido desde Payload
  const layout = (homePage?.layout as any[]) || [];
  const heroBlock = layout.find((b) => b.blockType === 'hero');

  // Mapeo dinámico de bloques
  const renderBlock = (block: any, index: number) => {
    switch (block.blockType) {
      case 'hero':
        return <HeroSection key={`block-${index}`} data={block} />;
      case 'services':
        return <ServicesSection key={`block-${index}`} data={block} />;
      case 'representations':
        return <RepresentationsSection key={`block-${index}`} data={block} />;
      case 'distribution':
        return <DistributionSection key={`block-${index}`} data={block} />;
      case 'partners':
        return <PartnersSection key={`block-${index}`} data={block} />;
      case 'contact':
        return <ContactSection key={`block-${index}`} data={block} />;
      case 'faq':
        return <FAQSection key={`block-${index}`} data={block} />;
      case 'testimonials':
        return <TestimonialsSection key={`block-${index}`} data={block} />;
      case 'ctaBanner':
        return <CtaBannerSection key={`block-${index}`} data={block} />;
      case 'stats':
        return <StatsSection key={`block-${index}`} data={block} />;
      case 'gallery':
        return <GallerySection key={`block-${index}`} data={block} />;
      case 'timeline':
        return <TimelineSection key={`block-${index}`} data={block} />;
      case 'richText':
        return <RichTextSection key={`block-${index}`} data={block} />;
      case 'promovereAnimCounter':
        return <PromovereAnimCounterSection key={`block-${index}`} data={block} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      <Navbar />

      {layout.length > 0 ? (
        // Render dinámico de los bloques configurados en el CMS
        layout.map((block, index) => renderBlock(block, index))
      ) : (
        // Fallback por defecto si aún no hay bloques guardados en la BD
        <>
          <HeroSection data={heroBlock} />
          <ServicesSection />
          <RepresentationsSection />
          <DistributionSection />
          <PartnersSection />
          <ContactSection />
        </>
      )}

      <Footer />
    </main>
  );
}
