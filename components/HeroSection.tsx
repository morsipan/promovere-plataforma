import Image from 'next/image';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { heroContent } from '@/data/content';
import { getMediaUrl, getMediaAlt } from '@/lib/media';

interface HeroSectionProps {
  data?: {
    badge?: string;
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
  const badge = data?.badge || heroContent.badge;
  const subtitle = data?.subtitle || heroContent.subtitle;
  const cta1Label = data?.cta1Label || heroContent.cta1.label;
  const cta1Href = data?.cta1Href || heroContent.cta1.href;
  const cta2Label = data?.cta2Label || heroContent.cta2.label;
  const cta2Href = data?.cta2Href || '/comunidad/login';

  // Obtener URL e información accesible de la imagen de fondo desde Payload Media
  const backgroundImageUrl = getMediaUrl(
    data?.backgroundImage,
    data?.backgroundImageUrl || heroContent.backgroundImage,
  );
  const backgroundImageAlt = getMediaAlt(
    data?.backgroundImage,
    'Promovêre — Promoción Turística y Comercialización en LATAM',
  );

  // Lógica de Título Protegido:
  // Permite al cliente destacar la palabra clave en Azul Brillante (#1b87c7) sin alterar tipografías
  const preTitle = data?.preTitle !== undefined ? data.preTitle : 'Somos';
  const highlightedWord = data?.highlightedWord !== undefined ? data.highlightedWord : 'Promovêre';
  const titleSuffix = data?.titleSuffix || '';
  const fallbackTitle = data?.title || heroContent.title;

  const renderTitle = () => {
    // Si se especificaron campos estructurados
    if (preTitle || highlightedWord) {
      return (
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-none font-heading">
          {preTitle && <span>{preTitle} </span>}
          {highlightedWord && (
            <span className="text-[#1b87c7] font-heading drop-shadow-md">
              {highlightedWord}
            </span>
          )}
          {titleSuffix && <span> {titleSuffix}</span>}
        </h1>
      );
    }

    // Fallback si solo vino un string plano en 'title'
    if (fallbackTitle.includes('Promovêre')) {
      const [before, after] = fallbackTitle.split('Promovêre');
      return (
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-none font-heading">
          {before}
          <span className="text-[#1b87c7] font-heading drop-shadow-md">
            Promovêre
          </span>
          {after}
        </h1>
      );
    }

    return (
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-none font-heading">
        {fallbackTitle}
      </h1>
    );
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Imagen de Fondo Gestionada por CMS */}
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
        {/* Overlays corporativos de protección de contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4d4e4f]/80 via-[#4d4e4f]/70 to-[#4d4e4f]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b87c7]/30 to-transparent mix-blend-multiply" />
      </div>

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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#3cac59] animate-pulse" />
          <span className="text-white text-xs sm:text-sm font-semibold tracking-wide uppercase font-sans">
            {badge}
          </span>
        </div>

        {/* Título Principal con Estilo Protegido */}
        {renderTitle()}

        {/* Subtítulo / Bajada */}
        <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed font-light font-sans">
          {subtitle}
        </p>

        {/* Botones de Acción (CTAs Duales) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          {/* CTA Principal - Azul Brillante */}
          <a
            href={cta1Href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#1b87c7] text-white font-bold text-base hover:bg-[#1571a8] active:bg-[#0f5b89] transition-all duration-200 shadow-xl shadow-[#1b87c7]/30 hover:-translate-y-0.5"
          >
            <Compass className="w-5 h-5 text-white" />
            <span>{cta1Label}</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* CTA Secundario - Contorno con Acento Verde */}
          <a
            href={cta2Href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/30 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-[#3cac59]" />
            <span>{cta2Label}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
