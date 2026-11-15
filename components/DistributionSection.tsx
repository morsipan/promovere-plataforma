import { Globe, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { distributionContent } from '@/data/content';

export default function DistributionSection() {
  return (
    <section id="red" className="py-20 md:py-28 relative overflow-hidden bg-[#4d4e4f] text-white">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4d4e4f] via-[#2c2d2e] to-[#113d5b] opacity-95" />

      {/* Decorative Grid */}
      <div
        className="absolute inset-0 opacity-10"
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#3cac59] text-xs font-bold uppercase tracking-wider mb-6">
              <Globe className="w-3.5 h-3.5" />
              {distributionContent.badge}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {distributionContent.title}
            </h2>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8">
              {distributionContent.subtitle}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-10">
              {distributionContent.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#1b87c7]/50 transition-colors"
                >
                  <div className="text-3xl sm:text-4xl font-black text-[#3cac59] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-xs sm:text-sm font-medium leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={distributionContent.cta1.href}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#1b87c7] text-white font-bold text-sm hover:bg-[#1571a8] transition-all shadow-lg shadow-[#1b87c7]/30 hover:-translate-y-0.5"
              >
                {distributionContent.cta1.label}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={distributionContent.cta2.href}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-all"
              >
                {distributionContent.cta2.label}
              </a>
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
