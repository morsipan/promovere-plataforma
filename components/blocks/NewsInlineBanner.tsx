'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ResolvedBlogBanner } from '@/lib/blogSettings';

export default function NewsInlineBanner({ banner }: { banner: ResolvedBlogBanner }) {
  const [desktopFailed, setDesktopFailed] = useState(false);
  const [mobileFailed, setMobileFailed] = useState(false);

  const mobileSrc =
    !mobileFailed && banner.mobileImageUrl ? banner.mobileImageUrl : banner.imageUrl;

  if (!banner.imageUrl || (desktopFailed && (mobileFailed || !banner.hasDedicatedMobileImage))) {
    return null;
  }

  const content = (
    <div className="relative w-full overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Versión Escritorio (>= 768px) */}
      <div className="hidden md:block relative w-full aspect-[21/4] min-h-[140px] max-h-[260px] bg-[#f9f9f9]">
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          fill
          unoptimized
          onError={() => setDesktopFailed(true)}
          className="object-cover object-center"
          sizes="(max-width: 1280px) 100vw, 1216px"
        />
      </div>

      {/* Versión Mobile (< 768px): usa mobileImage si está cargada, o la principal como fallback */}
      <div
        className={`block md:hidden relative w-full bg-[#f9f9f9] ${
          banner.hasDedicatedMobileImage && !mobileFailed
            ? 'aspect-[16/9] min-h-[160px] max-h-[340px]'
            : 'aspect-[16/5] min-h-[110px] max-h-[220px]'
        }`}
      >
        <Image
          src={mobileSrc}
          alt={banner.title}
          fill
          unoptimized
          onError={() => {
            if (banner.hasDedicatedMobileImage && !mobileFailed) {
              setMobileFailed(true);
            } else {
              setDesktopFailed(true);
            }
          }}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </div>
  );

  if (banner.href) {
    return (
      <div className="my-8">
        <a
          href={banner.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={banner.title}
          className="block group focus:outline-none focus:ring-2 focus:ring-[#1b87c7] rounded-3xl"
        >
          {content}
        </a>
      </div>
    );
  }

  return <figure className="my-8">{content}</figure>;
}
