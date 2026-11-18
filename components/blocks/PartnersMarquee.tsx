'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl, getMediaAlt } from '@/lib/media';

export interface PartnerLogoItem {
  id?: string;
  logo: any;
  link?: string;
}

export interface PartnersMarqueeData {
  title?: string;
  subtitle?: string;
  animationBehavior?: {
    animationType?: 'infinite-scroll' | 'batch-fade';
    animationSpeed?: 'slow' | 'normal' | 'fast';
  };
  imageStyles?: {
    colorMode?: 'always-color' | 'grayscale-hover';
  };
  logos?: PartnerLogoItem[];
  // Propiedades directas de retrocompatibilidad
  animationType?: 'infinite-scroll' | 'batch-fade';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  colorMode?: 'always-color' | 'grayscale-hover';
}

export interface PartnersMarqueeProps {
  data?: PartnersMarqueeData;
  className?: string;
}

/**
 * Hook para detectar si el viewport es desktop (>= 768px)
 */
function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

export default function PartnersMarquee({ data, className = '' }: PartnersMarqueeProps) {
  // 1. Extracción de configuración y opciones
  const title = data?.title;
  const subtitle = data?.subtitle;

  const animationType =
    data?.animationBehavior?.animationType || data?.animationType || 'infinite-scroll';
  const animationSpeed =
    data?.animationBehavior?.animationSpeed || data?.animationSpeed || 'normal';
  const colorMode = data?.imageStyles?.colorMode || data?.colorMode || 'grayscale-hover';

  const rawLogos = Array.isArray(data?.logos) ? data.logos : [];

  // Filtrar solo logos con imagen válida
  const validLogos = useMemo(() => {
    return rawLogos.filter((item) => Boolean(getMediaUrl(item?.logo)));
  }, [rawLogos]);

  const isDesktop = useIsDesktop();
  const [activeBatchIndex, setActiveBatchIndex] = useState(0);

  // 2. Mapeo de velocidades
  // Duración para infinite-scroll (en segundos)
  const infiniteDurationMap = {
    slow: 40,
    normal: 25,
    fast: 15,
  };
  const scrollDuration = infiniteDurationMap[animationSpeed] || 25;

  // Intervalo para batch-fade (en milisegundos)
  const batchIntervalMap = {
    slow: 5500,
    normal: 4000,
    fast: 2500,
  };
  const batchInterval = batchIntervalMap[animationSpeed] || 4000;

  // 3. Lógica de agrupación en lotes (Batch Fade)
  // 6 elementos en desktop (md+), 3 en mobile
  const chunkSize = isDesktop ? 6 : 3;

  const batches = useMemo(() => {
    if (validLogos.length === 0) return [];
    const chunks: PartnerLogoItem[][] = [];
    for (let i = 0; i < validLogos.length; i += chunkSize) {
      chunks.push(validLogos.slice(i, i + chunkSize));
    }
    return chunks;
  }, [validLogos, chunkSize]);

  // Ciclo periódico del lote activo para batch-fade
  useEffect(() => {
    if (animationType !== 'batch-fade' || batches.length <= 1) return;

    const timer = setInterval(() => {
      setActiveBatchIndex((prev) => (prev + 1) % batches.length);
    }, batchInterval);

    return () => clearInterval(timer);
  }, [animationType, batches.length, batchInterval]);

  // Si cambia el tamaño de pantalla o los lotes disminuyen, resetear el índice si queda fuera de rango
  useEffect(() => {
    if (activeBatchIndex >= batches.length) {
      setActiveBatchIndex(0);
    }
  }, [batches.length, activeBatchIndex]);

  // Si no hay logos configurados
  if (validLogos.length === 0) {
    return null;
  }

  // 4. Renderizador individual de cada Logo con modo de color y enlace condicional
  const renderLogoItem = (item: PartnerLogoItem, keySuffix: string | number) => {
    const logoUrl = getMediaUrl(item.logo);
    const logoAlt = getMediaAlt(item.logo, 'Logo de Partner Promovêre');
    if (!logoUrl) return null;

    const imageClasses = `h-9 sm:h-11 md:h-12 w-auto max-w-[130px] sm:max-w-[160px] object-contain select-none pointer-events-auto ${
      colorMode === 'grayscale-hover'
        ? 'grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300'
        : 'opacity-90 hover:opacity-100 transition-opacity duration-300'
    }`;

    const img = (
      <img
        src={logoUrl}
        alt={logoAlt}
        className={imageClasses}
        loading="lazy"
      />
    );

    if (item.link && item.link.trim().length > 0) {
      return (
        <a
          key={`logo-item-${keySuffix}`}
          href={item.link.trim()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center p-3 sm:p-4 focus:outline-hidden hover:scale-105 transition-transform duration-200"
          title={logoAlt}
          aria-label={logoAlt}
        >
          {img}
        </a>
      );
    }

    return (
      <div
        key={`logo-item-${keySuffix}`}
        className="inline-flex items-center justify-center p-3 sm:p-4"
      >
        {img}
      </div>
    );
  };

  return (
    <section
      suppressHydrationWarning
      className={`relative w-full py-12 sm:py-16 bg-[#f9f9f9] border-y border-gray-100/80 overflow-hidden ${className}`}
      aria-label="Marquesina de Logos y Aliados Estratégicos"
    >
      {/* Título y subtítulo opcionales de la marquesina */}
      {(title || subtitle) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-10">
          {title && (
            <h2 className="font-baloo text-xl sm:text-2xl md:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#4d4e4f]/70 max-w-xl mx-auto mt-2">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* =====================================================================
          OPCIÓN 1: Desplazamiento Infinito Continuo (Infinite Scroll)
         ===================================================================== */}
      {animationType === 'infinite-scroll' && (
        <div className="relative w-full overflow-hidden">
          {/* Máscaras de degradado lateral para fundido elegante sin cortes bruscos */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#f9f9f9] to-transparent z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#f9f9f9] to-transparent z-10"
            aria-hidden="true"
          />

          {/* Carrusel infinito animado con Framer Motion (duplicado para bucle perfecto) */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex shrink-0 items-center gap-6 sm:gap-10 md:gap-14 whitespace-nowrap will-change-transform"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                ease: 'linear',
                duration: scrollDuration,
                repeat: Infinity,
              }}
            >
              {/* Primer set de logos */}
              {validLogos.map((item, idx) => renderLogoItem(item, `a-${idx}`))}
              {/* Segundo set de logos duplicado para continuidad infinita */}
              {validLogos.map((item, idx) => renderLogoItem(item, `b-${idx}`))}
            </motion.div>
          </div>
        </div>
      )}

      {/* =====================================================================
          OPCIÓN 2: Transición por Lotes (Batch Fade)
         ===================================================================== */}
      {animationType === 'batch-fade' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[90px] sm:min-h-[110px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`batch-${activeBatchIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="grid grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 lg:gap-12 items-center justify-items-center w-full"
            >
              {batches[activeBatchIndex]?.map((item, idx) =>
                renderLogoItem(item, `batch-${activeBatchIndex}-${idx}`)
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
