import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogRichText from '@/components/blocks/BlogRichText';
import { getMediaUrl } from '@/lib/media';
import { normalizeBlogSlug, getBlogPostSlug, formatBlogDateUtc } from '@/lib/blog';
import { resolveBlogSettings } from '@/lib/blogSettings';
import { blogContent } from '@/data/content';

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function resolveBlogPost(rawSlug: string) {
  const normalized = normalizeBlogSlug(rawSlug);
  let postDoc: any = null;
  let relatedPosts: any[] = [];

  try {
    const payload = await getPayload({ config });

    // 1. Buscar por slug exacto o normalizado
    const directRes = await payload
      .find({
        collection: 'blog-posts',
        where: {
          and: [
            { status: { equals: 'published' } },
            {
              or: [
                { slug: { equals: normalized } },
                { slug: { equals: rawSlug } },
              ],
            },
          ],
        },
        depth: 1,
        limit: 1,
      })
      .catch(() => ({ docs: [] }));

    if (directRes.docs.length > 0) {
      postDoc = directRes.docs[0];
    } else {
      // 2. Búsqueda de respaldo normalizando slugs existentes (para URLs históricas con tildes/typos)
      const allRes = await payload
        .find({
          collection: 'blog-posts',
          where: { status: { equals: 'published' } },
          depth: 1,
          limit: 200,
        })
        .catch(() => ({ docs: [] }));

      postDoc = (allRes.docs || []).find(
        (doc: any) => getBlogPostSlug(doc) === normalized
      );
    }

    if (postDoc) {
      const relRes = await payload
        .find({
          collection: 'blog-posts',
          where: {
            and: [
              { status: { equals: 'published' } },
              { id: { not_equals: postDoc.id } },
            ],
          },
          sort: '-createdAt',
          depth: 1,
          limit: 3,
        })
        .catch(() => ({ docs: [] }));
      relatedPosts = relRes.docs || [];
    }
  } catch {
    // Fallback al contenido estático si falla la consulta
  }

  if (!postDoc) {
    const fallbackMatch = blogContent.posts.find(
      (p) => getBlogPostSlug(p) === normalized
    );
    if (fallbackMatch) {
      postDoc = {
        ...fallbackMatch,
        coverImageUrl: fallbackMatch.image,
      };
      relatedPosts = blogContent.posts
        .filter((p) => getBlogPostSlug(p) !== normalized)
        .slice(0, 3)
        .map((p) => ({ ...p, coverImageUrl: p.image }));
    }
  }

  return { post: postDoc, relatedPosts };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await resolveBlogPost(slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado — Promo News | Promovêre',
    };
  }

  const imageUrl = getMediaUrl(post.coverImage, post.coverImageUrl || '');
  return {
    title: `${post.title} — Promo News | Promovêre`,
    description: post.excerpt || 'Novedades de Promovêre y nuestras marcas representadas.',
    openGraph: {
      title: `${post.title} — Promo News | Promovêre`,
      description: post.excerpt || undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;
  let blogSettingsRaw: any = null;

  const [{ post, relatedPosts }] = await Promise.all([
    resolveBlogPost(slug),
    (async () => {
      try {
        const payload = await getPayload({ config });
        const [headerRes, footerRes, settingsRes, blogSettingsRes] = await Promise.all([
          payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
          payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
          payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
          payload.findGlobal({ slug: 'blog-settings', depth: 1 }).catch(() => null),
        ]);
        headerData = headerRes;
        footerData = footerRes;
        siteSettings = settingsRes;
        blogSettingsRaw = blogSettingsRes;
      } catch {}
    })(),
  ]);

  if (!post) {
    notFound();
  }

  const coverImgUrl = getMediaUrl(post.coverImage, post.coverImageUrl || '');
  const formattedDate = formatBlogDateUtc(post.publishedDate);
  const blogStyle = resolveBlogSettings(blogSettingsRaw);

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#4d4e4f] font-sans">
      <Navbar data={headerData} />

      {/* Encabezado del Artículo */}
      <header className={`pt-28 pb-12 sm:pb-16 relative overflow-hidden ${blogStyle.headerBgClass}`}>
        {!blogStyle.isLightHeader ? (
          <>
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1b87c7]/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#3cac59]/20 blur-3xl pointer-events-none" />
          </>
        ) : null}

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {blogStyle.showCategory && post.category ? (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${blogStyle.categoryHeaderBadgeClass}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{post.category}</span>
              </span>
            ) : null}

            {blogStyle.showBrand && post.brand ? (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${blogStyle.tagHeaderBadgeClass}`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{post.brand}</span>
              </span>
            ) : null}

            {blogStyle.showDate && formattedDate ? (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${blogStyle.headerMetaTextClass}`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#3cac59]" />
                <time dateTime={post.publishedDate}>{formattedDate}</time>
              </span>
            ) : null}
          </div>

          <h1
            className={`font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4 ${blogStyle.headerTitleClass}`}
          >
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className={`text-base sm:text-lg leading-relaxed ${blogStyle.headerSubtitleClass}`}>
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </header>

      {/* Cuerpo del Artículo */}
      <article className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={blogStyle.articleCardClass}>
            {/* Imagen principal desde Media / API */}
            {coverImgUrl ? (
              <div className="relative w-full aspect-[16/9] max-h-[480px] bg-[#4d4e4f]/10 overflow-hidden">
                <Image
                  src={coverImgUrl}
                  alt={post.title}
                  fill
                  unoptimized
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            ) : null}

            <div className="p-6 sm:p-10 md:p-12">
              <BlogRichText content={post.content} fallbackText={post.excerpt} />

              {/* Pie del artículo: volver a Promo News + Comunidad */}
              <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap items-center gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4d4e4f] hover:bg-[#38393a] text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Promo News</span>
                </Link>

                <Link
                  href="/comunidad"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#3cac59]" />
                  <span>Ir a Comunidad Promovêre</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Más artículos de Promo News */}
          {relatedPosts.length > 0 ? (
            <section className="mt-14 pt-10 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#4d4e4f]">
                  Más en Promo News
                </h2>
                <Link
                  href="/blog"
                  className={`text-xs sm:text-sm font-bold hover:underline ${blogStyle.accentTextClass}`}
                >
                  Ver listado completo →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rel: any, idx: number) => {
                  const relSlug = getBlogPostSlug(rel);
                  const relHref = `/blog/${relSlug}`;
                  const relImg = getMediaUrl(rel.coverImage, rel.coverImageUrl || '');
                  return (
                    <Link
                      key={`${rel.id ?? relSlug}-${idx}`}
                      href={relHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group bg-white rounded-2xl border border-gray-200/80 hover:border-[#1b87c7]/50 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${blogStyle.listCardBorderClass}`}
                    >
                      <div>
                        <div className="relative h-36 w-full bg-[#4d4e4f]/10 overflow-hidden">
                          {relImg ? (
                            <Image
                              src={relImg}
                              alt={rel.title}
                              fill
                              unoptimized
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#4d4e4f] to-[#1b87c7] flex items-center justify-center">
                              <BookOpen className="w-7 h-7 text-white/40" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          {blogStyle.showBrand && rel.brand ? (
                            <span
                              className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${blogStyle.tagTextClass}`}
                            >
                              {rel.brand}
                            </span>
                          ) : null}
                          <h3 className="font-heading text-base font-bold text-[#4d4e4f] group-hover:text-[#1b87c7] transition-colors line-clamp-2">
                            {rel.title}
                          </h3>
                        </div>
                      </div>
                      <div
                        className={`px-4 pb-4 pt-2 flex items-center gap-1 text-xs font-bold ${blogStyle.accentTextClass}`}
                      >
                        <span>Leer artículo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </article>

      <Footer data={footerData} settings={siteSettings} />
    </main>
  );
}
