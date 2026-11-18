import Image from 'next/image';
import { Handshake } from 'lucide-react';
import { partnersContent } from '@/data/content';
import { getMediaUrl } from '@/lib/media';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface PartnerItemCMS {
  name: string;
  logo?: unknown;
  logoUrl?: string;
  category?: string;
  description?: string;
  initials?: string;
}

interface PartnersSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    subtitle?: string;
    partnersList?: PartnerItemCMS[];
  };
}

export default function PartnersSection({ data }: PartnersSectionProps = {}) {
  // Resolución dinámica de apariencia no-code
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blancoHumo',
    theme: 'light',
    overlayOpacity: 'media',
  });

  const badge = data?.badge || partnersContent.badge;
  const title = data?.title || partnersContent.title;
  const subtitle = data?.subtitle || partnersContent.subtitle;
  const partners =
    data?.partnersList && data.partnersList.length > 0
      ? data.partnersList
      : partnersContent.partners;

  return (
    <section id="partners" className={`py-20 md:py-28 relative overflow-hidden border-t border-b ${sectionAppearance.bgClass} ${sectionAppearance.borderClass}`}>
      {/* Fondo de Imagen Opcional configurado en Apariencia */}
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo decorativo de aliados"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con contraste dinámico */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge ? (
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 font-sans ${sectionAppearance.badgeClass}`}>
              <Handshake className={`w-3.5 h-3.5 ${sectionAppearance.badgeIconClass}`} />
              {badge}
            </div>
          ) : null}
          {title ? (
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight ${sectionAppearance.titleClass}`}>
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className={`text-base sm:text-lg leading-relaxed font-normal ${sectionAppearance.subtitleClass}`}>
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {partners.map((partner, index) => {
            const candidateLogo = 'logo' in partner ? partner.logo : undefined;
            const fallbackLogoUrl = 'logoUrl' in partner ? (partner as any).logoUrl : undefined;
            const logoSrc = getMediaUrl(candidateLogo, fallbackLogoUrl || '');

            const fallbackInitials =
              partner.initials ||
              partner.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

            return (
              <div
                key={partner.name || `partner-${index}`}
                className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${sectionAppearance.cardClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Logo o Avatar con Iniciales */}
                    {logoSrc ? (
                      <div className="relative w-20 h-12 flex items-center justify-center p-1 rounded-lg bg-white/90 border border-gray-100 overflow-hidden shadow-xs">
                        <img
                          src={logoSrc}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1b87c7]/10 to-[#3cac59]/10 text-[#1b87c7] font-black text-lg flex items-center justify-center border border-gray-100 group-hover:from-[#1b87c7] group-hover:to-[#3cac59] group-hover:text-white transition-all duration-300 font-heading">
                        {fallbackInitials}
                      </div>
                    )}

                    {partner.category ? (
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border font-sans ${
                        sectionAppearance.isDark
                          ? 'bg-white/10 text-white/90 border-white/20'
                          : 'bg-[#f9f9f9] text-[#4d4e4f]/70 border-gray-200'
                      }`}>
                        {partner.category}
                      </span>
                    ) : null}
                  </div>

                  <h3 className={`text-lg font-bold mb-2 group-hover:text-[#1b87c7] transition-colors ${sectionAppearance.cardTitleClass}`}>
                    {partner.name}
                  </h3>
                  {partner.description ? (
                    <p className={`text-xs sm:text-sm leading-relaxed ${sectionAppearance.cardSubtextClass}`}>
                      {partner.description}
                    </p>
                  ) : null}
                </div>

                <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs font-semibold text-[#3cac59] font-sans ${sectionAppearance.borderClass}`}>
                  <span>Alianza Comercial Activa</span>
                  <span className="w-2 h-2 rounded-full bg-[#3cac59]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
