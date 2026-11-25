'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Building2,
  ArrowRight,
  Search,
  X,
} from 'lucide-react';
import { blogContent } from '@/data/content';
import { getMediaUrl } from '@/lib/media';
import { resolveAppearance, type AppearanceData } from '@/lib/appearance';
import { getBlogPostSlug, formatBlogDateUtc } from '@/lib/blog';

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
  hideViewAllCta?: boolean;
  showFilters?: boolean;
  maxItems?: number;
}

export default function BlogSection({
  data,
  collectionPosts,
  hideViewAllCta = false,
  showFilters = false,
  maxItems,
}: BlogSectionProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

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

  const brands = useMemo(() => {
    const set = new Set<string>();
    for (const post of allPosts) {
      if (post.brand && post.brand.trim().length > 0) {
        set.add(post.brand.trim());
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = allPosts.filter((post) => {
      if (selectedBrand !== 'all' && (post.brand || '').trim() !== selectedBrand) {
        return false;
      }
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        (post.brand || '').toLowerCase().includes(q) ||
        (post.category || '').toLowerCase().includes(q)
      );
    });
    return typeof maxItems === 'number' && maxItems > 0 ? list.slice(0, maxItems) : list;
  }, [allPosts, searchQuery, selectedBrand, maxItems]);

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

        {/* Barra de búsqueda y filtro por marca en la vista completa de Promo News (/blog) */}
        {showFilters ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs mb-10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en Promo News por título, marca o destino..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] outline-none text-[#4d4e4f]"
              />
            </div>

            <div className="flex items-center gap-2">
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

              {searchQuery || selectedBrand !== 'all' ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBrand('all');
                  }}
                  className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#4d4e4f] hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Grilla de artículos — Cada ítem enlaza estrictamente a SU propio /blog/[slug] */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
            <p className="font-heading text-xl font-bold text-[#4d4e4f] mb-2">
              No encontramos notas con ese criterio
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('all');
              }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] text-white text-xs font-bold cursor-pointer"
            >
              Ver todas las notas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPosts.map((post, idx) => {
              const postSlug = getBlogPostSlug(post);
              const postHref = `/blog/${postSlug}`;
              const imgUrl = getMediaUrl(
                post.coverImage,
                post.coverImageUrl || post.image || ''
              );
              const formattedDate = formatBlogDateUtc(post.publishedDate);

              return (
                <article
                  key={`${post.id ?? postSlug}-${idx}`}
                  className={`group rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${sectionAppearance.cardClass}`}
                >
                  <div>
                    <Link
                      href={postHref}
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
                      {post.category ? (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-[#1b87c7] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          {post.category}
                        </span>
                      ) : null}
                    </Link>

                    <div className="p-6 sm:p-7">
                      <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                        {post.brand ? (
                          <span className="inline-flex items-center gap-1.5 font-bold text-[#3cac59]">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{post.brand}</span>
                          </span>
                        ) : null}
                        {formattedDate ? (
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
                        className={`font-heading text-xl font-bold leading-snug mb-3 group-hover:text-[#1b87c7] transition-colors ${sectionAppearance.cardTitleClass}`}
                      >
                        <Link href={postHref} className="hover:text-[#1b87c7] transition-colors">
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
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1b87c7] hover:text-[#3cac59] transition-colors"
                    >
                      <span>Leer artículo completo</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

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
