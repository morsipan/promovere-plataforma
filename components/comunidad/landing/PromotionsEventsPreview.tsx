import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Sparkles, MapPin, ArrowRight, Lock, Users } from 'lucide-react';
import { resolveAppearance, type AppearanceData } from '@/lib/appearance';

interface PromotionItem {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  location: string;
  description: string;
  image: string;
  spotsInfo: string;
}

const promoItems: PromotionItem[] = [
  {
    id: 'fam-tours',
    badge: 'Fam Tours Exclusivos',
    badgeColor: 'bg-[#3cac59]/10 text-[#3cac59] border-[#3cac59]/20',
    title: 'Fam Tour Riviera Maya & Caribe 2026',
    location: 'México • Caribe Mexicano',
    description:
      'Viaje de familiarización e inspección técnica de resorts 5 estrellas y all-inclusive. Cupos de inmersión para agencias y productores top.',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    spotsInfo: 'Cupos limitados para miembros',
  },
  {
    id: 'las-vegas',
    badge: 'Capacitación Oficial',
    badgeColor: 'bg-[#1b87c7]/10 text-[#1b87c7] border-[#1b87c7]/20',
    title: 'Las Vegas en Tu Idioma • Shows & Receptivo',
    location: 'Estados Unidos • Nevada',
    description:
      'Especialización en hotelería temática, espectáculos de primer nivel y excursiones al Gran Cañón con guías certificados de habla hispana.',
    image:
      'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800&q=80',
    spotsInfo: 'Webinar & Certificación Trade',
  },
  {
    id: 'caribe-all-inclusive',
    badge: 'Promoción & Cupos',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    title: 'Caribe Histórico: Gaviota Hoteles & Playas',
    location: 'Cuba • Varadero, Cayos & La Habana',
    description:
      'Condiciones y cupos preferenciales para turoperadores. Acceso a releases especiales, paquetes combinados y manuales de producto.',
    image:
      'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800&q=80',
    spotsInfo: 'Condiciones exclusivas trade',
  },
];

interface PromotionsEventsPreviewProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    appearance?: AppearanceData;
  };
}

export default function PromotionsEventsPreview({ data }: PromotionsEventsPreviewProps = {}) {
  const badge = data?.badge || 'Oportunidades Comerciales';
  const title = data?.title || 'Promociones, Eventos y Fam Tours Exclusivos';
  const subtitle =
    data?.subtitle ||
    'Accedé a convocatorias para viajes de familiarización, desayunos de capacitación y acuerdos comerciales reservados para nuestra red.';
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
            <Calendar className={`w-3.5 h-3.5 ${app.badgeIconClass}`} />
            {badge}
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight ${app.titleClass}`}>
            {title}
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed font-normal ${app.subtitleClass}`}>
            {subtitle}
          </p>
        </div>

        {/* Grilla de 3 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promoItems.map((promo) => (
            <div
              key={promo.id}
              className="bg-[#f9f9f9] rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Imagen con Badge Superpuesto */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md bg-white/90 ${promo.badgeColor}`}
                    >
                      <Sparkles className="w-3 h-3" />
                      {promo.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#3cac59]" />
                    <span>{promo.location}</span>
                  </div>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#4d4e4f] mb-2 leading-tight group-hover:text-[#1b87c7] transition-colors font-heading">
                    {promo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                    {promo.description}
                  </p>
                </div>
              </div>

              {/* Botón de Acción Azul que Redirige a Login */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {promo.spotsInfo}
                  </span>
                  <Link
                    href="/comunidad/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] hover:bg-[#1571a8] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#1b87c7]/20 transition-all hover:gap-2.5"
                  >
                    <span>Ver más</span>
                    <Lock className="w-3.5 h-3.5 text-white/80" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
