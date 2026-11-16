import { Quote, Star } from 'lucide-react';

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
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: TestimonialItem[];
  };
}

export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
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
    <section id="testimonios" className="py-20 md:py-28 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3cac59]/10 text-[#3cac59] border border-[#3cac59]/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Quote className="w-3.5 h-3.5" />
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

        {/* Testimonials Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-[#f9f9f9] rounded-3xl p-8 border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-6 text-amber-400">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-[#4d4e4f]/90 leading-relaxed italic mb-8">
                  "{item.quote}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-6 border-t border-gray-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                  {item.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#4d4e4f] leading-tight">
                    {item.author}
                  </h4>
                  <p className="text-xs text-[#1b87c7] font-semibold mt-0.5">
                    {item.role}
                  </p>
                  <p className="text-[11px] text-[#4d4e4f]/60 font-medium">
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
