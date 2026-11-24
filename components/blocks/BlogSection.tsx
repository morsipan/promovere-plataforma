'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Building2,
  ArrowRight,
  ExternalLink,
  X,
} from 'lucide-react';
import { blogContent } from '@/data/content';
import { getMediaUrl } from '@/lib/media';
import { resolveAppearance, type AppearanceData } from '@/lib/appearance';

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
}

function extractPlainContent(content: unknown): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content !== null && 'root' in content) {
    try {
      const texts: string[] = [];
      const walk = (node: any) => {
        if (!node) return;
        if (typeof node.text === 'string') texts.push(node.text);
        if (Array.isArray(node.children)) node.children.forEach(walk);
      };
      walk((content as any).root);
      return texts.join(' ').trim();
    } catch {
      return '';
    }
  }
  return '';
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

export default function BlogSection({
  data,
  collectionPosts,
  hideViewAllCta = false,
}: BlogSectionProps = {}) {
  const [activePost, setActivePost] = useState<BlogPostCMS | null>(null);

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
  const posts: BlogPostCMS[] =
    collectionPosts && collectionPosts.length > 0
      ? collectionPosts
      : data?.posts && data.posts.length > 0
      ? data.posts
      : blogContent.posts;

  return (
    <section
      id="blog"
      className={`py-20 md:py-28 relative overflow-hidden font-sans ${sectionAppearance.bgClass}`}
    >
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo Blog Promovêre"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-14">
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

        {/* Grilla de artículos del Blog propio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post, idx) => {
            const imgUrl = getMediaUrl(
              post.coverImage,
              post.coverImageUrl || post.image || ''
            );

            return (
              <article
                key={post.id || `blog-post-${idx}`}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${sectionAppearance.cardClass}`}
              >
                <div>
                  {imgUrl ? (
                    <div className="relative h-52 w-full overflow-hidden bg-[#4d4e4f]/10">
                      <Image
                        src={imgUrl}
                        alt={post.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      {post.category ? (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-[#1b87c7] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          {post.category}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                      {post.brand ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-[#3cac59]">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{post.brand}</span>
                        </span>
                      ) : null}
                      {post.publishedDate ? (
                        <span
                          className={`inline-flex items-center gap-1 ${sectionAppearance.cardSubtextClass}`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <time dateTime={post.publishedDate}>
                            {formatDateEs(post.publishedDate)}
                          </time>
                        </span>
                      ) : null}
                    </div>

                    <h3
                      className={`font-heading text-xl font-bold leading-snug mb-3 group-hover:text-[#1b87c7] transition-colors ${sectionAppearance.cardTitleClass}`}
                    >
                      {post.title}
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
                  <button
                    type="button"
                    onClick={() => setActivePost(post)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1b87c7] hover:text-[#3cac59] transition-colors cursor-pointer"
                  >
                    <span>Leer novedad</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {post.externalUrl ? (
                    <a
                      href={post.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#4d4e4f]/70 hover:text-[#1b87c7] transition-colors"
                    >
                      <span>Fuente</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

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

      {/* Modal de lectura rápida */}
      {activePost ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActivePost(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 text-[#4d4e4f]"
            onClick={(e) => e.stopPropagation()}
          >
            {getMediaUrl(
              activePost.coverImage,
              activePost.coverImageUrl || activePost.image || ''
            ) ? (
              <div className="relative h-56 w-full bg-[#4d4e4f]">
                <Image
                  src={getMediaUrl(
                    activePost.coverImage,
                    activePost.coverImageUrl || activePost.image || ''
                  )}
                  alt={activePost.title}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  aria-label="Cerrar artículo"
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : null}

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                {activePost.category ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] font-bold uppercase tracking-wider">
                    {activePost.category}
                  </span>
                ) : null}
                {activePost.brand ? (
                  <span className="font-bold text-[#3cac59]">{activePost.brand}</span>
                ) : null}
                {activePost.publishedDate ? (
                  <span className="text-[#4d4e4f]/60">
                    {formatDateEs(activePost.publishedDate)}
                  </span>
                ) : null}
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#4d4e4f] mb-4 leading-tight">
                {activePost.title}
              </h3>

              <p className="text-sm sm:text-base text-[#4d4e4f]/85 leading-relaxed mb-6 whitespace-pre-line">
                {extractPlainContent(activePost.content) || activePost.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <Link
                  href="/comunidad"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#3cac59] hover:underline"
                >
                  <span>Más recursos para agencias en Comunidad</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2">
                  {activePost.externalUrl ? (
                    <a
                      href={activePost.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b87c7] text-white text-xs font-bold hover:bg-[#1571a8] transition-colors"
                    >
                      <span>Abrir artículo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setActivePost(null)}
                    className="px-4 py-2 rounded-xl bg-[#f9f9f9] text-[#4d4e4f] text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
