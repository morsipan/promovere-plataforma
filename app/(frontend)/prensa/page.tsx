import type { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ArrowLeft, BookOpen, Newspaper, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageLivePreview from '@/components/PageLivePreview';
import PressSection from '@/components/blocks/PressSection';
import { pressContent } from '@/data/content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Prensa, Entrevistas y Videos — Promovêre',
  description:
    'Sección unificada de prensa de Promovêre: notas en medios especializados del trade turístico, entrevistas y coberturas en video.',
};

export default async function PrensaPage() {
  let pageDoc: any = null;
  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;
  let pressItems: any[] = [];

  try {
    const payload = await getPayload({ config });
    const [{ docs }, headerRes, footerRes, settingsRes, pressRes] = await Promise.all([
      payload
        .find({
          collection: 'pages',
          where: { slug: { equals: 'prensa' } },
          depth: 2,
          limit: 1,
        })
        .catch(() => ({ docs: [] })),
      payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
      payload
        .find({
          collection: 'press-items',
          where: { status: { equals: 'published' } },
          sort: '-publishedDate',
          depth: 1,
          limit: 50,
        })
        .catch(() => ({ docs: [] })),
    ]);

    if (docs && docs.length > 0) {
      pageDoc = docs[0];
    }
    headerData = headerRes;
    footerData = footerRes;
    siteSettings = settingsRes;
    pressItems = pressRes?.docs || [];
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
        pressItems={pressItems}
        slug="prensa"
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#4d4e4f] font-sans">
      <Navbar data={headerData} />

      {/* Encabezado de página dedicada de Prensa Unificada */}
      <section className="pt-28 pb-14 bg-[#4d4e4f] text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#3cac59]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#1b87c7]/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#f9f9f9]/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/25 border border-[#1b87c7]/40 text-[#f9f9f9] text-xs font-bold uppercase tracking-wider mb-4 block w-fit">
            <Newspaper className="w-3.5 h-3.5 text-[#3cac59]" />
            <span>{pressContent.badge}</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            {pressContent.title}
          </h1>
          <p className="text-base sm:text-lg text-[#f9f9f9]/80 max-w-2xl leading-relaxed mb-8">
            {pressContent.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#3cac59]" />
              <span>Ir al Blog Propio</span>
            </Link>
            <Link
              href="/comunidad"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3cac59] hover:bg-[#2d8d45] text-white text-xs sm:text-sm font-bold transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Acceder a Comunidad Promovêre</span>
            </Link>
          </div>
        </div>
      </section>

      <PressSection collectionItems={pressItems} hideViewAllCta />

      <Footer data={footerData} settings={siteSettings} />
    </main>
  );
}
