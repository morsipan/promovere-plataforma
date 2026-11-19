'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { resolveAppearance, type AppearanceData } from '@/lib/appearance';

interface CommunityHeroProps {
  data?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    appearance?: AppearanceData;
  };
}

export default function CommunityHero({ data }: CommunityHeroProps = {}) {
  const [activeTab, setActiveTab] = useState<'minoristas' | 'mayoristas'>('minoristas');

  const title = data?.title || 'Bienvenido a tu espacio';
  const subtitle =
    data?.subtitle ||
    'Tu Comunidad Promovêre es una plataforma exclusiva pensada para potenciar tu gestión turística diaria, acceder a herramientas clave en tiempo real y conectar de forma directa con las mejores marcas, cadenas y destinos de América Latina.';
  const ctaText = data?.ctaText || 'Iniciá sesión para acceder a tu espacio';

  const app = resolveAppearance(data?.appearance, {
    backgroundColor: 'verde',
    theme: 'dark',
    accentColor: 'blanco',
    buttonColor: 'blanco',
    badgeColor: 'blanco',
  });
  const hasCustomBg = Boolean(
    data?.appearance?.backgroundColor && data.appearance.backgroundColor !== 'verde'
  );
  const sectionBgClass = hasCustomBg
    ? app.bgClass
    : 'bg-gradient-to-br from-[#27ae60] via-[#2ecc71] to-[#1b87c7]';

  return (
    <section
      className={`relative overflow-hidden ${sectionBgClass} ${app.isDark ? 'text-white' : 'text-[#4d4e4f]'} pt-28 pb-20 md:pt-36 md:pb-28`}
    >
      {app.backgroundImageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${app.backgroundImageUrl})` }}
          />
          <div className={`absolute inset-0 ${app.overlayClass}`} />
        </>
      )}
      {/* Decorative Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Decorative Glow Circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#1b87c7]/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge Superior */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-sm ${app.badgeClass}`}
        >
          <Sparkles className={`w-4 h-4 ${app.badgeIconClass}`} />
          <span>Comunidad Promovêre • Portal Trade Oficial</span>
        </div>

        {/* Título Principal (Baloo Da 2) */}
        <h1
          className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-sm ${app.titleClass}`}
        >
          {title}
        </h1>

        {/* Switch / Toggle Visual Decorativo */}
        <div className="inline-flex p-1.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 mb-8 max-w-sm mx-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('minoristas')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'minoristas'
                ? 'bg-white text-[#27ae60] shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Agencias Minoristas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mayoristas')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'mayoristas'
                ? 'bg-white text-[#1b87c7] shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Operadores Mayoristas
          </button>
        </div>

        {/* Texto Introductorio */}
        <p className="text-base sm:text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          {subtitle}
        </p>

        {/* CTA Principal de Acceso */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/comunidad/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#27ae60] font-black text-base hover:bg-slate-50 transition-all duration-200 shadow-2xl shadow-black/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Lock className="w-5 h-5 text-[#27ae60]" />
            <span>{ctaText}</span>
            <ArrowRight className="w-5 h-5 text-[#27ae60]" />
          </Link>
        </div>

        {/* Garantías y Beneficios en Pills */}
        <div className="mt-10 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-white/90">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
            Acceso 100% gratuito para el trade
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-white" />
            Plataforma B2B con validación estricta
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-white" />
            Herramientas potenciadas con IA
          </span>
        </div>
      </div>
    </section>
  );
}
