'use client';

import { useState, useEffect } from 'react';
import { useLivePreview, RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';
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

export interface PageLivePreviewProps {
  initialData: any;
  headerData?: any;
  footerData?: any;
  siteSettings?: any;
  slug?: string;
}

/**
 * Suscriptor exclusivo de Live Preview que solo se monta cuando la página está
 * dentro del iframe del Admin de Payload CMS y la hidratación ha finalizado.
 * Esto evita condiciones de carrera durante la hidratación de React 19 y
 * elimina errores de tipo #418 (Hydration text mismatch).
 */
function LivePreviewSubscriber({
  initialData,
  onDataChange,
}: {
  initialData: any;
  onDataChange: (data: any) => void;
}) {
  const router = useRouter();
  const serverURL = typeof window !== 'undefined' ? window.location.origin : '';

  const { data } = useLivePreview({
    initialData,
    serverURL,
    depth: 2,
  });

  useEffect(() => {
    if (data) {
      onDataChange(data);
    }
  }, [data, onDataChange]);

  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />;
}

export default function PageLivePreview({
  initialData,
  headerData,
  footerData,
  siteSettings,
  slug = 'home',
}: PageLivePreviewProps) {
  const [liveData, setLiveData] = useState<any>(null);
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    // Solo activamos Live Preview si estamos dentro del iframe o popup del admin de Payload
    const isInsideAdmin =
      typeof window !== 'undefined' &&
      (window.self !== window.top || Boolean(window.opener));
    if (isInsideAdmin) {
      setInIframe(true);
    }
  }, []);

  const page = inIframe && liveData ? liveData : initialData;
  const layout = (page?.layout as any[]) || [];
  const heroBlock = layout.find((b) => b.blockType === 'hero');

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
      {inIframe && (
        <LivePreviewSubscriber
          initialData={initialData}
          onDataChange={setLiveData}
        />
      )}

      <Navbar data={headerData} />

      {layout.length > 0 ? (
        layout.map((block, index) => renderBlock(block, index))
      ) : slug === 'home' ? (
        // Fallback por defecto para la Home si aún no hay bloques cargados
        <>
          <HeroSection data={heroBlock} />
          <ServicesSection />
          <RepresentationsSection />
          <DistributionSection />
          <PartnersSection />
          <ContactSection />
        </>
      ) : (
        // Fallback visual para páginas internas nuevas
        <div className="max-w-4xl mx-auto px-4 py-36 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] border border-[#1b87c7]/20 text-xs font-bold uppercase tracking-wider mb-4">
            Página Interna
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#4d4e4f] tracking-tight mb-6">
            {page?.title || 'Nueva Página'}
          </h1>
          <p className="text-base sm:text-lg text-[#4d4e4f]/70 max-w-xl mx-auto">
            Esta página no tiene bloques de contenido configurados todavía. Puedes agregarlos desde el panel de administración en <strong>/admin</strong>.
          </p>
        </div>
      )}

      <Footer data={footerData} settings={siteSettings} />
    </main>
  );
}
