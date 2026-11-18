'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMediaUrl, getMediaAlt } from '@/lib/media';

export interface ImpactBannerButton {
  id?: string;
  label: string;
  url: string;
  style?: 'primary' | 'secondary';
}

export interface ImpactBannerData {
  appearance?: {
    backgroundStyle?: 'gradient' | 'solid' | 'image';
    backgroundColor?: 'blancoHumo' | 'grisOscuro' | 'verde' | 'azul' | string;
    backgroundImage?: any;
    theme?: 'dark' | 'light';
    height?: 'small' | 'medium' | 'large';
    layout?: 'centered' | 'split';
    enableAnimations?: boolean;
  };
  title?: string;
  subtitle?: string;
  buttons?: ImpactBannerButton[];
  // Compatibilidad hacia atrás si existiera cta único
  cta?: {
    label?: string;
    url?: string;
    iconOnly?: boolean;
  };
  secondaryGraphic?: any;
  // Propiedades aplanadas de compatibilidad
  backgroundStyle?: 'gradient' | 'solid' | 'image';
  backgroundColor?: string;
  backgroundImage?: any;
  theme?: 'dark' | 'light';
  height?: 'small' | 'medium' | 'large';
  layout?: 'centered' | 'split';
  enableAnimations?: boolean;
}

export interface ImpactBannerProps {
  data?: ImpactBannerData;
  className?: string;
}

