'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Building2,
  ArrowRight,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Tag,
} from 'lucide-react';
import { blogContent } from '@/data/content';
import { getMediaUrl } from '@/lib/media';
import { resolveAppearance, type AppearanceData } from '@/lib/appearance';
import { getBlogPostSlug, formatBlogDateUtc } from '@/lib/blog';
import { resolveBlogSettings, type BlogSettingsData, type ResolvedBlogBanner } from '@/lib/blogSettings';

export interface BlogPostCMS {
  id?: string | number | null;
  slug?: string | null;
  title: string;
  category?: string | null;
  brand?: string | null;
  publishedDate?: string | null;
  excerpt: string;
  content?: unknown;
  coverImage?: unknown;
  coverImageUrl?: string | null;
  image?: string | null;
  externalUrl?: string | null;
}

export interface BlogSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string | null;
    title?: string | null;
    subtitle?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    posts?: BlogPostCMS[] | null;
  };
  collectionPosts?: BlogPostCMS[] | null;
  blogSettings?: BlogSettingsData | null;
  hideViewAllCta?: boolean;
  showFilters?: boolean;
  maxItems?: number;
  pageSize?: number;
}

function getNormalizedCategory(cat?: string | null): string {
  const cleaned = (cat || '').trim();
  return cleaned.length > 0 ? cleaned : 'Promo News';
}

