import Image from 'next/image';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface CtaBannerSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    description?: string;
    primaryButtonLabel?: string;
    primaryButtonHref?: string;
    secondaryButtonLabel?: string;
    secondaryButtonHref?: string;
    backgroundImage?: unknown;
  };
}

export default function CtaBannerSection({ data }: CtaBannerSectionProps) {
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'azul',
    theme: 'dark',
  });

  const badge = data?.badge || 'Expande tu Presencia en LATAM';
  const title =
    data?.title || '¿Listo para acelerar tus ventas turísticas en la región?';
  const description =
    data?.description ||
    'Conectamos tu marca hotelera o destino con más de 500 operadores mayoristas y miles de agencias minoristas en Argentina, Brasil, Chile, Colombia, México y toda la región.';
  const primaryButtonLabel =
    data?.primaryButtonLabel || 'Agendar Reunión Comercial';
  const primaryButtonHref = data?.primaryButtonHref || '#contacto';
  const secondaryButtonLabel =
    data?.secondaryButtonLabel || 'Ingresar a la Comunidad';
  const secondaryButtonHref =
    data?.secondaryButtonHref || '/comunidad/login';

  return (
    <section className="py-16 md:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative overflow-hidden rounded-3xl ${sectionAppearance.bgClass} p-8 sm:p-14 lg:p-20 shadow-2xl transition-all duration-300`}
        >
          {sectionAppearance.backgroundImageUrl ? (
            <div className="absolute inset-0 z-0">
              <Image
                src={sectionAppearance.backgroundImageUrl}
                alt="Fondo CTA"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
            </div>
          ) : (
            <>
              {/* Decorative gradients */}
              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#1b87c7]/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#3cac59]/30 blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative z-10 max-w-3xl">
            {/* Badge */}
            {badge ? (
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-6 ${sectionAppearance.badgeClass}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#3cac59]" />
                {badge}
              </div>
            ) : null}

            {/* Title */}
            {title ? (
              <h2
                className={`text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight ${sectionAppearance.titleClass}`}
              >
                {title}
              </h2>
            ) : null}

            {/* Description */}
            {description ? (
              <p
                className={`text-base sm:text-lg leading-relaxed mb-10 font-normal ${sectionAppearance.subtitleClass}`}
              >
                {description}
              </p>
            ) : null}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={primaryButtonHref}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#1b87c7] text-white font-bold text-sm hover:bg-[#1571a8] active:bg-[#0f5b89] transition-all shadow-lg shadow-[#1b87c7]/30 hover:-translate-y-0.5"
              >
                <Compass className="w-4 h-4" />
                {primaryButtonLabel}
                <ArrowRight className="w-4 h-4" />
              </a>

              {secondaryButtonLabel ? (
                <a
                  href={secondaryButtonHref}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/25 backdrop-blur-sm transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-[#3cac59]" />
                  {secondaryButtonLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
