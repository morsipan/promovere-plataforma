import Image from 'next/image';
import { Globe, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { distributionContent } from '@/data/content';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface StatItemCMS {
  value: string;
  label: string;
  description?: string;
}

interface ChannelItemCMS {
  title: string;
  description: string;
  coverage?: string;
}

interface DistributionSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    subtitle?: string;
    cta1Label?: string;
    cta1Href?: string;
    cta2Label?: string;
    cta2Href?: string;
    stats?: StatItemCMS[];
    channels?: ChannelItemCMS[];
  };
}

export default function DistributionSection({ data }: DistributionSectionProps = {}) {
  // Resolución dinámica de apariencia no-code
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'grisOscuro',
    theme: 'dark',
    overlayOpacity: 'media',
  });

  const badge = data?.badge || distributionContent.badge;
  const title = data?.title || distributionContent.title;
  const subtitle = data?.subtitle || distributionContent.subtitle;
  const cta1Label = data?.cta1Label || distributionContent.cta1.label;
  const cta1Href = data?.cta1Href || distributionContent.cta1.href;
  const cta2Label = data?.cta2Label || distributionContent.cta2.label;
  const cta2Href = data?.cta2Href || distributionContent.cta2.href;

  const stats =
    data?.stats && data.stats.length > 0 ? data.stats : distributionContent.stats;

  return (
    <section id="red" className={`py-20 md:py-28 relative overflow-hidden ${sectionAppearance.bgClass}`}>
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4d4e4f] via-[#2c2d2e] to-[#113d5b] opacity-95" />

      {/* Fondo de Imagen Opcional configurado en Apariencia */}
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo decorativo de red"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      {/* Decorative Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Decorative Blur Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#1b87c7]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#3cac59]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Content (7 cols) */}
          <div className="lg:col-span-7">
            {badge ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#3cac59] text-xs font-bold uppercase tracking-wider mb-6">
                <Globe className="w-3.5 h-3.5" />
                {badge}
              </div>
            ) : null}

            {title ? (
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight ${sectionAppearance.titleClass}`}>
                {title}
              </h2>
            ) : null}

            {subtitle ? (
              <p className={`text-base sm:text-lg leading-relaxed mb-8 ${sectionAppearance.subtitleClass}`}>
                {subtitle}
              </p>
            ) : null}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-10">
              {stats.map((stat, idx) => (
                <div
                  key={stat.label || `stat-${idx}`}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#1b87c7]/50 transition-colors"
                >
                  <div className="text-3xl sm:text-4xl font-black text-[#3cac59] mb-1 font-heading">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-xs sm:text-sm font-medium leading-tight font-sans">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              {cta1Label ? (
                <a
                  href={cta1Href}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#1b87c7] text-white font-bold text-sm hover:bg-[#1571a8] transition-all shadow-lg shadow-[#1b87c7]/30 hover:-translate-y-0.5"
                >
                  <span>{cta1Label}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : null}
              {cta2Label ? (
                <a
                  href={cta2Href}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-all"
                >
                  {cta2Label}
                </a>
              ) : null}
            </div>
          </div>

          {/* Right Column: Country Badges & Network Visual (5 cols) */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3cac59] mb-4">
              <MapPin className="w-4 h-4" />
              <span>Mercados Clave Cubiertos en LATAM</span>
            </div>

            <p className="text-xs text-white/70 mb-6">
              Relación comercial directa con los principales turoperadores mayoristas y redes de agencias de viajes:
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {distributionContent.countries.map((country) => (
                <span
                  key={country}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3cac59]" />
                  {country}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3cac59]" />
                <span>Capacitaciones presenciales y online periódicas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3cac59]" />
                <span>Acuerdos comerciales y de marketing cooperado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3cac59]" />
                <span>Soporte comercial in situ en eventos del trade</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
