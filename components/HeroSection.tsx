import Image from 'next/image';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { heroContent } from '@/data/content';

interface HeroSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    cta1Label?: string;
    cta1Href?: string;
    cta2Label?: string;
    cta2Href?: string;
    backgroundImage?: string;
  };
}

export default function HeroSection({ data }: HeroSectionProps = {}) {
  const badge = data?.badge || heroContent.badge;
  const title = data?.title || heroContent.title;
  const subtitle = data?.subtitle || heroContent.subtitle;
  const cta1Label = data?.cta1Label || heroContent.cta1.label;
  const cta1Href = data?.cta1Href || heroContent.cta1.href;
  const cta2Label = data?.cta2Label || heroContent.cta2.label;
  const cta2Href = data?.cta2Href || '/comunidad/login';
  const backgroundImage = data?.backgroundImage || heroContent.backgroundImage;

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Promoción turística en LATAM"
          fill
          priority
          quality={90}
          className="object-cover object-center brightness-90"
          sizes="100vw"
        />
        {/* Overlays corporativos */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4d4e4f]/80 via-[#4d4e4f]/70 to-[#4d4e4f]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b87c7]/30 to-transparent mix-blend-multiply" />
      </div>

      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge Institucional */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#3cac59] animate-pulse" />
          <span className="text-white text-xs sm:text-sm font-semibold tracking-wide uppercase">
            {badge}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-none">
          {title.includes('Promovêre') ? (
            <>
              {title.replace('Promovêre', '').trim()}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1b87c7] via-[#3cac59] to-[#1b87c7] animate-pulse">
                Promovêre
              </span>
            </>
          ) : (
            title
          )}
        </h1>

        {/* Tagline / Subtitle */}
        <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed font-light">
          {subtitle}
        </p>

        {/* CTAs Duales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          {/* CTA Principal - Azul Brillante */}
          <a
            href={cta1Href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#1b87c7] text-white font-bold text-base hover:bg-[#1571a8] active:bg-[#0f5b89] transition-all duration-200 shadow-xl shadow-[#1b87c7]/30 hover:-translate-y-0.5"
          >
            <Compass className="w-5 h-5 text-white" />
            {cta1Label}
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* CTA Secundario - Contorno con Acento Verde */}
          <a
            href={cta2Href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/30 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-[#3cac59]" />
            {cta2Label}
          </a>
        </div>
      </div>
    </section>
  );
}
