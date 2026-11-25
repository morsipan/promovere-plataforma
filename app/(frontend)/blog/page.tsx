import type { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ArrowLeft, BookOpen, Newspaper, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageLivePreview from '@/components/PageLivePreview';
import BlogSection from '@/components/blocks/BlogSection';
import { blogContent } from '@/data/content';
import { resolveBlogSettings } from '@/lib/blogSettings';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog Propio — Novedades de Promovêre y Nuestras Marcas',
  description:
    'Novedades oficiales de Promovêre, lanzamientos, destinos y cadenas hoteleras representadas en América Latina.',
};

export default async function BlogPage() {
  let pageDoc: any = null;
  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;
  let blogSettings: any = null;
  let blogPosts: any[] = [];

  try {
    const payload = await getPayload({ config });
    const [{ docs }, headerRes, footerRes, settingsRes, blogSettingsRes, blogRes] = await Promise.all([
      payload
        .find({
          collection: 'pages',
          where: { slug: { equals: 'blog' } },
          depth: 2,
          limit: 1,
        })
        .catch(() => ({ docs: [] })),
      payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'blog-settings', depth: 1 }).catch(() => null),
      payload
        .find({
          collection: 'blog-posts',
          where: { status: { equals: 'published' } },
          sort: '-publishedDate,-createdAt',
          depth: 1,
          limit: 200,
        })
        .catch(() => ({ docs: [] })),
    ]);

    if (docs && docs.length > 0) {
      pageDoc = docs[0];
    }
    headerData = headerRes;
    footerData = footerRes;
    siteSettings = settingsRes;
    blogSettings = blogSettingsRes;
    blogPosts = blogRes?.docs || [];
  } catch {
    // Fallback a contenido estático centralizado si aún no existe documento en CMS
  }

  if (pageDoc && Array.isArray(pageDoc.layout) && pageDoc.layout.length > 0) {
    return (
      <PageLivePreview
        initialData={pageDoc}
        headerData={headerData}
        footerData={footerData}
        siteSettings={siteSettings}
        blogSettings={blogSettings}
        blogPosts={blogPosts}
        slug="blog"
      />
    );
  }

  const blogStyle = resolveBlogSettings(blogSettings);

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#4d4e4f] font-sans">
      <Navbar data={headerData} />

      {/* Encabezado de página dedicada de Blog */}
      <section className={`pt-28 pb-14 relative overflow-hidden ${blogStyle.headerBgClass}`}>
        {!blogStyle.isLightHeader ? (
          <>
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1b87c7]/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#3cac59]/20 blur-3xl pointer-events-none" />
          </>
        ) : null}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-xs font-bold mb-6 transition-colors ${
              blogStyle.isLightHeader
                ? 'text-[#4d4e4f]/75 hover:text-[#4d4e4f]'
                : 'text-[#f9f9f9]/80 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>

          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 block w-fit ${blogStyle.tagHeaderBadgeClass}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{blogContent.badge}</span>
          </div>

          <h1
            className={`font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 max-w-3xl ${blogStyle.headerTitleClass}`}
          >
            {blogStyle.blogTitle || blogContent.title}
          </h1>
          <p
            className={`text-base sm:text-lg max-w-2xl leading-relaxed mb-8 ${blogStyle.headerSubtitleClass}`}
          >
            {blogStyle.blogSubtitle || blogContent.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/prensa"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-colors ${
                blogStyle.isLightHeader
                  ? 'bg-white hover:bg-gray-100 border-gray-200 text-[#4d4e4f]'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              <Newspaper className="w-4 h-4 text-[#3cac59]" />
              <span>Ver Prensa, Entrevistas y Videos</span>
            </Link>
            <Link
              href="/comunidad"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${blogStyle.accentButtonClass}`}
            >
              <Sparkles className="w-4 h-4 text-[#3cac59]" />
              <span>Ir a Comunidad Promovêre</span>
            </Link>
          </div>
        </div>
      </section>

      <BlogSection
        collectionPosts={blogPosts}
        blogSettings={blogSettings}
        hideViewAllCta
        showFilters
      />

      <Footer data={footerData} settings={siteSettings} />
    </main>
  );
}
