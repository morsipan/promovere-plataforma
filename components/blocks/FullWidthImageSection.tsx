import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getMediaUrl, getMediaAlt } from '@/lib/media';

export interface FullWidthImageData {
  image?: any;
  mobileImage?: any;
  height?: 'auto' | 'small' | 'medium' | 'large' | 'screen';
  overlay?: 'none' | 'subtle' | 'medium' | 'strong' | 'gradient' | 'brand';
  fullBleed?: boolean;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
  newTab?: boolean;
  contentAlignment?: 'left' | 'center' | 'right';
  caption?: string;
}

export interface FullWidthImageSectionProps {
  data?: FullWidthImageData;
}

export default function FullWidthImageSection({ data }: FullWidthImageSectionProps) {
  const desktopImageUrl = getMediaUrl(data?.image, '');
  const mobileImageUrl = getMediaUrl(data?.mobileImage, '') || desktopImageUrl;
  const altText = getMediaAlt(data?.image, data?.title || 'Imagen institucional Promovêre');

  const height = data?.height || 'medium';
  const overlay = data?.overlay || 'none';
  const fullBleed = data?.fullBleed !== false; // por defecto true
  const alignment = data?.contentAlignment || 'center';

  // Alturas predefinidas
  const heightClasses = {
    auto: 'min-h-[320px] aspect-video sm:aspect-[21/9]',
    small: 'h-[280px] sm:h-[360px]',
    medium: 'h-[420px] sm:h-[540px]',
    large: 'h-[560px] sm:h-[720px]',
    screen: 'min-h-screen',
  }[height];

  // Capas de opacidad / degradado
  const overlayClasses = {
    none: '',
    subtle: 'bg-black/20 backdrop-blur-[1px]',
    medium: 'bg-black/40 backdrop-blur-[2px]',
    strong: 'bg-black/60 backdrop-blur-[2px]',
    gradient: 'bg-gradient-to-t from-black/85 via-black/35 to-black/10',
    brand: 'bg-gradient-to-r from-[#1b87c7]/80 via-[#1b87c7]/50 to-[#3cac59]/75 backdrop-blur-[1px]',
  }[overlay];

  // Alineación de texto y contenedor
  const alignContainerClasses = {
    left: 'text-left items-start justify-center',
    center: 'text-center items-center justify-center mx-auto',
    right: 'text-right items-end justify-center ml-auto',
  }[alignment];

  const hasContent = Boolean(data?.title || data?.subtitle || data?.buttonLabel);

  if (!desktopImageUrl) {
    return (
      <section className={fullBleed ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        <div
          className={`relative w-full ${heightClasses} ${
            !fullBleed ? 'rounded-2xl' : ''
          } bg-gradient-to-tr from-[#1b87c7]/15 to-[#3cac59]/15 border-2 border-dashed border-[#1b87c7]/30 flex flex-col items-center justify-center p-6 text-center`}
        >
          <div className="w-12 h-12 rounded-xl bg-[#1b87c7]/10 text-[#1b87c7] flex items-center justify-center font-bold text-xl mb-3">
            🖼️
          </div>
          <p className="font-bold text-[#4d4e4f] text-base mb-1">Módulo de Imagen Full-Width</p>
          <p className="text-xs text-[#4d4e4f]/70 max-w-sm">
            Adjuntá una imagen desde el panel de administración para mostrarla aquí en ancho completo.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      suppressHydrationWarning
      className={`relative w-full overflow-hidden ${
        fullBleed ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
      }`}
    >
      <div
        className={`relative w-full ${heightClasses} ${
          !fullBleed ? 'rounded-2xl sm:rounded-3xl shadow-xl' : ''
        } overflow-hidden`}
      >
        {/* Imagen Desktop */}
        <div className="hidden sm:block absolute inset-0 w-full h-full">
          <Image
            src={desktopImageUrl}
            alt={altText}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={height === 'large' || height === 'screen'}
          />
        </div>

        {/* Imagen Mobile (o desktop fallback) */}
        <div className="block sm:hidden absolute inset-0 w-full h-full">
          <Image
            src={mobileImageUrl}
            alt={altText}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Capa de contraste / degradado si está activa */}
        {overlay !== 'none' && <div className={`absolute inset-0 w-full h-full ${overlayClasses}`} />}

        {/* Contenido superpuesto opcional (Título, Subtítulo, Botón) */}
        {hasContent && (
          <div className="relative z-10 w-full h-full flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12">
            <div className={`flex flex-col max-w-2xl ${alignContainerClasses}`}>
              {data?.title && (
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-md">
                  {data.title}
                </h2>
              )}

              {data?.subtitle && (
                <p className="text-sm sm:text-lg text-white/90 font-medium leading-relaxed mb-6 drop-shadow-sm max-w-xl">
                  {data.subtitle}
                </p>
              )}

              {data?.buttonLabel && data?.buttonHref && (
                <div>
                  <Link
                    href={data.buttonHref}
                    target={data.newTab ? '_blank' : undefined}
                    rel={data.newTab ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3cac59] text-white font-bold text-sm sm:text-base hover:bg-[#34984e] shadow-lg shadow-[#3cac59]/30 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <span>{data.buttonLabel}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pie de foto / Crédito discreto en la esquina inferior */}
        {data?.caption && (
          <div className="absolute bottom-3 right-4 z-10 text-[11px] font-medium text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
            {data.caption}
          </div>
        )}
      </div>
    </section>
  );
}
