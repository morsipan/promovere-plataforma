import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import RepresentationsSection from '@/components/RepresentationsSection';
import DistributionSection from '@/components/DistributionSection';
import PartnersSection from '@/components/PartnersSection';
import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/blocks/FAQSection';
import TestimonialsSection from '@/components/blocks/TestimonialsSection';
import CtaBannerSection from '@/components/blocks/CtaBannerSection';
import StatsSection from '@/components/blocks/StatsSection';
import GallerySection from '@/components/blocks/GallerySection';
import TimelineSection from '@/components/blocks/TimelineSection';
import RichTextSection from '@/components/blocks/RichTextSection';
import PromovereAnimCounterSection from '@/components/blocks/PromovereAnimCounterSection';
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

  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      depth: 2,
      limit: 1,
    });

    if (docs && docs.length > 0) {
      pageDoc = docs[0];
    }
  } catch (error) {
    console.error(`Error al consultar página con slug "${slug}":`, error);
  }

  if (!pageDoc) {
    notFound();
  }

  const layout = (pageDoc.layout as any[]) || [];

  const renderBlock = (block: any, index: number) => {
    switch (block.blockType) {
      case 'hero':
        return <HeroSection key={`block-${index}`} data={block} />;
      case 'services':
        return <ServicesSection key={`block-${index}`} />;
      case 'representations':
        return <RepresentationsSection key={`block-${index}`} />;
      case 'distribution':
        return <DistributionSection key={`block-${index}`} />;
      case 'partners':
        return <PartnersSection key={`block-${index}`} />;
      case 'contact':
        return <ContactSection key={`block-${index}`} />;
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
        layout.map((block, index) => renderBlock(block, index))
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-36 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] border border-[#1b87c7]/20 text-xs font-bold uppercase tracking-wider mb-4">
            Página Interna
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#4d4e4f] tracking-tight mb-6">
            {pageDoc.title}
          </h1>
          <p className="text-base sm:text-lg text-[#4d4e4f]/70 max-w-xl mx-auto">
            Esta página no tiene bloques de contenido configurados todavía. Puedes agregarlos desde el panel de administración en <strong>/admin</strong>.
          </p>
        </div>
      )}

      <Footer />
    </main>
  );
}
