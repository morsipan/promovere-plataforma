'use client';

import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import NativeLeadForm from '@/components/NativeLeadForm';
import type { NativeFormType } from '@/lib/integrations/forms';

export interface TallyBannerProps {
  /** Título principal del banner */
  title?: string;
  /** Bajada o subtítulo explicativo */
  subtitle?: string;
  /** Texto del botón de acción */
  ctaText?: string;
  /** Prop conservada por compatibilidad hacia atrás (reemplazado por formulario nativo Make/Doppler) */
  tallyFormId?: string;
  /** Tipo de formulario nativo para segmentación en Make y Doppler */
  formType?: NativeFormType;
  /** Etiqueta de origen para analítica y segmentación */
  source?: string;
  /** Badge / Etiqueta superior opcional */
  badge?: string;
  /** Variante de fondo: degradado corporativo, azul sólido o verde */
  backgroundVariant?: 'gradient' | 'blue' | 'green';
  /** Clases CSS adicionales para el contenedor de la sección */
  className?: string;
}

/**
 * Banner CTA con modal de Formulario Nativo conectado a Make y Doppler
 * (reemplaza el embed externo de Tally manteniendo compatibilidad de props).
 */
export const TallyBanner: React.FC<TallyBannerProps> = ({
  title = '¿Listo para acelerar tus ventas turísticas en la región?',
  subtitle = 'Conectamos tu marca hotelera o destino con operadores mayoristas y agencias de viajes en LATAM. Coordiná una reunión con nuestro equipo.',
  ctaText = 'Contactar a Promovêre',
  formType = 'contacto_comercial',
  source = 'cta-native-banner',
  badge = 'Atención Personalizada B2B',
  backgroundVariant = 'gradient',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const backgroundClasses = {
    gradient:
      'bg-gradient-to-r from-[#1b87c7] via-[#1b87c7] to-[#3cac59] shadow-2xl shadow-[#1b87c7]/20',
    blue: 'bg-[#1b87c7] shadow-2xl shadow-[#1b87c7]/25',
    green: 'bg-[#3cac59] shadow-2xl shadow-[#3cac59]/25',
  }[backgroundVariant];

  return (
    <>
      <section
        className={`relative w-full overflow-hidden ${backgroundClasses} py-14 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 ${className}`}
        aria-label="Banner de contacto y llamado a la acción"
      >
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#3cac59]/30 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white/90" />
              <span>{badge}</span>
            </div>
          )}

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#f9f9f9] tracking-tight leading-tight max-w-4xl drop-shadow-sm mb-4">
            {title}
          </h2>

          {subtitle && (
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#f9f9f9]/90 font-normal max-w-2xl leading-relaxed mb-8 sm:mb-10">
              {subtitle}
            </p>
          )}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#1b87c7] font-bold font-sans text-base sm:text-lg shadow-xl shadow-black/15 hover:bg-[#f9f9f9] hover:text-[#4d4e4f] hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-white/40"
            aria-label={ctaText}
          >
            <span>{ctaText}</span>
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>
      </section>

      {/* Modal con Formulario Nativo (Make / Doppler) */}
      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#f9f9f9] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-200 text-[#4d4e4f]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3cac59] block">
                  {badge}
                </span>
                <h3 className="font-heading text-xl font-bold text-[#4d4e4f]">{ctaText}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Cerrar formulario"
                className="p-2 rounded-xl bg-[#f9f9f9] hover:bg-gray-200 text-[#4d4e4f] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <NativeLeadForm
                formType={formType}
                source={source}
                submitLabel="Enviar consulta a Promovêre"
                compact
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TallyBanner;
