import { ArrowRight, Sparkles, Compass } from 'lucide-react';

interface CtaBannerSectionProps {
  data?: {
    badge?: string;
    title?: string;
    description?: string;
    primaryButtonLabel?: string;
    primaryButtonHref?: string;
    secondaryButtonLabel?: string;
    secondaryButtonHref?: string;
    backgroundImage?: string;
  };
}

export default function CtaBannerSection({ data }: CtaBannerSectionProps) {
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
    <section className="py-16 md:py-24 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4d4e4f] via-[#2c2d2e] to-[#113d5b] text-white p-8 sm:p-14 lg:p-20 shadow-2xl">
          {/* Decorative gradients */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#1b87c7]/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#3cac59]/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#3cac59] text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {badge}
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
              {title}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-10 font-normal">
              {description}
            </p>

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

              {secondaryButtonLabel && (
                <a
                  href={secondaryButtonHref}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/25 backdrop-blur-sm transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-[#3cac59]" />
                  {secondaryButtonLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
