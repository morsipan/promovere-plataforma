import type { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { ArrowLeft, Building2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BrandCatalogClient, { type PublicBrandItem } from '@/components/comunidad/BrandCatalogClient';
import { representationsContent } from '@/data/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catálogo de Marcas Representadas — Comunidad Promovêre',
  description:
    'Explorá el catálogo oficial por marcas comerciales, cadenas hoteleras, DMCs y destinos representados por Promovêre en América Latina. Acceso libre para el trade.',
};

export default async function ComunidadMarcasCatalogPage() {
  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;
  let brands: PublicBrandItem[] = [];

  try {
    const payload = await getPayload({ config });
    const [repsRes, headerRes, footerRes, settingsRes] = await Promise.all([
      payload
        .find({
          collection: 'representations',
          where: { status: { equals: 'active' } },
          sort: 'order',
          depth: 1,
          limit: 100,
        })
        .catch(() => ({ docs: [] })),
      payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
    ]);

    headerData = headerRes;
    footerData = footerRes;
    siteSettings = settingsRes;

    if (repsRes?.docs && repsRes.docs.length > 0) {
      brands = repsRes.docs.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        brand: doc.brand,
        country: doc.country,
        category: doc.category,
        tag: doc.tag ?? null,
        description: doc.description || '',
        coverImage: doc.coverImage ?? null,
        coverImageUrl: doc.coverImageUrl ?? null,
        logo: doc.logo ?? null,
        websiteUrl: doc.websiteUrl ?? null,
        mediaKitUrl: doc.mediaKitUrl ?? null,
      }));
    }
  } catch (err) {
    console.error('Error cargando catálogo libre de marcas:', err);
  }

  if (brands.length === 0) {
    brands = representationsContent.items.map((item) => ({
      id: item.id,
      title: item.title,
      brand: item.brand,
      country: item.country,
      category: item.category,
      tag: item.tag,
      description: item.description,
      coverImageUrl: item.image,
    }));
  }

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#4d4e4f] font-sans">
      <Navbar data={headerData} />

      <section className="pt-28 pb-14 bg-[#4d4e4f] text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1b87c7]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#3cac59]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/comunidad"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#f9f9f9]/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Comunidad</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3cac59]/20 border border-[#3cac59]/40 text-[#3cac59] text-xs font-bold uppercase tracking-wider mb-4 block w-fit">
            <Building2 className="w-3.5 h-3.5" />
            <span>Catálogo por Marcas · Acceso Libre</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 max-w-3xl">
            Marcas Comerciales Representadas
          </h1>
          <p className="text-base sm:text-lg text-[#f9f9f9]/80 max-w-2xl leading-relaxed mb-8">
            Conocé cada cadena hotelera, DMC y marca turística de nuestro portafolio en su landing
            dedicada de acceso libre para agencias y operadores de LATAM.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/comunidad/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white text-xs sm:text-sm font-bold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#3cac59]" />
              <span>Ir a mi Panel Privado</span>
            </Link>
          </div>
        </div>
      </section>

      <BrandCatalogClient brands={brands} />

      <Footer data={footerData} settings={siteSettings} />
    </main>
  );
}
