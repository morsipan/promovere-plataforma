'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Newspaper,
  PlayCircle,
  ExternalLink,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { pressContent } from '@/data/content';
import { getMediaUrl } from '@/lib/media';
import { resolveAppearance, type AppearanceData } from '@/lib/appearance';

export interface PressItemCMS {
  id?: string | number | null;
  format: 'nota' | 'video';
  mediaOutlet: string;
  title: string;
  publishedDate?: string | null;
  summary: string;
  coverImage?: unknown;
  coverImageUrl?: string | null;
  image?: string | null;
  articleUrl?: string | null;
  videoUrl?: string | null;
  duration?: string | null;
  mediaFile?: unknown;
}

export interface PressSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string | null;
    title?: string | null;
    subtitle?: string | null;
    allPressLabel?: string | null;
    allPressHref?: string | null;
    showCommunityBanner?: boolean | null;
    communityCtaLabel?: string | null;
    communityCtaHref?: string | null;
    items?: PressItemCMS[] | null;
  };
  collectionItems?: PressItemCMS[] | null;
  hideViewAllCta?: boolean;
}

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatDateEs(dateStr?: string | null): string {
  if (!dateStr) return '';
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
  if (isoMatch) {
    const [, year, monthStr, day] = isoMatch;
    const monthIdx = Number(monthStr) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${MONTHS_ES[monthIdx]} ${year}`;
    }
  }
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  const month = MONTHS_ES[parsed.getUTCMonth()];
  const year = parsed.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

function getEmbedUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  try {
    const url = new URL(rawUrl);
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
      if (url.pathname.startsWith('/embed/')) return rawUrl;
    }
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.hostname.includes('vimeo.com')) {
      const id = url.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
  } catch {
    return null;
  }
  return null;
}

function resolveExternalHref(item: PressItemCMS): string | null {
  const rawArticle = (item.articleUrl || '').trim();
  if (rawArticle.length > 0) {
    if (/^https?:\/\//i.test(rawArticle) || rawArticle.startsWith('/')) {
      return rawArticle;
    }
    return `https://${rawArticle}`;
  }
  const mediaHref = getMediaUrl(item.mediaFile, '').trim();
  if (mediaHref.length > 0) {
    return mediaHref;
  }
  return null;
}

