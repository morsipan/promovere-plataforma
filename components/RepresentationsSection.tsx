import Image from 'next/image';
import { MapPin, Building2, ArrowUpRight } from 'lucide-react';
import { representationsContent } from '@/data/content';

interface RepresentationItemCMS {
  id?: string;
  title: string;
  brand: string;
  country: string;
  category?: string;
  tag?: string;
  description: string;
  image: string;
}

interface RepresentationsSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: RepresentationItemCMS[];
  };
}

export default function RepresentationsSection({ data }: RepresentationsSectionProps = {}) {
  const badge = data?.badge || representationsContent.badge;
  const title = data?.title || representationsContent.title;
  const subtitle = data?.subtitle || representationsContent.subtitle;
  const items =
    data?.items && data.items.length > 0 ? data.items : representationsContent.items;

  return (
    <section id="representaciones" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3cac59]/10 text-[#3cac59] border border-[#3cac59]/20 text-xs font-bold uppercase tracking-wider mb-4">
            {badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4d4e4f] tracking-tight mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-[#4d4e4f]/80 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* Representations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => {
            const isFeatured = index === 0 || index === 3;

            return (
              <div
                key={item.id || `rep-${index}`}
                className={`group relative overflow-hidden rounded-3xl bg-[#4d4e4f] shadow-md hover:shadow-2xl transition-all duration-500 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between ${
                  isFeatured ? 'md:col-span-1 lg:col-span-1' : ''
                }`}
              >
                {/* Background Image */}
                {item.image && (
                  <Image
                    src={item.image}
                    alt={`${item.title} - ${item.brand}`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4d4e4f] via-[#4d4e4f]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="relative z-10 p-6 flex items-start justify-between">
                  {item.category && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider border border-white/20">
                      <Building2 className="w-3.5 h-3.5 text-[#3cac59]" />
                      {item.category}
                    </span>
                  )}
                  {item.tag && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1b87c7] text-white text-xs font-bold shadow-sm">
                      {item.tag}
                    </span>
                  )}
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-6 sm:p-8">
                  {item.country && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#3cac59] uppercase tracking-wider mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.country}</span>
                    </div>
                  )}

                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-1.5 leading-tight group-hover:text-[#3cac59] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm font-semibold text-white/90 mb-3">
                    {item.brand}
                  </p>

                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>

                  <a
                    href="/comunidad/login"
                    className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#1b87c7] transition-colors"
                  >
                    <span>Ver información comercial</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
