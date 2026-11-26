import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Building2, ArrowUpRight } from 'lucide-react';
import { representationsContent } from '@/data/content';
import { getMediaUrl } from '@/lib/media';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface RepresentationItemCMS {
  id?: string | number;
  slug?: string | null;
  title: string;
  brand: string;
  country: string;
  category?: string;
  tag?: string;
  description: string;
  image?: unknown;
  coverImage?: unknown;
  logo?: unknown;
  imageUrl?: string;
  coverImageUrl?: string | null;
  isPublished?: boolean | null;
}

interface RepresentationsSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: RepresentationItemCMS[];
  };
  collectionReps?: RepresentationItemCMS[] | null;
}

export default function RepresentationsSection({
  data,
  collectionReps,
}: RepresentationsSectionProps = {}) {
  // Resolución dinámica de apariencia no-code
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blanco',
    theme: 'light',
    overlayOpacity: 'media',
  });

  const badge = data?.badge || representationsContent.badge;
  const title = data?.title || representationsContent.title;
  const subtitle = data?.subtitle || representationsContent.subtitle;

  // Si se recibe la colección `representations` desde CMS (filtrada por isPublished = true),
  // respetar estrictamente ese listado para que al despublicar una Rep desaparezca de la Home.
  const hasCmsCollection = Array.isArray(collectionReps);
  const items: RepresentationItemCMS[] = hasCmsCollection
    ? collectionReps.filter((rep) => rep.isPublished !== false)
    : data?.items && data.items.length > 0
    ? data.items
    : representationsContent.items;

  if (hasCmsCollection && items.length === 0) {
    return null;
  }

  return (
    <section id="representaciones" className={`py-20 md:py-28 relative overflow-hidden ${sectionAppearance.bgClass}`}>
      {/* Fondo de Imagen Opcional configurado en Apariencia */}
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo decorativo de representaciones"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de Sección con contraste dinámico */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge ? (
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 font-sans ${sectionAppearance.badgeClass}`}>
              {badge}
            </div>
          ) : null}
          {title ? (
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight ${sectionAppearance.titleClass}`}>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className={`text-base sm:text-lg leading-relaxed font-normal ${sectionAppearance.subtitleClass}`}>
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Grilla de Representaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => {
            const isFeatured = index === 0 || index === 3;
            const fallbackImageUrl =
              (typeof item.coverImageUrl === 'string' && item.coverImageUrl) ||
              ('imageUrl' in item && typeof (item as any).imageUrl === 'string'
                ? (item as any).imageUrl
                : '');
            const imageUrl = getMediaUrl(
              item.coverImage ?? item.image,
              fallbackImageUrl || (typeof item.image === 'string' ? item.image : ''),
            );
            const logoUrl = getMediaUrl(item.logo, '');
            const repHref = item.slug ? `/reps/${item.slug}` : '/comunidad/login';

            return (
              <Link
                key={item.id || `rep-${index}`}
                href={repHref}
                className={`group relative overflow-hidden rounded-3xl bg-[#4d4e4f] shadow-md hover:shadow-2xl transition-all duration-500 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between ${
                  isFeatured ? 'md:col-span-1 lg:col-span-1' : ''
                }`}
              >
                {/* Background Image */}
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${item.title} - ${item.brand}`}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4d4e4f] via-[#1b87c7]/75 to-[#3cac59]/60" />
                )}

                {/* Overlays corporativos */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4d4e4f] via-[#4d4e4f]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                {/* Badges superiores */}
                <div className="relative z-10 p-6 flex items-start justify-between gap-2">
                  {logoUrl ? (
                    <div className="relative w-12 h-12 rounded-xl bg-white/95 p-1.5 shadow-sm shrink-0">
                      <Image
                        src={logoUrl}
                        alt={`Logo ${item.brand || item.title}`}
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    </div>
                  ) : item.category ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider border border-white/20 font-sans">
                      <Building2 className="w-3.5 h-3.5 text-[#3cac59]" />
                      {item.category}
                    </span>
                  ) : (
                    <span />
                  )}
                  {item.tag ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1b87c7] text-white text-xs font-bold shadow-sm font-sans">
                      {item.tag}
                    </span>
                  ) : null}
                </div>

                {/* Contenido inferior — Marca como título principal (no destino) */}
                <div className="relative z-10 p-6 sm:p-8">
                  {item.country || item.title ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#3cac59] uppercase tracking-wider mb-2 font-sans">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {item.title && item.title !== item.brand
                          ? item.title
                          : item.country}
                      </span>
                    </div>
                  ) : null}

                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight group-hover:text-[#3cac59] transition-colors font-heading">
                    {item.brand || item.title}
                  </h3>

                  {item.country && item.title && item.country !== item.title ? (
                    <p className="text-xs font-semibold text-white/85 mb-2 font-sans">
                      {item.country}
                    </p>
                  ) : null}

                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-3 mb-4 font-sans">
                    {item.description}
                  </p>

                  <span className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#1b87c7] transition-colors font-sans">
                    <span>{item.slug ? 'Ver representación' : 'Ver información comercial'}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
