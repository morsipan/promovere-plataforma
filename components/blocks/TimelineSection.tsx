import Image from 'next/image';
import { Calendar, Flag } from 'lucide-react';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface MilestoneItem {
  year: string;
  title: string;
  description: string;
  tag?: string;
}

interface TimelineSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    subtitle?: string;
    milestones?: MilestoneItem[];
  };
}

export default function TimelineSection({ data }: TimelineSectionProps) {
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blancoHumo',
    theme: 'light',
  });

  const badge = data?.badge || 'Nuestra Trayectoria';
  const title =
    data?.title || 'Una década construyendo puentes comerciales en LATAM';
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
    <section id="trayectoria" className={`py-20 md:py-28 relative overflow-hidden ${sectionAppearance.bgClass}`}>
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo Trayectoria"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge ? (
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${sectionAppearance.badgeClass}`}
            >
              <Calendar className={`w-3.5 h-3.5 ${sectionAppearance.badgeIconClass}`} />
              {badge}
            </div>
          ) : null}
          {title ? (
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight ${sectionAppearance.titleClass}`}
            >
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className={`text-base sm:text-lg leading-relaxed font-normal ${sectionAppearance.subtitleClass}`}>
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {milestones.map((item, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between ${sectionAppearance.cardClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3.5 py-1 rounded-xl text-white font-black text-sm shadow-xs ${sectionAppearance.accentBgClass}`}>
                    {item.year}
                  </span>
                  {item.tag ? (
                    <span className={`text-xs font-bold uppercase tracking-wider ${sectionAppearance.accentTextClass}`}>
                      {item.tag}
                    </span>
                  ) : null}
                </div>

                <h3 className={`text-xl font-bold mb-3 ${sectionAppearance.cardTitleClass}`}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed ${sectionAppearance.cardSubtextClass}`}>
                  {item.description}
                </p>
              </div>

              <div className={`mt-6 pt-4 border-t ${sectionAppearance.borderClass} flex items-center gap-2 text-xs font-semibold ${sectionAppearance.accentTextClass}`}>
                <Flag className={`w-3.5 h-3.5 ${sectionAppearance.badgeIconClass}`} />
                <span>Hito Consolidado</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
