import Image from 'next/image';
import { TrendingUp } from 'lucide-react';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface StatItem {
  value: string;
  label: string;
  description?: string;
}

interface StatsSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    subtitle?: string;
    statsList?: StatItem[];
  };
}

export default function StatsSection({ data }: StatsSectionProps) {
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'grisOscuro',
    theme: 'dark',
  });

  const badge = data?.badge || 'Métricas de Impacto';
  const title = data?.title || 'El alcance real de Promovêre en números';
  const subtitle =
    data?.subtitle ||
    'Cifras consolidadas que respaldan nuestra trayectoria y presencia comercial en América Latina.';

  const defaultStats: StatItem[] = [
    {
      value: '+500',
      label: 'Operadores Mayoristas',
      description: 'Conectados activamente en los principales mercados emisores de la región.',
    },
    {
      value: '10+',
      label: 'Países de Cobertura',
      description: 'Presencia continua en el Cono Sur, Región Andina y Centroamérica.',
    },
    {
      value: '+15.000',
      label: 'Agencias Minoristas',
      description: 'Alcanzadas mediante capacitaciones, newsletters y kits trade.',
    },
    {
      value: '100%',
      label: 'Enfoque B2B Especializado',
      description: 'Respetando y fortaleciendo siempre el canal de comercialización turística.',
    },
  ];

  const stats =
    data?.statsList && data.statsList.length > 0 ? data.statsList : defaultStats;

  return (
    <section className={`py-20 md:py-28 relative overflow-hidden ${sectionAppearance.bgClass}`}>
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo Estadísticas"
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
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${sectionAppearance.badgeClass}`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#3cac59]" />
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 text-center ${sectionAppearance.cardClass}`}
            >
              <div className="text-4xl sm:text-5xl font-black text-[#1b87c7] mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className={`text-base font-bold mb-2 ${sectionAppearance.cardTitleClass}`}>
                {stat.label}
              </div>
              {stat.description ? (
                <p className={`text-xs leading-relaxed ${sectionAppearance.cardSubtextClass}`}>
                  {stat.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
