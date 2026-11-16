import Image from 'next/image';
import { Camera, MapPin } from 'lucide-react';

interface GalleryItem {
  image: string;
  title: string;
  location: string;
  tag?: string;
}

interface GallerySectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: GalleryItem[];
  };
}

export default function GallerySection({ data }: GallerySectionProps) {
  const badge = data?.badge || 'Galería de Experiencias';
  const title = data?.title || 'Destinos y propiedades de clase mundial';
  const subtitle =
    data?.subtitle ||
    'Una muestra visual de los resorts, destinos y vivencias que representamos en los mercados emisores más importantes.';

  const defaultItems: GalleryItem[] = [
    {
      image:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      title: 'Resorts All-Inclusive de Lujo',
      location: 'Caribe & México',
      tag: 'Hotelería',
    },
    {
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      title: 'Playas Paradisiacas & Aguas Cristalinas',
      location: 'Islas Caimán',
      tag: 'Destino',
    },
    {
      image:
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
      title: 'Circuitos y Hoteles Clásicos del Mediterráneo',
      location: 'Grecia & Islas',
      tag: 'Circuitos',
    },
    {
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      title: 'Experiencias Boutique Exclusivas',
      location: 'América del Norte',
      tag: 'Boutique',
    },
  ];

  const items = data?.items && data.items.length > 0 ? data.items : defaultItems;

  return (
    <section id="galeria" className="py-20 md:py-28 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3cac59]/10 text-[#3cac59] border border-[#3cac59]/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Camera className="w-3.5 h-3.5" />
            {badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4d4e4f] tracking-tight mb-4 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base sm:text-lg text-[#4d4e4f]/80 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Gallery Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-[#4d4e4f]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-90"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Tag Top */}
              {item.tag && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/20">
                    {item.tag}
                  </span>
                </div>
              )}

              {/* Content Bottom */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3cac59] mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.location}</span>
                </div>
                <h3 className="text-base font-bold leading-tight drop-shadow-xs">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
