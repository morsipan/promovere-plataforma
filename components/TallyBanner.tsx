'use client';

import React, { useEffect, useCallback } from 'react';
import Script from 'next/script';
import { Sparkles } from 'lucide-react';

declare global {
  interface Window {
    Tally?: {
      openPopup: (
        formId: string,
        options?: {
          layout?: 'modal' | 'popup';
          width?: number;
          overlay?: boolean;
          emoji?: {
            text?: string;
            animation?: 'wave' | 'bounce' | 'pulse' | 'tada' | 'fade-in' | 'none';
          };
          autoClose?: number;
          hiddenFields?: Record<string, any>;
        }
      ) => void;
      closePopup: (formId: string) => void;
      loadEmbeds: () => void;
    };
  }
}

export interface TallyBannerProps {
  /** Título principal del banner */
  title?: string;
  /** Bajada o subtítulo explicativo */
  subtitle?: string;
  /** Texto del botón de acción */
  ctaText?: string;
  /** ID del formulario de Tally (ej: "wL5kdN") */
  tallyFormId?: string;
  /** Badge / Etiqueta superior opcional */
  badge?: string;
  /** Variante de fondo: degradado corporativo, azul sólido o verde */
  backgroundVariant?: 'gradient' | 'blue' | 'green';
  /** Emoji a mostrar en el modal de Tally */
  emojiText?: string;
  /** Animación del emoji de Tally */
  emojiAnimation?: 'wave' | 'bounce' | 'pulse' | 'tada' | 'fade-in' | 'none';
  /** Activar overlay oscuro de fondo al abrir modal */
  overlay?: boolean;
  /** Ancho en píxeles del modal */
  modalWidth?: number;
  /** Clases CSS adicionales para el contenedor de la sección */
  className?: string;
}

export const TallyBanner: React.FC<TallyBannerProps> = ({
  title = '¿Listo para acelerar tus ventas turísticas en la región?',
  subtitle = 'Conectamos tu marca hotelera o destino con más de 500 operadores mayoristas en LATAM. Coordiná una reunión con nuestro equipo completando un breve formulario.',
  ctaText = 'Contactar a Promovêre',
  tallyFormId = 'wL5kdN',
  badge = 'Atención Personalizada B2B',
  backgroundVariant = 'gradient',
  emojiText = '👋',
  emojiAnimation = 'wave',
  overlay = true,
  modalWidth = 700,
  className = '',
}) => {
  // Asegura que los embeds de Tally se vinculen al montar o cambiar el ID del formulario
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Tally?.loadEmbeds) {
      window.Tally.loadEmbeds();
    }
  }, [tallyFormId]);

  // Handler seguro para abrir el popup incluso si el script tardó en vincular los data-attributes
  const handleOpenPopup = useCallback(() => {
    if (typeof window !== 'undefined' && window.Tally?.openPopup && tallyFormId) {
      window.Tally.openPopup(tallyFormId, {
        layout: 'modal',
        width: modalWidth,
        overlay: Boolean(overlay),
        emoji: emojiText
          ? {
              text: emojiText,
              animation: emojiAnimation,
            }
          : undefined,
      });
    }
  }, [tallyFormId, modalWidth, overlay, emojiText, emojiAnimation]);

  // Selección de fondo según variante corporativa
  const backgroundClasses = {
    gradient:
      'bg-gradient-to-r from-[#1b87c7] via-[#1b87c7] to-[#3cac59] shadow-2xl shadow-[#1b87c7]/20',
    blue: 'bg-[#1b87c7] shadow-2xl shadow-[#1b87c7]/25',
    green: 'bg-[#3cac59] shadow-2xl shadow-[#3cac59]/25',
  }[backgroundVariant];

  return (
    <>
      {/* Script oficial de Tally.so cargado con lazyOnload para no bloquear el First Contentful Paint */}
      <Script
        id="tally-embed-script"
        src="https://tally.so/widgets/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.Tally?.loadEmbeds) {
            window.Tally.loadEmbeds();
          }
        }}
      />

      <section
        className={`relative w-full overflow-hidden ${backgroundClasses} py-14 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 ${className}`}
        aria-label="Banner de contacto y llamado a la acción"
      >
        {/* Elementos decorativos sutiles de fondo (iluminación ambiental de marca) */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#3cac59]/30 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-radial-[circle_at_center,_transparent_0%,_rgba(0,0,0,0.08)_100%] pointer-events-none"
          aria-hidden="true"
        />

        {/* Contenedor centrado max-w-7xl */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Badge superior opcional */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white/90" />
              <span>{badge}</span>
            </div>
          )}

          {/* Título: Tipografía Baloo Da 2 (font-baloo), alto contraste en blanco humo */}
          <h2 className="font-baloo text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#f9f9f9] tracking-tight leading-tight max-w-4xl drop-shadow-sm mb-4">
            {title}
          </h2>

          {/* Bajada: Tipografía Roboto (font-sans), legible, color blanco con alta opacidad */}
          {subtitle && (
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#f9f9f9]/90 font-normal max-w-2xl leading-relaxed mb-8 sm:mb-10">
              {subtitle}
            </p>
          )}

          {/* Botón Call To Action con atributos nativos de Tally.so Modal Popup */}
          <button
            type="button"
            onClick={handleOpenPopup}
            data-tally-open={tallyFormId}
            data-tally-layout="modal"
            data-tally-width={modalWidth}
            data-tally-overlay={overlay ? '1' : '0'}
            data-tally-emoji-text={emojiText}
            data-tally-emoji-animation={emojiAnimation}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#1b87c7] font-bold text-base sm:text-lg shadow-xl shadow-black/15 hover:bg-[#f9f9f9] hover:text-[#4d4e4f] hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-white/40"
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
    </>
  );
};

export default TallyBanner;
