import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, MapPin, ArrowRight, Lock, Compass, Tag } from 'lucide-react';
import { resolveAppearance, type AppearanceData } from '@/lib/appearance';

interface PolaroidProduct {
  id: string;
  title: string;
  badge: string;
  location: string;
  image: string;
  description: string;
  rotationClass: string;
}

const polaroids: PolaroidProduct[] = [
  {
    id: 'solaris-mega-sale',
    title: 'Solaris Mega Sale 2026',
    badge: 'Mega Venta',
    location: 'Cancún & Los Cabos',
    image:
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
    description: 'Condiciones promocionales exclusivas para el canal trade y familias.',
    rotationClass: '-rotate-1 hover:rotate-0',
  },
  {
    id: 'enjoy-punta-del-este',
    title: 'Enjoy Punta del Este Resort',
    badge: 'Escapadas & Casino',
    location: 'Uruguay • Cono Sur',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    description: 'Hotelería de nivel internacional, shows en vivo y relax frente a la Playa Mansa.',
    rotationClass: 'rotate-1 hover:rotate-0',
  },
  {
    id: 'atelier-playa-mujeres',
    title: 'Atelier Playa Mujeres',
    badge: 'All-Inclusive Lujo',
    location: 'México • Adults Only',
    image:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    description: 'Hospitalidad artesanal y gastronomía galardonada en suites de lujo.',
    rotationClass: '-rotate-1 hover:rotate-0',
  },
];

interface DestinationItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  experiencesCount: string;
}

const destinations: DestinationItem[] = [
  {
    id: 'caribe',
    name: 'Caribe',
    subtitle: 'Playas idílicas, resorts all-inclusive y sol todo el año',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    experiencesCount: 'Resorts Representados',
  },
  {
    id: 'europa',
    name: 'Europa & Mediterráneo',
    subtitle: 'Circuitos clásicos en español, islas griegas y cultura milenaria',
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    experiencesCount: 'Circuitos & DMCs',
  },
  {
    id: 'eeuu',
    name: 'Estados Unidos',
    subtitle: 'Parques temáticos, Las Vegas, compras y grandes metrópolis',
    image:
      'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800&q=80',
    experiencesCount: 'Receptivo Especializado',
  },
  {
    id: 'brasil',
    name: 'Brasil & Cono Sur',
    subtitle: 'Nordeste, hospitalidad luso-brasileña y conectividad regional',
    image:
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
    experiencesCount: 'Cadenas Hoteleras',
  },
];

interface FeaturedProductsProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    appearance?: AppearanceData;
  };
}

export default function FeaturedProducts({ data }: FeaturedProductsProps = {}) {
  const badge = data?.badge || 'Productos y Destinos';
  const title = data?.title || 'Productos Destacados & Destinos';
  const subtitle =
    data?.subtitle ||
    'Descubrí las marcas, cadenas y regiones preferidas por los viajeros de Latinoamérica.';
  const app = resolveAppearance(data?.appearance, {
    backgroundColor: 'blanco',
    theme: 'light',
    accentColor: 'verde',
    buttonColor: 'azul',
    badgeColor: 'azul',
  });

  return (
    <section className={`relative py-20 md:py-28 ${app.bgClass} border-b ${app.borderClass} overflow-hidden`}>
      {app.backgroundImageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${app.backgroundImageUrl})` }}
          />
          <div className={`absolute inset-0 ${app.overlayClass}`} />
        </>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${app.badgeClass}`}>
            <Tag className={`w-3.5 h-3.5 ${app.badgeIconClass}`} />
            {badge}
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight ${app.titleClass}`}>
            {title}
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed font-normal ${app.subtitleClass}`}>
            {subtitle}
          </p>
        </div>

        {/* 1. Tarjetas Estilo Polaroid / Postales */}
        <div className="mb-20">
          <h3 className="text-xl font-bold text-[#4d4e4f] mb-6 flex items-center gap-2 font-heading">
            <Sparkles className="w-5 h-5 text-[#3cac59]" />
            <span>Colección de Postales Comerciales</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {polaroids.map((item) => (
              <div
                key={item.id}
                className={`bg-white p-4 pb-6 rounded-2xl shadow-lg border border-slate-200 transition-all duration-300 transform ${item.rotationClass} hover:shadow-2xl hover:scale-102 flex flex-col justify-between`}
              >
                <div>
                  {/* Foto de la Polaroid */}
                  <div className="relative h-64 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/95 text-[#1b87c7] shadow-sm">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#3cac59] font-bold uppercase mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>

                  <h4 className="text-xl font-extrabold text-[#4d4e4f] mb-1 leading-snug font-heading">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Ficha Técnica B2B Protegida
                  </span>
                  <Link
                    href="/comunidad/login"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b87c7] hover:text-[#0e6aa3] transition-colors"
                  >
                    <span>Ver ficha</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Grilla Inferior de Destinos (Fondos Oscurecidos) */}
        <div>
          <h3 className="text-xl font-bold text-[#4d4e4f] mb-6 flex items-center gap-2 font-heading">
            <Compass className="w-5 h-5 text-[#1b87c7]" />
            <span>Destinos Principales de Representación</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="group relative overflow-hidden rounded-3xl h-80 bg-[#4d4e4f] shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6 border border-slate-200"
              >
                {/* Imagen de fondo */}
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Overlays oscurecidos */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Contenido sobre la imagen */}
                <div className="relative z-10 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#3cac59] border border-white/20 mb-2">
                    {dest.experiencesCount}
                  </span>

                  <h4 className="text-2xl font-black text-white mb-1.5 font-heading group-hover:text-[#3cac59] transition-colors">
                    {dest.name}
                  </h4>

                  <p className="text-xs text-white/80 leading-relaxed mb-4 line-clamp-2">
                    {dest.subtitle}
                  </p>

                  <Link
                    href="/comunidad/login"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b87c7] group-hover:text-white transition-colors"
                  >
                    <span>Explorar catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
