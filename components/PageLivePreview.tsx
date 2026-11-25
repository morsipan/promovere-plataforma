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
import FullWidthImageSection from '@/components/blocks/FullWidthImageSection';
import ImpactBanner from '@/components/blocks/ImpactBanner';
import PartnersMarquee from '@/components/blocks/PartnersMarquee';
import BlogSection from '@/components/blocks/BlogSection';
import PressSection from '@/components/blocks/PressSection';
import PrMetricsSection from '@/components/blocks/PrMetricsSection';
import CommunityHero from '@/components/comunidad/landing/CommunityHero';
import CommercialToolsPreview from '@/components/comunidad/landing/CommercialToolsPreview';
import PromotionsEventsPreview from '@/components/comunidad/landing/PromotionsEventsPreview';
import SmartToolsPreview from '@/components/comunidad/landing/SmartToolsPreview';
import FeaturedProducts from '@/components/comunidad/landing/FeaturedProducts';
import WhatsAppBanner from '@/components/comunidad/landing/WhatsAppBanner';
import type { CSSProperties } from 'react';

const PAGE_BG_MAP: Record<string, string> = {
  blancoHumo: 'bg-[#f9f9f9]',
  blanco: 'bg-white',
  grisOscuro: 'bg-[#4d4e4f]',
  azul: 'bg-[#1b87c7]',
  verde: 'bg-[#3cac59]',
};

const PAGE_TEXT_MAP: Record<string, string> = {
  grisOscuro: 'text-[#4d4e4f]',
  blancoHumo: 'text-[#f9f9f9]',
  blanco: 'text-white',
};

const PAGE_HEADING_HEX_MAP: Record<string, string> = {
  grisOscuro: '#4d4e4f',
  azul: '#1b87c7',
  verde: '#3cac59',
  blanco: '#ffffff',
};

const PAGE_ACCENT_HEX_MAP: Record<string, string> = {
  azul: '#1b87c7',
  verde: '#3cac59',
};

