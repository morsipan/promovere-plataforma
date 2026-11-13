import { ArrowRight, MapPin } from 'lucide-react';
import { distributionContent } from '@/data/content';

const countries = [
  { name: 'Argentina', coords: { top: '78%', left: '30%' } },
  { name: 'Brasil', coords: { top: '65%', left: '38%' } },
  { name: 'Chile', coords: { top: '78%', left: '25%' } },
  { name: 'Colombia', coords: { top: '48%', left: '28%' } },
  { name: 'México', coords: { top: '30%', left: '15%' } },
  { name: 'Uruguay', coords: { top: '82%', left: '32%' } },
  { name: 'Perú', coords: { top: '58%', left: '24%' } },
  { name: 'Ecuador', coords: { top: '50%', left: '22%' } },
];

export default function DistributionSection() {
  return (
    <section id="red" className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900" />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-brand-200 text-xs font-semibold uppercase tracking-widest mb-6">
              {distributionContent.badge}
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {distributionContent.title}
            </h2>

            <p className="text-white/60 text-lg leading-relaxed mb-10">
              {distributionContent.subtitle}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {distributionContent.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="text-3xl font-black text-brand-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/50 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={distributionContent.cta1.href}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-400 transition-all duration-200 shadow-lg shadow-brand-500/30"
              >
                {distributionContent.cta1.label}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={distributionContent.cta2.href}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                {distributionContent.cta2.label}
              </a>
            </div>
          </div>

          {/* Right: Map visualization */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Map background */}
              <div className="absolute inset-0 rounded-3xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm flex items-center justify-center">
                <svg viewBox="0 0 400 500" className="w-4/5 opacity-20 fill-white">
                  {/* Simplified LATAM silhouette */}
                  <path d="M180,20 L220,15 L250,30 L260,60 L240,90 L260,120 L270,150 L250,180 L240,210 L260,240 L270,280 L260,320 L240,360 L220,390 L200,420 L190,450 L180,470 L170,460 L160,430 L150,400 L140,370 L130,340 L140,300 L130,260 L120,220 L130,180 L120,150 L110,120 L120,90 L130,60 L140,30 Z" />
                  <path d="M80,80 L110,70 L120,90 L110,120 L100,100 L80,110 Z" />
                  <path d="M60,140 L80,130 L100,140 L90,160 L70,165 Z" />
                </svg>

                {/* Pulsing dots for countries */}
                {countries.map((country) => (
                  <div
                    key={country.name}
                    className="absolute group/dot"
                    style={{ top: country.coords.top, left: country.coords.left }}
                  >
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-brand-400 shadow-lg shadow-brand-400/50 animate-pulse" />
                      <div className="absolute -inset-2 rounded-full bg-brand-400/20 animate-ping" />
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-lg bg-white text-gray-900 text-xs font-bold shadow-lg opacity-0 group-hover/dot:opacity-100 transition-opacity">
                        {country.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connection lines (decorative) */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center backdrop-blur-sm">
                <MapPin className="w-8 h-8 text-brand-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
