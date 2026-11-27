'use client';

import { useState } from 'react';
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

  if (enabled === false) return null;

  const activeBrands = (Array.isArray(brands) ? brands : [])
    .filter((b) => b && b.active !== false)
    .map((b, idx) => ({
      id: b.id || `dist-brand-${idx}`,
      name: (b.name || 'Operador').trim(),
      logoUrl: getMediaUrl(b.logo, ''),
      href: normalizeOptionalUrl(b.url),
    }))
    .filter((b) => b.logoUrl.length > 0 && !brokenIds[b.id]);

  if (activeBrands.length === 0) return null;

  const durationSeconds = speed === 'slow' ? 58 : speed === 'fast' ? 24 : 38;

  // Duplicar la pista para desplazamiento infinito 0% -> -50% sin saltos
  const renderTrack = (prefix: string) =>
    activeBrands.map((brand) => {
      const cardInner = (
        <div className="bg-white rounded-2xl border border-gray-200/80 px-5 sm:px-6 py-3.5 sm:py-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center min-w-[155px] sm:min-w-[185px] h-[76px] sm:h-[86px]">
          <img
            src={brand.logoUrl}
            alt={brand.name}
            title={brand.name}
            loading="lazy"
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
            key={`${prefix}-${brand.id}`}
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
        <div key={`${prefix}-${brand.id}`} className="shrink-0">
          {cardInner}
        </div>
      );
    });

  return (
    <div className="mt-14 pt-10 border-t border-white/15">
      {title ? (
        <p
          className={`text-center text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 font-heading ${
            isDarkSection ? 'text-[#f9f9f9]/80' : 'text-[#4d4e4f]/75'
          }`}
        >
          {title}
        </p>
      ) : null}

      <div className="relative overflow-hidden py-2">
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
          className={`flex w-max items-center gap-4 sm:gap-5 distribution-marquee-track ${
            pauseOnHover !== false ? 'distribution-marquee-pauseable' : ''
          }`}
          style={{
            animationDuration: `${durationSeconds}s`,
          }}
        >
          <div className="flex items-center gap-4 sm:gap-5 pr-4 sm:pr-5">{renderTrack('a')}</div>
          <div className="flex items-center gap-4 sm:gap-5 pr-4 sm:pr-5" aria-hidden="true">
            {renderTrack('b')}
          </div>
        </div>
      </div>
    </div>
  );
}
