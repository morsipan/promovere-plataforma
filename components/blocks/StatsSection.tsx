import { TrendingUp } from 'lucide-react';

interface StatItem {
  value: string;
  label: string;
  description?: string;
}

interface StatsSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    statsList?: StatItem[];
  };
}

export default function StatsSection({ data }: StatsSectionProps) {
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
    <section className="py-20 md:py-28 bg-white border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] border border-[#1b87c7]/20 text-xs font-bold uppercase tracking-wider mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-[#3cac59]" />
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#f9f9f9] rounded-3xl p-8 border border-gray-200/80 hover:border-[#1b87c7]/40 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="text-4xl sm:text-5xl font-black text-[#1b87c7] mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-base font-bold text-[#4d4e4f] mb-2">
                {stat.label}
              </div>
              {stat.description && (
                <p className="text-xs text-[#4d4e4f]/70 leading-relaxed">
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