function BlogInlineBanner({ banner }: { banner: ResolvedBlogBanner }) {
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

export default function BlogSection({
  data,
  collectionPosts,
  blogSettings,
  hideViewAllCta = false,
  showFilters = false,
  maxItems,
  pageSize = 9,
}: BlogSectionProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const blogStyle = resolveBlogSettings(blogSettings);

  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blancoHumo',
    theme: 'light',
    accentColor: 'azul',
    buttonColor: 'azul',
    badgeColor: 'verde',
  });

  const badge = data?.badge || blogContent.badge;
  const title = data?.title || blogContent.title;
  const subtitle = data?.subtitle || blogContent.subtitle;
  const ctaLabel = data?.ctaLabel || blogContent.ctaLabel;
  const ctaHref = data?.ctaHref || blogContent.ctaHref;

  // Prioridad: 1) Colección 'blog-posts' de /admin -> 2) Posts del bloque -> 3) Respaldo estático
  const allPosts: BlogPostCMS[] =
    collectionPosts && collectionPosts.length > 0
      ? collectionPosts
      : data?.posts && data.posts.length > 0
      ? data.posts
      : blogContent.posts;

  // Agrupación / opciones por Marca (conservada intacta)
  const brands = useMemo(() => {
    const set = new Set<string>();
    for (const post of allPosts) {
      if (post.brand && post.brand.trim().length > 0) {
        set.add(post.brand.trim());
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [allPosts]);

  // Opciones coherentes por Categoría
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const post of allPosts) {
      set.add(getNormalizedCategory(post.category));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [allPosts]);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrand, selectedCategory]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = allPosts.filter((post) => {
      if (selectedBrand !== 'all' && (post.brand || '').trim() !== selectedBrand) {
        return false;
      }
      if (
        selectedCategory !== 'all' &&
        getNormalizedCategory(post.category) !== selectedCategory
      ) {
        return false;
      }
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        (post.brand || '').toLowerCase().includes(q) ||
        getNormalizedCategory(post.category).toLowerCase().includes(q)
      );
    });
    return typeof maxItems === 'number' && maxItems > 0 ? list.slice(0, maxItems) : list;
  }, [allPosts, searchQuery, selectedBrand, selectedCategory, maxItems]);

  // Paginación segura para el listado completo (showFilters)
  const safePageSize = Math.max(1, pageSize);
  const totalItems = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const visiblePosts = useMemo(() => {
    if (!showFilters) return filteredPosts;
    const startIndex = (safeCurrentPage - 1) * safePageSize;
    return filteredPosts.slice(startIndex, startIndex + safePageSize);
  }, [filteredPosts, showFilters, safeCurrentPage, safePageSize]);

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

  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedBrand !== 'all' || selectedCategory !== 'all';

  const activeBanners = showFilters ? blogStyle.banners : [];

  // Agrupar los posteos visibles en bloques de 4 cuando hay banners activos en el Blog List
  const postChunks = useMemo(() => {
    if (!showFilters || activeBanners.length === 0) {
      return [visiblePosts];
    }
    const chunks: BlogPostCMS[][] = [];
    for (let i = 0; i < visiblePosts.length; i += 4) {
      chunks.push(visiblePosts.slice(i, i + 4));
    }
    return chunks;
  }, [visiblePosts, showFilters, activeBanners.length]);

  return (
    <section
      id="blog"
      className={`py-20 md:py-28 relative overflow-hidden font-sans ${sectionAppearance.bgClass}`}
    >
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo Promo News Promovêre"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {badge ? (
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${sectionAppearance.badgeClass}`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${sectionAppearance.badgeIconClass}`} />
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

        {/* Barra de búsqueda, filtro por Marca (conservado) y filtro por Categoría */}
        {showFilters ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs mb-10 space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en Promo News por título, marca, categoría o destino..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] outline-none text-[#4d4e4f]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Filtro por Marca (conservado) */}
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  aria-label="Filtrar artículos por marca"
                  className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] outline-none text-[#4d4e4f] font-medium cursor-pointer"
                >
                  <option value="all">Todas las marcas ({allPosts.length})</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>

                {/* Filtro por Categoría */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filtrar artículos por categoría"
                  className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#3cac59] outline-none text-[#4d4e4f] font-medium cursor-pointer"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBrand('all');
                      setSelectedCategory('all');
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#4d4e4f] hover:bg-gray-100 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpiar</span>
                  </button>
                ) : null}
              </div>
            </div>

            {/* Indicador de resultados y paginación */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-[#4d4e4f]/70">
              <span>
                {totalItems === 0
                  ? '0 artículos encontrados'
                  : `Mostrando ${startItemNumber}–${endItemNumber} de ${totalItems} ${
                      totalItems === 1 ? 'artículo' : 'artículos'
                    }`}
              </span>
              {totalPages > 1 ? (
                <span className={`font-semibold ${blogStyle.accentTextClass}`}>
                  Página {safeCurrentPage} de {totalPages}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Grilla de artículos — Cada ítem abre su propio /blog/[slug] en PESTAÑA NUEVA */}
        {visiblePosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
            <p className="font-heading text-xl font-bold text-[#4d4e4f] mb-2">
              No encontramos notas con ese criterio
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('all');
                setSelectedCategory('all');
              }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] text-white text-xs font-bold cursor-pointer"
            >
              Ver todas las notas
            </button>
          </div>
        ) : (
          <div>
            {postChunks.map((chunk, chunkIdx) => {
              const showBannerAfterChunk =
                showFilters &&
                activeBanners.length > 0 &&
                (chunk.length === 4 ||
                  (chunkIdx === postChunks.length - 1 &&
                    blogStyle.showBannerBeforePagination &&
                    totalPages > 1));
              const bannerRotationIdx =
                ((safeCurrentPage - 1) * Math.max(1, postChunks.length) + chunkIdx) %
                Math.max(1, activeBanners.length);
              const bannerForChunk = showBannerAfterChunk
                ? activeBanners[bannerRotationIdx]
                : null;

              return (
                <div key={`chunk-${safeCurrentPage}-${chunkIdx}`}>
                  <div
                    className={
                      showFilters && activeBanners.length > 0
                        ? 'grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'
                        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
                    }
                  >
                    {chunk.map((post, idx) => {
                      const postSlug = getBlogPostSlug(post);
                      const postHref = `/blog/${postSlug}`;
                      const postCategory = getNormalizedCategory(post.category);
                      const imgUrl = getMediaUrl(
                        post.coverImage,
                        post.coverImageUrl || post.image || ''
                      );
                      const formattedDate = formatBlogDateUtc(post.publishedDate);

                      return (
                        <article
                          key={`${post.id ?? postSlug}-${chunkIdx}-${idx}`}
                          className={`group rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${sectionAppearance.cardClass} ${blogStyle.listCardBorderClass}`}
                        >
                          <div>
                            <Link
                              href={postHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block relative h-52 w-full overflow-hidden bg-[#4d4e4f]/10"
                            >
                              {imgUrl ? (
                                <Image
                                  src={imgUrl}
                                  alt={post.title}
                                  fill
                                  unoptimized
                                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#4d4e4f] via-[#1b87c7] to-[#3cac59] flex items-center justify-center p-6">
                                  <BookOpen className="w-10 h-10 text-white/40" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                              {blogStyle.showCategory ? (
                                <span
                                  className={`absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider shadow-sm ${blogStyle.categoryListBadgeClass}`}
                                >
                                  <Tag className="w-3 h-3" />
                                  <span>{postCategory}</span>
                                </span>
                              ) : null}
                            </Link>

                            <div className="p-6 sm:p-7">
                              <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                                {blogStyle.showBrand && post.brand ? (
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-bold ${blogStyle.tagListBadgeClass}`}
                                  >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>{post.brand}</span>
                                  </span>
                                ) : null}
                                {blogStyle.showDate && formattedDate ? (
                                  <span
                                    className={`inline-flex items-center gap-1 ${sectionAppearance.cardSubtextClass}`}
                                  >
                                    <Calendar className="w-3.5 h-3.5" />
                                    <time dateTime={post.publishedDate || undefined}>
                                      {formattedDate}
                                    </time>
                                  </span>
                                ) : null}
                              </div>

                              <h3
                                className={`font-heading text-xl font-bold leading-snug mb-3 transition-colors ${sectionAppearance.cardTitleClass}`}
                              >
                                <Link
                                  href={postHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`transition-colors ${blogStyle.accentHoverTextClass}`}
                                >
                                  {post.title}
                                </Link>
                              </h3>

                              <p
                                className={`text-sm leading-relaxed line-clamp-3 ${sectionAppearance.cardSubtextClass}`}
                              >
                                {post.excerpt}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`px-6 sm:px-7 py-4 border-t flex items-center justify-between gap-3 ${sectionAppearance.borderClass}`}
                          >
                            <Link
                              href={postHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold hover:text-[#3cac59] transition-colors ${blogStyle.accentTextClass}`}
                            >
                              <span>Leer artículo completo</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {bannerForChunk ? (
                    <BlogInlineBanner
                      key={`banner-${safeCurrentPage}-${chunkIdx}-${bannerForChunk.id}`}
                      banner={bannerForChunk}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        {/* Controles de Paginación */}
        {showFilters && totalPages > 1 ? (
          <nav
            aria-label="Paginación de Promo News"
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
                      ? blogStyle.accentActivePageClass
                      : `border border-gray-200 bg-white text-[#4d4e4f] ${blogStyle.accentPageHoverClass}`
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

        {/* CTA hacia /blog */}
        {!hideViewAllCta && ctaLabel && ctaHref ? (
          <div className="mt-12 text-center">
            <Link
              href={ctaHref}
              className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 ${sectionAppearance.buttonClass}`}
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