function getExternalDomainLabel(href: string | null): string | null {
  if (!href || !/^https?:\/\//i.test(href)) return null;
  try {
    return new URL(href).hostname.replace(/^www\./i, '');
  } catch {
    return null;
  }
}

export default function PressSection({
  data,
  collectionItems,
  hideViewAllCta = false,
}: PressSectionProps = {}) {
  const [filter, setFilter] = useState<'all' | 'nota' | 'video'>('all');
  const [activeVideo, setActiveVideo] = useState<PressItemCMS | null>(null);

  // Sincronizar filtro inicial con los anclajes del footer (#notas-de-prensa / #entrevistas-y-coberturas)
  useEffect(() => {
    const syncFilterFromHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.toLowerCase();
      if (hash === '#notas-de-prensa') {
        setFilter('nota');
      } else if (hash === '#entrevistas-y-coberturas') {
        setFilter('video');
      }
    };
    syncFilterFromHash();
    window.addEventListener('hashchange', syncFilterFromHash);
    return () => window.removeEventListener('hashchange', syncFilterFromHash);
  }, []);

  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blanco',
    theme: 'light',
    accentColor: 'verde',
    buttonColor: 'azul',
    badgeColor: 'azul',
  });

  const badge = data?.badge || pressContent.badge;
  const title = data?.title || pressContent.title;
  const subtitle = data?.subtitle || pressContent.subtitle;
  const allPressLabel = data?.allPressLabel || pressContent.allPressLabel;
  const allPressHref = data?.allPressHref || pressContent.allPressHref;
  const showCommunityBanner = data?.showCommunityBanner !== false;
  const communityCtaLabel = data?.communityCtaLabel || pressContent.communityCtaLabel;
  const communityCtaHref = data?.communityCtaHref || pressContent.communityCtaHref;

  // Prioridad: 1) Colección 'press-items' de /admin -> 2) Items del bloque -> 3) Respaldo estático
  const items: PressItemCMS[] =
    collectionItems && collectionItems.length > 0
      ? collectionItems
      : data?.items && data.items.length > 0
      ? data.items
      : pressContent.items;

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.format === filter);
  }, [items, filter]);

  const notesCount = items.filter((i) => i.format === 'nota').length;
  const videosCount = items.filter((i) => i.format === 'video').length;

  const embedUrl = activeVideo ? getEmbedUrl(activeVideo.videoUrl) : null;

  return (
    <section
      id="prensa"
      className={`py-20 md:py-28 relative overflow-hidden font-sans ${sectionAppearance.bgClass}`}
    >
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo Prensa Promovêre"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          {badge ? (
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${sectionAppearance.badgeClass}`}
            >
              <Newspaper className={`w-3.5 h-3.5 ${sectionAppearance.badgeIconClass}`} />
              <span>{badge}</span>
            </div>
          ) : null}
          {title ? (
            <h2
              className={`font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight ${sectionAppearance.titleClass}`}
            >
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className={`text-base sm:text-lg leading-relaxed font-normal ${sectionAppearance.subtitleClass}`}>
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Anclas semánticas para enlaces del Footer: notas-de-prensa y entrevistas-y-coberturas */}
        <div id="notas-de-prensa" className="scroll-mt-24" />
        <div id="entrevistas-y-coberturas" className="scroll-mt-24" />

        {/* Filtros de Sección Unificada: Todo | Notas en Medios | Entrevistas & Videos */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12" role="tablist" aria-label="Filtrar cobertura de prensa">
          {[
            { key: 'all' as const, label: `Todo (${items.length})` },
            { key: 'nota' as const, label: `Notas en Medios (${notesCount})` },
            { key: 'video' as const, label: `Entrevistas y Videos (${videosCount})` },
          ].map((tab) => {
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1b87c7] text-white shadow-md shadow-[#1b87c7]/25'
                    : 'bg-[#f9f9f9] text-[#4d4e4f] border border-gray-200 hover:border-[#1b87c7]/50 hover:text-[#1b87c7]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Grilla unificada de Notas en Medios y Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredItems.map((item, idx) => {
            const isVideo = item.format === 'video';
            const imgUrl = getMediaUrl(
              item.coverImage,
              item.coverImageUrl || item.image || ''
            );
            const externalHref = !isVideo ? resolveExternalHref(item) : null;
            const externalDomain = getExternalDomainLabel(externalHref);

            const thumbnailMedia = (
              <>
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 240px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#4d4e4f] via-[#1b87c7] to-[#3cac59] flex items-center justify-center p-4">
                    <Newspaper className="w-9 h-9 text-white/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                <span
                  className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                    isVideo
                      ? 'bg-[#3cac59] text-white'
                      : 'bg-white/95 text-[#1b87c7]'
                  }`}
                >
                  {isVideo ? (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Video</span>
                    </>
                  ) : (
                    <>
                      <Newspaper className="w-3.5 h-3.5" />
                      <span>Nota</span>
                    </>
                  )}
                </span>

                {isVideo && item.duration ? (
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 text-white text-[11px] font-semibold">
                    <Clock className="w-3 h-3" />
                    {item.duration}
                  </span>
                ) : null}
              </>
            );

            return (
              <article
                key={item.id || `press-item-${idx}`}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 flex flex-col sm:flex-row ${sectionAppearance.cardClass}`}
              >
                {/* Miniatura (en notas de prensa abre enlace externo en pestaña nueva) */}
                {!isVideo && externalHref ? (
                  <a
                    href={externalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Leer nota externa: ${item.title}`}
                    className="block relative sm:w-52 md:w-48 lg:w-56 h-52 sm:h-auto shrink-0 overflow-hidden bg-[#4d4e4f]"
                  >
                    {thumbnailMedia}
                  </a>
                ) : (
                  <div className="relative sm:w-52 md:w-48 lg:w-56 h-52 sm:h-auto shrink-0 overflow-hidden bg-[#4d4e4f]">
                    {thumbnailMedia}
                  </div>
                )}

                {/* Contenido */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                      <span className="font-bold text-[#1b87c7] uppercase tracking-wide">
                        {item.mediaOutlet}
                      </span>
                      {item.publishedDate ? (
                        <span
                          className={`inline-flex items-center gap-1 ${sectionAppearance.cardSubtextClass}`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <time dateTime={item.publishedDate}>
                            {formatDateEs(item.publishedDate)}
                          </time>
                        </span>
                      ) : null}
                    </div>

                    <h3
                      className={`font-heading text-lg sm:text-xl font-bold leading-snug mb-2.5 group-hover:text-[#1b87c7] transition-colors ${sectionAppearance.cardTitleClass}`}
                    >
                      {!isVideo && externalHref ? (
                        <a
                          href={externalHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#1b87c7] transition-colors"
                        >
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 ${sectionAppearance.cardSubtextClass}`}
                    >
                      {item.summary}
                    </p>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between gap-2 ${sectionAppearance.borderClass}`}>
                    {isVideo ? (
                      <button
                        type="button"
                        onClick={() => setActiveVideo(item)}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#3cac59] hover:text-[#1b87c7] transition-colors cursor-pointer"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Ver entrevista / video</span>
                      </button>
                    ) : externalHref ? (
                      <>
                        <a
                          href={externalHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1b87c7] hover:text-[#3cac59] transition-colors"
                        >
                          <span>
                            {item.articleUrl ? 'Leer nota en medio' : 'Ver cobertura / archivo'}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        {externalDomain ? (
                          <span className="text-[11px] font-medium text-[#4d4e4f]/55 truncate max-w-[140px]">
                            {externalDomain}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-xs font-medium text-[#4d4e4f]/50">
                        Enlace externo pendiente
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Enlace a página completa de Prensa (cuando está en la One Page) */}
        {!hideViewAllCta && allPressLabel && allPressHref ? (
          <div className="mt-10 text-center">
            <Link
              href={allPressHref}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1b87c7] hover:text-[#3cac59] transition-colors"
            >
              <span>{allPressLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : null}

        {/* Acceso claro desde la One Page hacia Comunidad Promovêre */}
        {showCommunityBanner ? (
          <div className="mt-14 rounded-3xl bg-gradient-to-r from-[#4d4e4f] via-[#1b87c7] to-[#3cac59] p-7 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#f9f9f9]" />
                <span>Comunidad Trade B2B</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
                {pressContent.communityBannerTitle}
              </h3>
              <p className="text-sm sm:text-base text-[#f9f9f9]/90 leading-relaxed">
                {pressContent.communityBannerSubtitle}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                href={communityCtaHref}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#4d4e4f] hover:bg-[#f9f9f9] font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5"
              >
                <span>{communityCtaLabel}</span>
                <ArrowRight className="w-4 h-4 text-[#1b87c7]" />
              </Link>
              <Link
                href="/comunidad/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-sm transition-all"
              >
                <span>Iniciar Sesión</span>
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {/* Modal de Reproducción de Video / Entrevista */}
      {activeVideo ? (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-100 text-[#4d4e4f]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="min-w-0 pr-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3cac59] block">
                  {activeVideo.mediaOutlet}
                </span>
                <h3 className="font-heading text-lg font-bold text-[#4d4e4f] truncate">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Cerrar video"
                className="p-2 rounded-xl bg-[#f9f9f9] hover:bg-gray-200 text-[#4d4e4f] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {embedUrl ? (
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={embedUrl}
                  title={activeVideo.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="p-8 text-center bg-[#f9f9f9]">
                <p className="text-sm text-[#4d4e4f]/80 mb-4">{activeVideo.summary}</p>
                {activeVideo.videoUrl ? (
                  <a
                    href={activeVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] text-white text-sm font-bold hover:bg-[#1571a8] transition-colors"
                  >
                    <span>Ver video externo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : null}
              </div>
            )}

            <div className="px-6 py-4 bg-[#f9f9f9] flex items-center justify-between gap-4">
              <p className="text-xs text-[#4d4e4f]/75 line-clamp-2">{activeVideo.summary}</p>
              {activeVideo.videoUrl ? (
                <a
                  href={activeVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b87c7] hover:underline shrink-0"
                >
                  <span>Abrir original</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
