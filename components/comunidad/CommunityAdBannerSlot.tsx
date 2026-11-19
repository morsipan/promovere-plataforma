'use client';

import React from 'react';
import FullWidthImageSection from '@/components/blocks/FullWidthImageSection';
import ImpactBanner from '@/components/blocks/ImpactBanner';

export interface CommunityAdBannerSlotProps {
  blocks?: any[] | null;
}

export default function CommunityAdBannerSlot({ blocks }: CommunityAdBannerSlotProps) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  const block = blocks[0];
  if (!block || !block.blockType) return null;

  return (
    <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200/80">
      {block.blockType === 'fullWidthImage' && (
        <FullWidthImageSection data={{ ...block, fullBleed: true }} />
      )}
      {block.blockType === 'impactBanner' && <ImpactBanner data={block} />}
    </div>
  );
}
