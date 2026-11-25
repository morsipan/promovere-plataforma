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
  Search,
  ChevronLeft,
  ChevronRight,
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
  showFilters?: boolean;
  maxItems?: number;
  pageSize?: number;
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
  showFilters = false,
  maxItems,
  pageSize = 12,
}: PressSectionProps = {}) {
  const [filter, setFilter] = useState<'all' | 'nota' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  // Listado ordenado de medios / fuentes para el filtro rápido en /prensa
  const outlets = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      const cleaned = (item.mediaOutlet || '').trim();
      if (cleaned.length > 0) set.add(cleaned);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [items]);

  // Reiniciar paginación al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, selectedOutlet]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = items.filter((item) => {
      if (filter !== 'all' && item.format !== filter) return false;
      if (selectedOutlet !== 'all' && (item.mediaOutlet || '').trim() !== selectedOutlet) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.summary || '').toLowerCase().includes(q) ||
        (item.mediaOutlet || '').toLowerCase().includes(q)
      );
    });
    return typeof maxItems === 'number' && maxItems > 0 ? list.slice(0, maxItems) : list;
  }, [items, filter, searchQuery, selectedOutlet, maxItems]);

  const safePageSize = Math.max(1, pageSize);
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const visibleItems = useMemo(() => {
    if (!showFilters) return filteredItems;
    const startIdx = (safeCurrentPage - 1) * safePageSize;
    return filteredItems.slice(startIdx, startIdx + safePageSize);
  }, [filteredItems, showFilters, safeCurrentPage, safePageSize]);

  const startItemNumber = totalItems === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1;
  const endItemNumber = Math.min(safeCurrentPage * safePageSize, totalItems);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, safeCurrentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let p = start; p <= end; p++) {
      pages.push(p);
    }
    return pages;
  }, [safeCurrentPage, totalPages]);

  const hasActiveSearchFilters =
    searchQuery.trim().length > 0 || selectedOutlet !== 'all' || filter !== 'all';

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

        {/* Filtros de Sección Unificada (solo en la vista completa /prensa, ocultos en la Home) */}
        {showFilters ? (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8" role="tablist" aria-label="Filtrar cobertura de prensa">
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
        ) : null}

        {/* Buscador y filtro rápido por Medio / Fuente (en la vista completa /prensa) */}
        {showFilters ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs mb-10 space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar notas de prensa por título, resumen o medio..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] outline-none text-[#4d4e4f]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  aria-label="Filtrar notas por medio o fuente"
                  className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] outline-none text-[#4d4e4f] font-medium cursor-pointer"
                >
                  <option value="all">Todos los medios ({outlets.length})</option>
                  {outlets.map((outlet) => (
                    <option key={outlet} value={outlet}>
                      {outlet}
                    </option>
                  ))}
                </select>

                {hasActiveSearchFilters ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedOutlet('all');
                      setFilter('all');
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#4d4e4f] hover:bg-gray-100 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpiar</span>
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-[#4d4e4f]/70">
              <span>
                {totalItems === 0
                  ? '0 coberturas encontradas'
                  : `Mostrando ${startItemNumber}–${endItemNumber} de ${totalItems} ${
                      totalItems === 1 ? 'cobertura' : 'coberturas'
                    }`}
              </span>
              {totalPages > 1 ? (
                <span className="font-semibold text-[#1b87c7]">
                  Página {safeCurrentPage} de {totalPages}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Grilla unificada de Notas en Medios y Videos */}
        {visibleItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
            <p className="font-heading text-xl font-bold text-[#4d4e4f] mb-2">
              No encontramos notas de prensa con ese criterio
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedOutlet('all');
                setFilter('all');
              }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] text-white text-xs font-bold cursor-pointer"
            >
              Ver todas las coberturas
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {visibleItems.map((item, idx) => {
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
        )}

        {/* Controles de Paginación (en la vista completa /prensa) */}
        {showFilters && totalPages > 1 ? (
          <nav
            aria-label="Paginación de Notas de Prensa"
            className="mt-12 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-bold text-[#4d4e4f] hover:border-[#1b87c7] hover:text-[#1b87c7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {pageNumbers[0] > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-bold text-[#4d4e4f] hover:border-[#1b87c7] hover:text-[#1b87c7] transition-colors cursor-pointer"
                >
                  1
                </button>
                {pageNumbers[0] > 2 ? (
                  <span className="px-1 text-gray-400 text-sm">…</span>
                ) : null}
              </>
            ) : null}

            {pageNumbers.map((pageNum) => {
              const isCurrent = pageNum === safeCurrentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1b87c7] text-white shadow-md shadow-[#1b87c7]/25'
                      : 'border border-gray-200 bg-white text-[#4d4e4f] hover:border-[#1b87c7] hover:text-[#1b87c7]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {pageNumbers[pageNumbers.length - 1] < totalPages ? (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 ? (
                  <span className="px-1 text-gray-400 text-sm">…</span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-bold text-[#4d4e4f] hover:border-[#1b87c7] hover:text-[#1b87c7] transition-colors cursor-pointer"
                >
                  {totalPages}
                </button>
              </>
            ) : null}

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-bold text-[#4d4e4f] hover:border-[#1b87c7] hover:text-[#1b87c7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        ) : null}

        {/* Enlace a página completa de Prensa (cuando está en la Home) */}
        {!hideViewAllCta && allPressLabel && allPressHref ? (
          <div className="mt-12 text-center">
            <Link
              href={allPressHref}
              className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 ${sectionAppearance.buttonClass}`}
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
