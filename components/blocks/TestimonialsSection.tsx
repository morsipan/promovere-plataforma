import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating?: number;
  avatar?: string;
}

interface TestimonialsSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: TestimonialItem[];
  };
}

export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blanco',
    theme: 'light',
  });

  const badge = data?.badge || 'Testimonios & Casos de Éxito';
  const title = data?.title || 'La confianza de los líderes del turismo en LATAM';
  const subtitle =
    data?.subtitle ||
    'Lo que dicen directivos hoteleros, ejecutivos de aerolíneas y turoperadores mayoristas sobre trabajar junto a Promovêre.';

  const defaultItems: TestimonialItem[] = [
    {
      quote:
        'Promovêre logró posicionar nuestra cadena en el Cono Sur en tiempo récord. Su llegada al trade mayorista y la calidad de sus acciones comerciales son incomparables.',
      author: 'Carlos Mendoza',
      role: 'Director Comercial Regional',
      company: 'Cadena Hotelera Caribe',
      rating: 5,
    },
    {
      quote:
        'Como operador mayorista, contar con el soporte inmediato del equipo de Promovêre nos da seguridad absoluta para emitir y resolver cotizaciones complejas con éxito.',
      author: 'Mariana Silveira',
      role: 'Gerente de Producto Internacional',
      company: 'Turoperador Mayorista LATAM',
      rating: 5,
    },
    {
      quote:
        'La dedicación, el conocimiento del mercado latinoamericano y la cercanía humana de Lucas y su equipo marcan una diferencia enorme en cada campaña.',
      author: 'Alejandro Rossi',
      role: 'VP Sales & Marketing',
      company: 'Grupo Turístico Destinos',
      rating: 5,
    },
  ];

  const items = data?.items && data.items.length > 0 ? data.items : defaultItems;

  return (
    <section id="testimonios" className={`py-20 md:py-28 relative overflow-hidden ${sectionAppearance.bgClass}`}>
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo Testimonios"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge ? (
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${sectionAppearance.badgeClass}`}>
              <Quote className={`w-3.5 h-3.5 ${sectionAppearance.badgeIconClass}`} />
              {badge}
            </div>
          ) : null}
          {title ? (
            <h2 className={`font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight ${sectionAppearance.titleClass}`}>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className={`text-base sm:text-lg leading-relaxed font-normal ${sectionAppearance.subtitleClass}`}>
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Testimonials Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${sectionAppearance.cardClass}`}
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-6 text-amber-400">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className={`text-sm sm:text-base leading-relaxed italic mb-8 ${sectionAppearance.cardSubtextClass}`}>
                  "{item.quote}"
                </p>
              </div>

              {/* Author footer */}
              <div className={`pt-6 border-t ${sectionAppearance.borderClass} flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                  {item.author.charAt(0)}
                </div>
                <div>
                  <h4 className={`text-sm font-bold leading-tight ${sectionAppearance.cardTitleClass}`}>
                    {item.author}
                  </h4>
                  <p className={`text-xs font-semibold mt-0.5 ${sectionAppearance.accentTextClass}`}>
                    {item.role}
                  </p>
                  <p className={`text-[11px] font-medium opacity-75 ${sectionAppearance.cardSubtextClass}`}>
                    {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
