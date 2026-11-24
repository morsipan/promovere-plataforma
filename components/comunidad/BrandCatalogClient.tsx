'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Building2,
  MapPin,
  ArrowRight,
  Globe,
  Images,
  Sparkles,
  Lock,
} from 'lucide-react';
import { getMediaUrl } from '@/lib/media';
import { getBrandSlug } from '@/lib/brands';

export interface PublicBrandItem {
  id: string | number;
  title: string;
  brand: string;
  country: string;
  category: string;
  tag?: string | null;
  description: string;
  coverImage?: unknown;
  coverImageUrl?: string | null;
  logo?: unknown;
  websiteUrl?: string | null;
  mediaKitUrl?: string | null;
}

interface BrandCatalogClientProps {
  brands: PublicBrandItem[];
}

export default function BrandCatalogClient({ brands }: BrandCatalogClientProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const item of brands) {
      if (item.category) set.add(item.category);
    }
    return Array.from(set);
  }, [brands]);

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase();
    return brands.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.brand.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [brands, query, selectedCategory]);

  return (
    <section className="py-16 md:py-20 bg-[#f9f9f9] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra de búsqueda y filtro por categoría */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs mb-10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar marca comercial, cadena hotelera, DMC o destino..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] outline-none text-[#4d4e4f]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#1b87c7] text-white'
                  : 'bg-[#f9f9f9] text-[#4d4e4f] border border-gray-200 hover:border-[#1b87c7]'
              }`}
            >
              Todas ({brands.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#3cac59] text-white'
                    : 'bg-[#f9f9f9] text-[#4d4e4f] border border-gray-200 hover:border-[#3cac59]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla priorizando MARCAS COMERCIALES */}
        {filteredBrands.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
            <p className="font-heading text-xl font-bold text-[#4d4e4f] mb-2">
              No encontramos marcas con ese criterio
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] text-white text-xs font-bold cursor-pointer"
            >
              Ver todas las marcas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredBrands.map((item) => {
              const slug = getBrandSlug(item);
              const coverSrc =
                getMediaUrl(item.coverImage) ||
                item.coverImageUrl ||
                '/assets/WebP/hero-bg-promovere.webp';
              const logoSrc = getMediaUrl(item.logo);

              return (
                <article
                  key={String(item.id)}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Cabecera visual */}
                    <div className="relative h-52 w-full overflow-hidden bg-[#4d4e4f]">
                      <img
                        src={coverSrc}
                        alt={item.brand}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#4d4e4f]/90 via-[#4d4e4f]/25 to-transparent" />

                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#1b87c7] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          <Building2 className="w-3 h-3" />
                          <span>{item.category}</span>
                        </span>
                        {item.tag ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#3cac59] text-white text-[11px] font-bold shadow-sm">
                            {item.tag}
                          </span>
                        ) : null}
                      </div>

                      {logoSrc ? (
                        <div className="absolute bottom-4 left-4 bg-white/95 rounded-xl px-3 py-1.5 shadow-md">
                          <img
                            src={logoSrc}
                            alt={item.brand}
                            className="h-7 w-auto max-w-[130px] object-contain"
                          />
                        </div>
                      ) : null}
                    </div>

                    {/* Contenido — Prioriza MARCA COMERCIAL */}
                    <div className="p-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#3cac59] uppercase tracking-wider mb-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {item.country}
                          {item.title && item.title !== item.country ? ` · ${item.title}` : ''}
                        </span>
                      </div>

                      <h2 className="font-heading text-2xl font-bold text-[#4d4e4f] group-hover:text-[#1b87c7] transition-colors leading-snug mb-2">
                        {item.brand}
                      </h2>

                      <p className="text-sm text-[#4d4e4f]/80 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="px-6 pb-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {item.mediaKitUrl ? (
                        <a
                          href={item.mediaKitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#f9f9f9] hover:bg-[#1b87c7]/10 text-[#4d4e4f] hover:text-[#1b87c7] text-xs font-semibold transition-colors"
                        >
                          <Images className="w-3.5 h-3.5" />
                          <span>Fotos</span>
                        </a>
                      ) : null}
                      {item.websiteUrl ? (
                        <a
                          href={item.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#f9f9f9] hover:bg-[#1b87c7]/10 text-[#4d4e4f] hover:text-[#1b87c7] text-xs font-semibold transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Web</span>
                        </a>
                      ) : null}
                    </div>

                    <Link
                      href={`/comunidad/marcas/${slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <span>Ver marca</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Nota de acceso a herramientas privadas y roles */}
        <div className="mt-14 rounded-3xl bg-[#4d4e4f] text-white p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#3cac59] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceso Trade B2B</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
              ¿Necesitás herramientas comerciales, webinars y material privado?
            </h3>
            <p className="text-sm text-[#f9f9f9]/80 leading-relaxed">
              Las fichas de marcas son de acceso libre. Para acceder a herramientas operativas,
              inscripción en 1 clic a capacitaciones y documentación segmentada según tu perfil
              (agencia minorista u operador mayorista), ingresá a tu panel privado.
            </p>
          </div>
          <Link
            href="/comunidad/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#3cac59] hover:bg-[#2d8d45] text-white font-bold text-sm shadow-lg transition-all shrink-0"
          >
            <Lock className="w-4 h-4" />
            <span>Ingresar al Portal Comunidad</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