export interface PageLivePreviewProps {
  initialData: any;
  headerData?: any;
  footerData?: any;
  siteSettings?: any;
  blogSettings?: any;
  blogPosts?: any[];
  pressItems?: any[];
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
  blogSettings,
  blogPosts,
  pressItems,
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
  const hasBlogBlock = layout.some((b) => b.blockType === 'blog');
  const hasPressBlock = layout.some((b) => b.blockType === 'press');
  const hasPrMetricsBlock = layout.some((b) => b.blockType === 'prMetrics');
  const hasTestimonialsBlock = layout.some((b) => b.blockType === 'testimonials');
  const distributionBlockIndex = layout.findIndex((b) => b.blockType === 'distribution');
  const contactBlockIndex = layout.findIndex((b) => b.blockType === 'contact');

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
      case 'fullWidthImage':
        return <FullWidthImageSection key={`block-${index}`} data={block} />;
      case 'impactBanner':
        return <ImpactBanner key={`block-${index}`} data={block} />;
      case 'partnersMarquee':
        return <PartnersMarquee key={`block-${index}`} data={block} />;
      case 'blog':
        return (
          <BlogSection
            key={`block-${index}`}
            data={block}
            collectionPosts={blogPosts}
            blogSettings={blogSettings}
            hideViewAllCta={slug === 'blog'}
            showFilters={slug === 'blog'}
            maxItems={slug === 'home' ? 6 : undefined}
          />
        );
      case 'press':
        return (
          <PressSection
            key={`block-${index}`}
            data={block}
            collectionItems={pressItems}
            hideViewAllCta={slug === 'prensa'}
            showFilters={slug === 'prensa'}
            maxItems={slug === 'home' ? 6 : undefined}
          />
        );
      case 'prMetrics':
        return <PrMetricsSection key={`block-${index}`} data={block} />;
      case 'communityHero':
        return <CommunityHero key={`block-${index}`} data={block} />;
      case 'communityCommercialTools':
        return <CommercialToolsPreview key={`block-${index}`} data={block} />;
      case 'communityPromotionsPreview':
        return <PromotionsEventsPreview key={`block-${index}`} data={block} />;
      case 'communitySmartTools':
        return <SmartToolsPreview key={`block-${index}`} data={block} />;
      case 'communityFeaturedProducts':
        return <FeaturedProducts key={`block-${index}`} data={block} />;
      case 'communityWhatsApp':
        return <WhatsAppBanner key={`block-${index}`} data={block} />;
      case 'communityLanding':
        return (
          <div key={`block-${index}`}>
            <CommunityHero
              data={{
                title: block.heroTitle,
                subtitle: block.heroSubtitle,
                ctaText: block.heroCtaText,
              }}
            />
            <CommercialToolsPreview
              data={{
                badge: block.toolsBadge,
                title: block.toolsTitle,
                subtitle: block.toolsSubtitle,
              }}
            />
            <PromotionsEventsPreview
              data={{
                badge: block.promotionsBadge,
                title: block.promotionsTitle,
                subtitle: block.promotionsSubtitle,
              }}
            />
            <SmartToolsPreview
              data={{
                badge: block.smartToolsBadge,
                title: block.smartToolsTitle,
                subtitle: block.smartToolsSubtitle,
              }}
            />
            <FeaturedProducts
              data={{
                badge: block.productsBadge,
                title: block.productsTitle,
                subtitle: block.productsSubtitle,
              }}
            />
            <WhatsAppBanner
              data={{
                title: block.whatsappTitle,
                subtitle: block.whatsappSubtitle,
                ctaText: block.whatsappCtaText,
                phone: block.whatsappPhone,
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const pageBgClass = PAGE_BG_MAP[page?.pageStyles?.backgroundColor || 'blancoHumo'] || 'bg-[#f9f9f9]';
  const pageTextClass = PAGE_TEXT_MAP[page?.pageStyles?.textColor || 'grisOscuro'] || 'text-[#4d4e4f]';
  const pageStyleVars: CSSProperties & Record<string, string> = {};
  if (page?.pageStyles?.headingColor && PAGE_HEADING_HEX_MAP[page.pageStyles.headingColor]) {
    pageStyleVars['--promovere-antracita'] = PAGE_HEADING_HEX_MAP[page.pageStyles.headingColor];
  }
  if (page?.pageStyles?.accentColor && PAGE_ACCENT_HEX_MAP[page.pageStyles.accentColor]) {
    pageStyleVars['--page-accent'] = PAGE_ACCENT_HEX_MAP[page.pageStyles.accentColor];
  }

  return (
    <main className={`min-h-screen ${pageBgClass} ${pageTextClass}`} style={pageStyleVars}>
      {inIframe && (
        <LivePreviewSubscriber
          initialData={initialData}
          onDataChange={setLiveData}
        />
      )}

      <Navbar data={headerData} />

      {layout.length > 0 ? (
        <>
          {layout.map((block, index) => (
            <div key={`block-wrap-${block.id || index}`}>
              {slug === 'home' && index === distributionBlockIndex && !hasPrMetricsBlock ? (
                <PrMetricsSection />
              ) : null}
              {slug === 'home' && index === contactBlockIndex && !hasTestimonialsBlock ? (
                <TestimonialsSection />
              ) : null}
              {slug === 'home' && index === contactBlockIndex && !hasBlogBlock ? (
                <BlogSection collectionPosts={blogPosts} blogSettings={blogSettings} />
              ) : null}
              {slug === 'home' && index === contactBlockIndex && !hasPressBlock ? (
                <PressSection collectionItems={pressItems} maxItems={6} />
              ) : null}
              {renderBlock(block, index)}
            </div>
          ))}
          {slug === 'home' && distributionBlockIndex === -1 && !hasPrMetricsBlock ? (
            <PrMetricsSection />
          ) : null}
          {slug === 'home' && contactBlockIndex === -1 && !hasTestimonialsBlock ? (
            <TestimonialsSection />
          ) : null}
          {slug === 'home' && contactBlockIndex === -1 && !hasBlogBlock ? (
            <BlogSection collectionPosts={blogPosts} blogSettings={blogSettings} />
          ) : null}
          {slug === 'home' && contactBlockIndex === -1 && !hasPressBlock ? (
            <PressSection collectionItems={pressItems} maxItems={6} />
          ) : null}
        </>
      ) : slug === 'home' ? (
        // Fallback por defecto para la Home si aún no hay bloques cargados
        <>
          <HeroSection data={heroBlock} />
          <ServicesSection />
          <RepresentationsSection />
          <PrMetricsSection />
          <DistributionSection />
          <PartnersSection />
          <TestimonialsSection />
          <BlogSection collectionPosts={blogPosts} blogSettings={blogSettings} />
          <PressSection collectionItems={pressItems} maxItems={6} />
          <ContactSection />
        </>
      ) : slug === 'comunidad' ? (
        // Fallback por defecto para la Landing de Comunidad si aún no hay bloques cargados
        <>
          <CommunityHero />
          <CommercialToolsPreview />
          <PromotionsEventsPreview />
          <SmartToolsPreview />
          <FeaturedProducts />
          <WhatsAppBanner />
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
