import { Calendar, Flag } from 'lucide-react';

interface MilestoneItem {
  year: string;
  title: string;
  description: string;
  tag?: string;
}

interface TimelineSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    milestones?: MilestoneItem[];
  };
}

export default function TimelineSection({ data }: TimelineSectionProps) {
  const badge = data?.badge || 'Nuestra Trayectoria';
  const title =
    data?.title || 'Años construyendo puentes comerciales en LATAM';
  const subtitle =
    data?.subtitle ||
    'Hitos clave de crecimiento y alianzas estratégicas que consolidaron a Promovêre como referente del trade regional.';

  const defaultMilestones: MilestoneItem[] = [
    {
      year: 'Inicios',
      title: 'Nacimiento de Promovêre',
      description:
        'Fundación de la agencia con el objetivo de profesionalizar la representación y comercialización de marcas turísticas en el mercado latinoamericano.',
      tag: 'Fundación',
    },
    {
      year: 'Expansión',
      title: 'Red Federal y Cono Sur',
      description:
        'Consolidación de alianzas con los principales operadores mayoristas en Argentina, Uruguay, Paraguay y Chile.',
      tag: 'Crecimiento',
    },
    {
      year: 'Innovación',
      title: 'Lanzamiento de la Comunidad Trade',
      description:
        'Creación de la plataforma digital para capacitar, proveer recursos de venta y conectar al trade minorista con nuestros destinos.',
      tag: 'Digital',
    },
    {
      year: 'Actualidad',
      title: 'Liderazgo y Alianzas Globales',
      description:
        'Representación integral de cadenas hoteleras líderes en el Caribe, destinos internacionales y aerolíneas en toda la región.',
      tag: 'Liderazgo',
    },
  ];

  const milestones =
    data?.milestones && data.milestones.length > 0
      ? data.milestones
      : defaultMilestones;

  return (
    <section id="trayectoria" className="py-20 md:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] border border-[#1b87c7]/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5 text-[#3cac59]" />
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

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {milestones.map((item, index) => (
            <div
              key={index}
              className="bg-[#f9f9f9] rounded-3xl p-8 border border-gray-200/80 hover:border-[#3cac59]/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-xl bg-[#1b87c7] text-white font-black text-sm shadow-xs">
                    {item.year}
                  </span>
                  {item.tag && (
                    <span className="text-xs font-bold text-[#3cac59] uppercase tracking-wider">
                      {item.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#4d4e4f] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#4d4e4f]/80 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center gap-2 text-xs font-semibold text-[#1b87c7]">
                <Flag className="w-3.5 h-3.5 text-[#3cac59]" />
                <span>Hito Consolidado</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
