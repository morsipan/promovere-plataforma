import Image from 'next/image';
import {
  Briefcase,
  Megaphone,
  Users,
  GraduationCap,
  Compass,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Globe,
  Star,
  Building2,
  Plane,
  Handshake,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Heart,
  Phone,
  Tag,
  LucideIcon,
} from 'lucide-react';
import { servicesContent } from '@/data/content';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';
import { getMediaUrl } from '@/lib/media';

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Megaphone,
  Users,
  GraduationCap,
  Compass,
  Calendar,
  TrendingUp,
  Globe,
  Star,
  Building2,
  Plane,
  Handshake,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Heart,
  Phone,
  Tag,
};

interface ServiceItemCMS {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: string;
  image?: any;
  customIcon?: any;
  highlights?: Array<{ item: string } | string>;
}

interface ServicesSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    subtitle?: string;
    servicesList?: ServiceItemCMS[];
  };
}

export default function ServicesSection({ data }: ServicesSectionProps = {}) {
  // Resolución dinámica de apariencia no-code
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blancoHumo',
    theme: 'light',
    overlayOpacity: 'media',
  });

  const badge = data?.badge || servicesContent.badge;
  const title = data?.title || servicesContent.title;
  const subtitle = data?.subtitle || servicesContent.subtitle;
  const services =
    data?.servicesList && data.servicesList.length > 0
      ? data.servicesList
      : servicesContent.services;

  return (
    <section id="servicios" className={`py-20 md:py-28 relative overflow-hidden ${sectionAppearance.bgClass}`}>
      {/* Fondo de Imagen Opcional configurado en Apariencia */}
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo decorativo de servicios"
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
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${sectionAppearance.badgeClass}`}>
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const imageMedia = 'image' in service ? (service as ServiceItemCMS).image : undefined;
            const imageUrl = getMediaUrl(imageMedia, '');
            const customIcon = 'customIcon' in service ? (service as ServiceItemCMS).customIcon : undefined;
            const customIconUrl = getMediaUrl(customIcon, '');

            const hasIcon = Boolean(service.icon && service.icon !== 'none');
            const Icon = hasIcon ? iconMap[service.icon!] || null : null;

            const hasBrandingImage = Boolean(imageUrl);
            const hasVisual = hasBrandingImage || Boolean(customIconUrl) || Boolean(Icon);

            const highlights: string[] = Array.isArray(service.highlights)
              ? service.highlights
                  .map((h: any) => (typeof h === 'string' ? h : h?.item || ''))
                  .filter(Boolean)
              : [];

            return (
              <div
                key={service.id || `service-${index}`}
                className={`group relative rounded-2xl p-7 sm:p-8 border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${sectionAppearance.cardClass}`}
              >
                <div>
                  {/* Visual Header (Branding Image o Ícono) */}
                  {hasVisual ? (
                    <div className="flex items-center justify-between mb-6">
                      {hasBrandingImage ? (
                        <div className="relative h-14 sm:h-16 w-auto max-w-[160px] flex items-center">
                          <Image
                            src={imageUrl}
                            alt={service.title}
                            width={160}
                            height={64}
                            className="max-h-14 sm:max-h-16 w-auto object-contain object-left"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${sectionAppearance.accentIconBgClass}`}
                        >
                          {customIconUrl ? (
                            <div className="relative w-7 h-7">
                              <Image
                                src={customIconUrl}
                                alt={service.title}
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : Icon ? (
                            <Icon className="w-7 h-7" />
                          ) : null}
                        </div>
                      )}
                      <span className={`text-xs font-bold tracking-widest uppercase ${sectionAppearance.isDark ? 'text-white/40' : 'text-gray-300'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  ) : (
                    /* Si no se coloca ni imagen ni ícono, no ocupa ningún espacio vertical */
                    <span className={`absolute top-6 right-6 text-xs font-bold tracking-widest uppercase ${sectionAppearance.isDark ? 'text-white/40' : 'text-gray-300'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}

                  {/* Title & Subtitle */}
                  {service.subtitle ? (
                    <span
                      className={`text-xs font-bold tracking-wider uppercase mb-1.5 block ${sectionAppearance.accentTextClass}`}
                    >
                      {service.subtitle}
                    </span>
                  ) : null}
                  <h3 className={`text-xl font-bold mb-3 transition-colors ${sectionAppearance.cardTitleClass}`}>
                    {service.title}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-6 ${sectionAppearance.cardSubtextClass}`}>
                    {service.description}
                  </p>
                </div>

                {/* Highlights List */}
                {highlights.length > 0 ? (
                  <div className={`pt-4 border-t space-y-2 ${sectionAppearance.borderClass}`}>
                    {highlights.map((highlight, hIdx) => (
                      <div
                        key={`highlight-${hIdx}`}
                        className={`flex items-center gap-2 text-xs font-medium ${sectionAppearance.isDark ? 'text-white/90' : 'text-[#4d4e4f]/90'}`}
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 flex-shrink-0 ${sectionAppearance.accentTextClass}`}
                        />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
