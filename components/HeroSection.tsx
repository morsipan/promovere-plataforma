import Image from 'next/image';
import { ChevronDown, ArrowRight, Play } from 'lucide-react';
import { heroContent } from '@/data/content';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroContent.backgroundImage}
          alt="Destino turístico"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Animated particles / subtle pattern */}
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/20 border border-brand-400/40 backdrop-blur-sm mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-brand-green-400 animate-pulse" />
          <span className="text-brand-100 text-xs font-semibold uppercase tracking-widest">
            {heroContent.badge}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight animate-slide-up">
          {heroContent.title.split(' ').map((word, i) => (
            <span
              key={i}
              className={
                i === 1
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-green-400'
                  : ''
              }
            >
              {i > 0 ? ' ' : ''}{word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-slide-up">
          {heroContent.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <a
            href={heroContent.cta1.href}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-green-500 text-white font-bold text-base hover:opacity-95 transition-all duration-300 shadow-2xl shadow-brand-500/40 hover:shadow-brand-500/60 hover:-translate-y-1"
          >
            {heroContent.cta1.label}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={heroContent.cta2.href}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 text-white font-bold text-base border border-white/25 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
          >
            <Play className="w-4 h-4 fill-current" />
            {heroContent.cta2.label}
          </a>
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '12+', label: 'Países' },
            { value: '500+', label: 'Agencias' },
            { value: '50K+', label: 'Viajeros / año' },
            { value: '15+', label: 'Años' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/50 font-medium mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <a href="#servicios" aria-label="Scroll down">
          <div className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors">
            <span className="text-xs font-medium uppercase tracking-widest">Explorar</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </a>
      </div>
    </section>
  );
}
