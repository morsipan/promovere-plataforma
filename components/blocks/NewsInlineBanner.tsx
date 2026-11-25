'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ResolvedBlogBanner } from '@/lib/blogSettings';

export default function NewsInlineBanner({ banner }: { banner: ResolvedBlogBanner }) {
  const [failed, setFailed] = useState(false);

  if (failed || !banner.imageUrl) return null;

  const content = (
    <div className="relative w-full overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-[16/4] sm:aspect-[21/4] min-h-[110px] max-h-[260px] bg-[#f9f9f9]">
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          fill
          unoptimized
          onError={() => setFailed(true)}
          className="object-cover object-center"
          sizes="(max-width: 1280px) 100vw, 1216px"
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
