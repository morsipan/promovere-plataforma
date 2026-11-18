import Image from 'next/image';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { heroContent } from '@/data/content';
import { getMediaUrl, getMediaAlt } from '@/lib/media';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface HeroSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    showBadgeIcon?: boolean;
    preTitle?: string;
    highlightedWord?: string;
    titleSuffix?: string;
    title?: string;
    subtitle?: string;
    cta1Label?: string;
    cta1Href?: string;
    cta2Label?: string;
    cta2Href?: string;
    backgroundImage?: unknown;
    backgroundImageUrl?: string;
  };
}

export default function HeroSection({ data }: HeroSectionProps = {}) {
  // Resolución dinámica de apariencia y contraste
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'grisOscuro',
    theme: 'dark',
    overlayOpacity: 'media',
  });

  const badge = data?.badge || heroContent.badge;
  const subtitle = data?.subtitle || heroContent.subtitle;
  const cta1Label = data?.cta1Label || heroContent.cta1.label;
  const cta1Href = data?.cta1Href || heroContent.cta1.href;
  const cta2Label = data?.cta2Label || heroContent.cta2.label;
  const cta2Href = data?.cta2Href || '/comunidad/login';

  const explicitBgColor = data?.appearance?.backgroundColor;
  const hasUploadedImage = Boolean(data?.appearance?.backgroundImage || data?.backgroundImage || data?.backgroundImageUrl);
  const backgroundImageUrl =
    sectionAppearance.backgroundImageUrl ||
    getMediaUrl(data?.backgroundImage, data?.backgroundImageUrl || (hasUploadedImage || !explicitBgColor ? heroContent.backgroundImage : ''));

  const backgroundImageAlt = getMediaAlt(
    data?.appearance?.backgroundImage || data?.backgroundImage,
    'Promovêre — Promoción Turística y Comercialización en LATAM',
  );

  // Lógica de Título Protegido
  const preTitle = data?.preTitle !== undefined ? data.preTitle : 'Somos';
  const highlightedWord = data?.highlightedWord !== undefined ? data.highlightedWord : 'Promovêre';
  const titleSuffix = data?.titleSuffix || '';
  const fallbackTitle = data?.title || heroContent.title;

  const renderTitle = () => {
    if (preTitle || highlightedWord) {
      return (
        <h1
          suppressHydrationWarning
          className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-none ${sectionAppearance.titleClass}`}
        >
          {preTitle ? <span>{preTitle}&nbsp;</span> : null}
          {highlightedWord ? (
            <span className={`${sectionAppearance.accentTextClass} font-heading drop-shadow-md`}>
              {highlightedWord}
            </span>
          ) : null}
          {titleSuffix ? <span>&nbsp;{titleSuffix}</span> : null}
        </h1>
      );
    }

    if (fallbackTitle && fallbackTitle.includes('Promovêre')) {
      const [before, after] = fallbackTitle.split('Promovêre');
      return (
        <h1
          suppressHydrationWarning
          className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-none ${sectionAppearance.titleClass}`}
        >
          {before ? <span>{before}&nbsp;</span> : null}
          <span className={`${sectionAppearance.accentTextClass} font-heading drop-shadow-md`}>
            Promovêre
          </span>
          {after ? <span>&nbsp;{after}</span> : null}
        </h1>
      );
    }

    return (
      <h1
        suppressHydrationWarning
        className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-none ${sectionAppearance.titleClass}`}
      >
        {fallbackTitle}
      </h1>
    );
  };

  return (
    <section className={`relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden ${sectionAppearance.bgClass}`}>
      {/* Imagen de Fondo Gestionada por CMS con Capa de Superposición */}
      {backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImageUrl}
            alt={backgroundImageAlt}
            fill
            priority
            quality={90}
            className="object-cover object-center brightness-90"
            sizes="100vw"
          />
          {/* Capa de contraste dinámica configurada por el usuario */}
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b87c7]/30 to-transparent mix-blend-multiply" />
        </div>
      ) : null}

      {/* Trama decorativa de fondo */}
      <div
        className="absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Contenedor de Contenido Principal */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge Institucional */}
        {badge ? (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 shadow-sm ${sectionAppearance.badgeClass}`}>
            {data?.showBadgeIcon !== false && (
              <span className={`w-2 h-2 rounded-full ${sectionAppearance.badgeIconClass.includes('text-[#3cac59]') ? 'bg-[#3cac59]' : sectionAppearance.accentBgClass} animate-pulse`} />
            )}
            <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-sans">
              {badge}
            </span>
          </div>
        ) : null}

        {/* Título Principal con Estilo Protegido y Contraste Dinámico */}
        {renderTitle()}

        {/* Subtítulo / Bajada */}
        {subtitle ? (
          <p className={`text-base sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed font-light ${sectionAppearance.subtitleClass}`}>
            {subtitle}
          </p>
        ) : null}

        {/* Botones de Acción (CTAs Duales) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          {/* CTA Principal */}
          {cta1Label ? (
            <a
              href={cta1Href}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5 ${sectionAppearance.buttonClass}`}
            >
              <Compass className="w-5 h-5 text-current" />
              <span>{cta1Label}</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          ) : null}

          {/* CTA Secundario */}
          {cta2Label ? (
            <a
              href={cta2Href}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5 ${sectionAppearance.secondaryButtonClass}`}
            >
              <Sparkles className={`w-5 h-5 ${sectionAppearance.accentTextClass}`} />
              <span>{cta2Label}</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
