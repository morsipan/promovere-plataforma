import Image from 'next/image';
import Link from 'next/link';
import { Radio, TrendingUp, CalendarCheck2, Sparkles, ArrowRight } from 'lucide-react';
import { resolveAppearance, type AppearanceData } from '@/lib/appearance';

export interface PrMetricItemCMS {
  id?: string | null;
  metricKey?: 'alcance' | 'ad_value' | 'eventos' | string | null;
  label: string;
  value: string;
  description?: string | null;
}

export interface PrMetricsSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string | null;
    title?: string | null;
    subtitle?: string | null;
    metrics?: PrMetricItemCMS[] | null;
  };
}

const DEFAULT_PR_METRICS: PrMetricItemCMS[] = [
  {
    metricKey: 'alcance',
    label: 'Alcance de PR',
    value: 'A definir',
    description:
      'Impacto editorial acumulado en prensa especializada del trade, medios masivos y audiencias digitales en LATAM.',
  },
  {
    metricKey: 'ad_value',
    label: 'Ad Value',
    value: 'A definir',
    description:
      'Valorización publicitaria equivalente (AVE) generada a través de notas, entrevistas y menciones orgánicas.',
  },
  {
    metricKey: 'eventos',
    label: 'Cantidad de Eventos',
    value: 'A definir',
    description:
      'Lanzamientos, ruedas de prensa, desayunos con periodistas, Fam Press y activaciones de PR realizadas.',
  },
];

function getMetricIcon(metricKey?: string | null) {
  switch (metricKey) {
    case 'ad_value':
      return TrendingUp;
    case 'eventos':
      return CalendarCheck2;
    case 'alcance':
    default:
      return Radio;
  }
}

export default function PrMetricsSection({ data }: PrMetricsSectionProps = {}) {
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blancoHumo',
    theme: 'light',
    accentColor: 'azul',
    buttonColor: 'azul',
    badgeColor: 'verde',
  });

  const badge = data?.badge || 'Impacto de Relaciones Públicas (PR)';
  const title = data?.title || 'Métricas de PR en América Latina';
  const subtitle =
    data?.subtitle ||
    'Medimos el impacto real de cada acción de prensa, relaciones públicas y posicionamiento editorial en los mercados clave de LATAM.';

  const metrics =
    data?.metrics && data.metrics.length > 0 ? data.metrics : DEFAULT_PR_METRICS;

  return (
    <section
      id="metricas-pr"
      className={`py-20 md:py-24 relative overflow-hidden font-sans border-t border-gray-200/70 ${sectionAppearance.bgClass}`}
    >
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo Métricas de PR"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          {badge ? (
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${sectionAppearance.badgeClass}`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${sectionAppearance.badgeIconClass}`} />
              <span>{badge}</span>
            </div>
          ) : null}

          {title ? (
            <h2
              className={`font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight ${sectionAppearance.titleClass}`}
            >
              {title}
            </h2>
          ) : null}

          {subtitle ? (
            <p className={`text-base sm:text-lg leading-relaxed ${sectionAppearance.subtitleClass}`}>
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {metrics.map((metric, idx) => {
            const Icon = getMetricIcon(metric.metricKey);
            const isGreen = idx === 1;

            return (
              <div
                key={metric.id || `pr-metric-${idx}`}
                className={`rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${sectionAppearance.cardClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isGreen
                          ? 'bg-[#3cac59]/12 text-[#3cac59]'
                          : 'bg-[#1b87c7]/12 text-[#1b87c7]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#4d4e4f]/45">
                      PR · 0{idx + 1}
                    </span>
                  </div>

                  <div
                    className={`font-heading text-3xl sm:text-4xl font-black tracking-tight mb-2 ${
                      isGreen ? 'text-[#3cac59]' : 'text-[#1b87c7]'
                    }`}
                  >
                    {metric.value}
                  </div>

                  <h3
                    className={`font-heading text-xl font-bold mb-2.5 ${sectionAppearance.cardTitleClass}`}
                  >
                    {metric.label}
                  </h3>

                  {metric.description ? (
                    <p
                      className={`text-sm leading-relaxed ${sectionAppearance.cardSubtextClass}`}
                    >
                      {metric.description}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/servicios/relaciones-publicas"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1b87c7] hover:text-[#3cac59] transition-colors"
          >
            <span>Conocer nuestro servicio de Relaciones Públicas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
