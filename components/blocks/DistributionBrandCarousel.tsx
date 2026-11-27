'use client';

import { useState, useMemo } from 'react';
import { getMediaUrl } from '@/lib/media';

export interface DistributionBrandItem {
  id?: string | null;
  name: string;
  logo?: unknown;
  url?: string | null;
  active?: boolean | null;
}

export interface DistributionBrandCarouselProps {
  enabled?: boolean | null;
  title?: string | null;
  speed?: 'slow' | 'normal' | 'fast' | string | null;
  pauseOnHover?: boolean | null;
  brands?: DistributionBrandItem[] | null;
  isDarkSection?: boolean;
}

function normalizeOptionalUrl(raw?: string | null): string | null {
  const cleaned = (raw || '').trim();
  if (!cleaned) return null;
  if (/^https?:\/\//i.test(cleaned) || cleaned.startsWith('/')) return cleaned;
  return `https://${cleaned}`;
}

export default function DistributionBrandCarousel({
  enabled = true,
  title,
  speed = 'normal',
  pauseOnHover = true,
  brands,
  isDarkSection = true,
}: DistributionBrandCarouselProps) {
  const [brokenIds, setBrokenIds] = useState<Record<string, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);

  const activeBrands = useMemo(() => {
    if (enabled === false) return [];
    return (Array.isArray(brands) ? brands : [])
      .filter((b) => b && b.active !== false)
      .map((b, idx) => ({
        id: b.id || `dist-brand-${idx}`,
        name: (b.name || 'Operador').trim(),
        logoUrl: getMediaUrl(b.logo, ''),
        href: normalizeOptionalUrl(b.url),
      }))
      .filter((b) => b.logoUrl.length > 0 && !brokenIds[b.id]);
  }, [enabled, brands, brokenIds]);

  // Si hay pocas marcas cargadas en CMS (ej. 1-5), repetir dentro de cada mitad
  // para garantizar cobertura completa sin huecos en pantallas anchas.
  const halfTrackItems = useMemo(() => {
    if (activeBrands.length === 0) return [];
    const minItemsPerHalf = 8;
    const repeatCount = Math.max(1, Math.ceil(minItemsPerHalf / activeBrands.length));
    const list: Array<(typeof activeBrands)[number] & { copyKey: string }> = [];
    for (let r = 0; r < repeatCount; r++) {
      for (const b of activeBrands) {
        list.push({ ...b, copyKey: `${r}-${b.id}` });
      }
    }
    return list;
  }, [activeBrands]);

  if (enabled === false || halfTrackItems.length === 0) return null;

  // Duración proporcional al número de elementos para mantener velocidad visual constante
  const secondsPerItem = speed === 'slow' ? 2.8 : speed === 'fast' ? 1.15 : 1.85;
  const durationSeconds = Math.max(16, Math.round(halfTrackItems.length * secondsPerItem));
  const shouldPause = pauseOnHover !== false && isHovered;

  const renderHalf = (prefix: 'a' | 'b') =>
    halfTrackItems.map((brand) => {
      const cardInner = (
        <div className="bg-white rounded-2xl border border-gray-200/80 px-5 sm:px-6 py-3.5 sm:py-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center min-w-[155px] sm:min-w-[185px] h-[76px] sm:h-[86px]">
          <img
            src={brand.logoUrl}
            alt={brand.name}
            title={brand.name}
            loading="eager"
            draggable={false}
            onError={() =>
              setBrokenIds((prev) => (prev[brand.id] ? prev : { ...prev, [brand.id]: true }))
            }
            className="h-12 md:h-14 w-auto max-w-[160px] object-contain block select-none"
          />
        </div>
      );

      if (brand.href) {
        return (
          <a
            key={`${prefix}-${brand.copyKey}`}
            href={brand.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={brand.name}
            className="shrink-0 focus:outline-none focus:ring-2 focus:ring-[#1b87c7] rounded-2xl hover:-translate-y-0.5 transition-transform"
          >
            {cardInner}
          </a>
        );
      }

      return (
        <div key={`${prefix}-${brand.copyKey}`} className="shrink-0">
          {cardInner}
        </div>
      );
    });

  return (
    <div className="mt-14 pt-10 border-t border-white/15">
      <style>{`
        @keyframes promovereDistMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      {title ? (
        <p
          className={`text-center text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 font-heading ${
            isDarkSection ? 'text-[#f9f9f9]/80' : 'text-[#4d4e4f]/75'
          }`}
        >
          {title}
        </p>
      ) : null}

      <div
        className="relative overflow-hidden py-2"
        onMouseEnter={() => {
          if (pauseOnHover !== false) setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Degradados laterales sutiles */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 z-10 ${
            isDarkSection
              ? 'bg-gradient-to-r from-[#2c2d2e]/90 to-transparent'
              : 'bg-gradient-to-r from-[#f9f9f9] to-transparent'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 z-10 ${
            isDarkSection
              ? 'bg-gradient-to-l from-[#113d5b]/90 to-transparent'
              : 'bg-gradient-to-l from-[#f9f9f9] to-transparent'
          }`}
        />

        <div
          className="flex flex-nowrap w-max items-center"
          style={{
            animation: `promovereDistMarquee ${durationSeconds}s linear infinite`,
            animationPlayState: shouldPause ? 'paused' : 'running',
            willChange: 'transform',
          }}
        >
          <div className="flex flex-nowrap items-center gap-4 sm:gap-5 pr-4 sm:pr-5 shrink-0">
            {renderHalf('a')}
          </div>
          <div
            className="flex flex-nowrap items-center gap-4 sm:gap-5 pr-4 sm:pr-5 shrink-0"
            aria-hidden="true"
          >
            {renderHalf('b')}
          </div>
        </div>
      </div>
    </div>
  );
}