export default function ImpactBanner({ data, className = '' }: ImpactBannerProps) {
  // 1. Extracción de configuración de apariencia y layout
  const appearance = data?.appearance || data || {};
  const backgroundStyle = appearance?.backgroundStyle || 'gradient';
  const backgroundColor = appearance?.backgroundColor || 'azul';
  const theme = appearance?.theme || 'dark';
  const height = appearance?.height || data?.height || 'medium';
  const layout = appearance?.layout || data?.layout || 'centered';
  const enableAnimations = appearance?.enableAnimations ?? data?.enableAnimations ?? true;

  const backgroundImageUrl = getMediaUrl(appearance?.backgroundImage);
  const backgroundImageAlt = getMediaAlt(
    appearance?.backgroundImage,
    data?.title || 'Fondo Banner de Impacto Promovêre'
  );

  // 2. Extracción de contenidos y botones
  const title = data?.title || 'Impulsa tu presencia turística en toda América Latina';
  const subtitle = data?.subtitle;

  // Normalización del array de botones (con soporte de retrocompatibilidad para data.cta)
  let buttonsList: ImpactBannerButton[] = [];
  if (Array.isArray(data?.buttons) && data.buttons.length > 0) {
    buttonsList = data.buttons;
  } else if (data?.cta?.url) {
    buttonsList = [
      {
        label: data.cta.label || 'Conocer Más',
        url: data.cta.url,
        style: 'primary',
      },
    ];
  } else {
    buttonsList = [
      {
        label: 'Conocer Más',
        url: '#contacto',
        style: 'primary',
      },
    ];
  }

  // 3. Extracción de elemento gráfico secundario
  const secondaryGraphicUrl = getMediaUrl(data?.secondaryGraphic);
  const secondaryGraphicAlt = getMediaAlt(
    data?.secondaryGraphic,
    title || 'Gráfico institucional Promovêre'
  );
  const hasSecondaryGraphic = Boolean(secondaryGraphicUrl && secondaryGraphicUrl.trim().length > 0);

  // 4. Mapeo de alturas (Padding vertical)
  const heightClasses = {
    small: 'py-10 sm:py-12',
    medium: 'py-16 sm:py-20 md:py-24',
    large: 'py-24 sm:py-28 md:py-32 lg:min-h-[500px] flex items-center',
  }[height] || 'py-16 sm:py-20 md:py-24';

  // 5. Mapeo de fondos corporativos
  const solidColorClasses: Record<string, string> = {
    blancoHumo: 'bg-[#f9f9f9]',
    '#f9f9f9': 'bg-[#f9f9f9]',
    grisOscuro: 'bg-[#4d4e4f]',
    '#4d4e4f': 'bg-[#4d4e4f]',
    verde: 'bg-[#3cac59]',
    '#3cac59': 'bg-[#3cac59]',
    azul: 'bg-[#1b87c7]',
    '#1b87c7': 'bg-[#1b87c7]',
  };

  let backgroundClass = '';
  if (backgroundStyle === 'gradient') {
    backgroundClass =
      'bg-gradient-to-r from-[#1b87c7] via-[#1b87c7] to-[#3cac59] shadow-2xl shadow-[#1b87c7]/20';
  } else if (backgroundStyle === 'solid') {
    backgroundClass = solidColorClasses[backgroundColor] || 'bg-[#1b87c7]';
  } else if (backgroundStyle === 'image') {
    backgroundClass = 'bg-[#1b87c7]';
  }

  // 6. Configuración de tema (Dark vs Light)
  const isDark = theme === 'dark';
  const titleClass = isDark ? 'text-[#f9f9f9]' : 'text-[#4d4e4f]';
  const subtitleClass = isDark ? 'text-[#f9f9f9]/90' : 'text-[#4d4e4f]/80';

  // 7. Renderizador de Botones (Array de hasta 2 botones con estilos primary/secondary)
  const renderButton = (btn: ImpactBannerButton, idx: number) => {
    const isExternal = btn.url.startsWith('http://') || btn.url.startsWith('https://');
    const isPrimary = btn.style !== 'secondary';

    let btnStyleClasses = '';
    if (isPrimary) {
      btnStyleClasses = isDark
        ? 'bg-white text-[#1b87c7] hover:bg-[#f9f9f9] hover:text-[#4d4e4f] shadow-xl shadow-black/15'
        : 'bg-[#1b87c7] text-white hover:bg-[#156d9f] shadow-lg shadow-[#1b87c7]/25';
    } else {
      btnStyleClasses = isDark
        ? 'border-2 border-white/90 text-white hover:bg-white/15 hover:border-white shadow-sm'
        : 'border-2 border-[#1b87c7] text-[#1b87c7] hover:bg-[#1b87c7]/10 shadow-sm';
    }

    return (
      <Link
        key={`btn-${idx}-${btn.label}`}
        href={btn.url}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={`group font-sans inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${btnStyleClasses}`}
      >
        <span>{btn.label}</span>
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    );
  };

  return (
    <section
      suppressHydrationWarning
      className={`relative w-full overflow-hidden ${backgroundClass} ${heightClasses} ${className}`}
      aria-label={title}
    >
      {/* Fondo de Imagen Fotográfica con Overlay oscuro */}
      {backgroundStyle === 'image' && backgroundImageUrl && (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <Image
            src={backgroundImageUrl}
            alt={backgroundImageAlt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />
        </div>
      )}

      {/* Efectos decorativos de iluminación ambiental para fondo gradiente */}
      {backgroundStyle === 'gradient' && (
        <>
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#3cac59]/30 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
        </>
      )}

      {/* Contenedor principal centrado max-w-7xl */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {layout === 'centered' ? (
          // ===================================================================
          // LAYOUT 1: Centrado (Todo el contenido al centro)
          // ===================================================================
          <div className="text-center flex flex-col items-center justify-center max-w-4xl mx-auto">
            {enableAnimations ? (
              <>
                {/* Título animado: caída desde arriba */}
                <motion.h2
                  initial={{ opacity: 0, y: -50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`font-baloo text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm mb-4 ${titleClass}`}
                >
                  {title}
                </motion.h2>

                {/* Contenido y CTAs animados: fade-in con delay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex flex-col items-center justify-center w-full"
                >
                  {subtitle && (
                    <p className={`font-sans text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-8 max-w-2xl ${subtitleClass}`}>
                      {subtitle}
                    </p>
                  )}

                  {/* Doble CTA */}
                  {buttonsList.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      {buttonsList.map((btn, idx) => renderButton(btn, idx))}
                    </div>
                  )}

                  {/* Gráfico secundario centrado si existiera */}
                  {hasSecondaryGraphic && (
                    <div className="mt-8 relative max-w-sm w-full flex justify-center">
                      <img
                        src={secondaryGraphicUrl!}
                        alt={secondaryGraphicAlt}
                        className="max-h-[220px] w-auto object-contain drop-shadow-2xl select-none"
                      />
                    </div>
                  )}
                </motion.div>
              </>
            ) : (
              // Versión estática sin animaciones
              <>
                <h2 className={`font-baloo text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm mb-4 ${titleClass}`}>
                  {title}
                </h2>

                {subtitle && (
                  <p className={`font-sans text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-8 max-w-2xl ${subtitleClass}`}>
                    {subtitle}
                  </p>
                )}

                {buttonsList.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {buttonsList.map((btn, idx) => renderButton(btn, idx))}
                  </div>
                )}

                {hasSecondaryGraphic && (
                  <div className="mt-8 relative max-w-sm w-full flex justify-center">
                    <img
                      src={secondaryGraphicUrl!}
                      alt={secondaryGraphicAlt}
                      className="max-h-[220px] w-auto object-contain drop-shadow-2xl select-none"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // ===================================================================
          // LAYOUT 2: Split (Textos a la izquierda, botones / elementos a la derecha)
          // ===================================================================
          <div className="flex flex-col md:flex-row items-center justify-between text-left gap-8 lg:gap-12">
            {enableAnimations ? (
              <>
                {/* Columna Izquierda: Título y Bajada */}
                <div className="flex-1 max-w-2xl flex flex-col items-start text-left">
                  <motion.h2
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`font-baloo text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm mb-4 ${titleClass}`}
                  >
                    {title}
                  </motion.h2>

                  {subtitle && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className={`font-sans text-sm sm:text-base md:text-lg font-normal leading-relaxed ${subtitleClass}`}
                    >
                      {subtitle}
                    </motion.p>
                  )}
                </div>

                {/* Columna Derecha: Botones o Gráfico Secundario */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-end gap-4 shrink-0"
                >
                  {hasSecondaryGraphic && (
                    <div className="relative group max-w-xs w-full flex justify-center mb-2 md:mb-0">
                      <img
                        src={secondaryGraphicUrl!}
                        alt={secondaryGraphicAlt}
                        className="max-h-[220px] sm:max-h-[260px] w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 select-none"
                      />
                    </div>
                  )}

                  {buttonsList.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-3.5">
                      {buttonsList.map((btn, idx) => renderButton(btn, idx))}
                    </div>
                  )}
                </motion.div>
              </>
            ) : (
              // Versión estática sin animaciones
              <>
                <div className="flex-1 max-w-2xl flex flex-col items-start text-left">
                  <h2 className={`font-baloo text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm mb-4 ${titleClass}`}>
                    {title}
                  </h2>

                  {subtitle && (
                    <p className={`font-sans text-sm sm:text-base md:text-lg font-normal leading-relaxed ${subtitleClass}`}>
                      {subtitle}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-end gap-4 shrink-0">
                  {hasSecondaryGraphic && (
                    <div className="relative group max-w-xs w-full flex justify-center mb-2 md:mb-0">
                      <img
                        src={secondaryGraphicUrl!}
                        alt={secondaryGraphicAlt}
                        className="max-h-[220px] sm:max-h-[260px] w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 select-none"
                      />
                    </div>
                  )}

                  {buttonsList.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-3.5">
                      {buttonsList.map((btn, idx) => renderButton(btn, idx))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
