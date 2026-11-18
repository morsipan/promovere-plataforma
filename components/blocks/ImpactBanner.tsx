import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getMediaUrl, getMediaAlt } from '@/lib/media';

export interface ImpactBannerData {
  appearance?: {
    backgroundStyle?: 'gradient' | 'solid' | 'image';
    backgroundColor?: 'blancoHumo' | 'grisOscuro' | 'verde' | 'azul' | string;
    backgroundImage?: any;
    theme?: 'dark' | 'light';
  };
  title?: string;
  subtitle?: string;
  cta?: {
    label?: string;
    url?: string;
    iconOnly?: boolean;
  };
  secondaryGraphic?: any;
  // Fallbacks de compatibilidad en caso de props aplanadas
  backgroundStyle?: 'gradient' | 'solid' | 'image';
  backgroundColor?: string;
  backgroundImage?: any;
  theme?: 'dark' | 'light';
}

export interface ImpactBannerProps {
  data?: ImpactBannerData;
  className?: string;
}

export default function ImpactBanner({ data, className = '' }: ImpactBannerProps) {
  // 1. Extracción de configuración de apariencia
  const appearance = data?.appearance || data || {};
  const backgroundStyle = appearance?.backgroundStyle || 'gradient';
  const backgroundColor = appearance?.backgroundColor || 'azul';
  const theme = appearance?.theme || 'dark';
  const backgroundImageUrl = getMediaUrl(appearance?.backgroundImage);
  const backgroundImageAlt = getMediaAlt(
    appearance?.backgroundImage,
    data?.title || 'Fondo Banner de Impacto Promovêre'
  );

  // 2. Extracción de contenidos
  const title = data?.title || 'Impulsa tu presencia turística en toda América Latina';
  const subtitle = data?.subtitle;
  const cta = data?.cta;
  const ctaUrl = cta?.url?.trim() || '';
  const ctaLabel = cta?.label?.trim() || 'Conocer Más';
  const ctaIconOnly = Boolean(cta?.iconOnly);

  // 3. Extracción de elemento gráfico secundario
  const secondaryGraphicUrl = getMediaUrl(data?.secondaryGraphic);
  const secondaryGraphicAlt = getMediaAlt(
    data?.secondaryGraphic,
    title || 'Gráfico institucional Promovêre'
  );
  const hasSecondaryGraphic = Boolean(secondaryGraphicUrl && secondaryGraphicUrl.trim().length > 0);

  // 4. Mapeo de estilos de fondo
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
    backgroundClass = 'bg-[#1b87c7]'; // Color base mientras carga la imagen
  }

  // 5. Configuración de tema (Dark vs Light para garantizar legibilidad de diseño)
  const isDark = theme === 'dark';
  const titleClass = isDark ? 'text-[#f9f9f9]' : 'text-[#4d4e4f]';
  const subtitleClass = isDark ? 'text-[#f9f9f9]/90' : 'text-[#4d4e4f]/80';

  // 6. Estilos del Botón CTA según tema
  let buttonClass = '';
  if (isDark) {
    buttonClass =
      'bg-white text-[#1b87c7] hover:bg-[#f9f9f9] hover:text-[#4d4e4f] shadow-xl shadow-black/15';
  } else {
    buttonClass =
      'bg-[#1b87c7] text-white hover:bg-[#156d9f] shadow-lg shadow-[#1b87c7]/25';
  }

  // Comprobar si el enlace es externo
  const isExternal = ctaUrl.startsWith('http://') || ctaUrl.startsWith('https://');

  return (
    <section
      suppressHydrationWarning
      className={`relative w-full overflow-hidden ${backgroundClass} ${className}`}
      aria-label={title}
    >
      {/* Caso: Fondo de Imagen Fotográfica con Overlay protector de contraste */}
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
          {/* Overlay oscuro protector para garantizar legibilidad */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />
        </div>
      )}

      {/* Efectos decorativos de iluminación ambiental (para gradientes y sólidos oscuros) */}
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

      {/* Contenedor centralizado max-w-7xl */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20 lg:py-24">
        {hasSecondaryGraphic ? (
          // ===================================================================
          // LAYOUT 1: Split en 2 columnas (Textos a la izquierda, Gráfico a la derecha)
          // ===================================================================
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Columna de Texto y CTA */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <h2 className={`font-baloo text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm mb-4 ${titleClass}`}>
                {title}
              </h2>

              {subtitle && (
                <p className={`font-sans text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-8 max-w-xl ${subtitleClass}`}>
                  {subtitle}
                </p>
              )}

              {/* Botón CTA */}
              {ctaUrl && (
                <div className="pt-2">
                  <Link
                    href={ctaUrl}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={ctaIconOnly ? ctaLabel : undefined}
                    className={`group inline-flex items-center justify-center font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                      ctaIconOnly
                        ? `p-3.5 sm:p-4 rounded-full ${buttonClass}`
                        : `gap-2 px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base ${buttonClass}`
                    }`}
                  >
                    {!ctaIconOnly && <span>{ctaLabel}</span>}
                    <ArrowRight
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                        ctaIconOnly
                          ? 'group-hover:translate-x-0.5'
                          : 'group-hover:translate-x-1'
                      }`}
                    />
                  </Link>
                </div>
              )}
            </div>

            {/* Columna de Gráfico Secundario (Tarjeta flotante, logotipo o ilustración) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
              <div className="relative group max-w-sm sm:max-w-md w-full flex justify-center">
                <img
                  src={secondaryGraphicUrl!}
                  alt={secondaryGraphicAlt}
                  className="max-h-[300px] sm:max-h-[360px] md:max-h-[400px] w-auto max-w-full object-contain drop-shadow-2xl transition-transform duration-500 ease-out group-hover:scale-105 select-none"
                />
              </div>
            </div>
          </div>
        ) : (
          // ===================================================================
          // LAYOUT 2: Contenido Centrado (Sin elemento gráfico secundario)
          // ===================================================================
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h2 className={`font-baloo text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm mb-4 ${titleClass}`}>
              {title}
            </h2>

            {subtitle && (
              <p className={`font-sans text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-8 max-w-2xl ${subtitleClass}`}>
                {subtitle}
              </p>
            )}

            {/* Botón CTA */}
            {ctaUrl && (
              <div className="pt-2">
                <Link
                  href={ctaUrl}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  aria-label={ctaIconOnly ? ctaLabel : undefined}
                  className={`group inline-flex items-center justify-center font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                    ctaIconOnly
                      ? `p-3.5 sm:p-4 rounded-full ${buttonClass}`
                      : `gap-2 px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base ${buttonClass}`
                  }`}
                >
                  {!ctaIconOnly && <span>{ctaLabel}</span>}
                  <ArrowRight
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                      ctaIconOnly
                        ? 'group-hover:translate-x-0.5'
                        : 'group-hover:translate-x-1'
                    }`}
                  />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
