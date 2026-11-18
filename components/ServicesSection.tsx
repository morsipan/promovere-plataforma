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
            const customIcon = 'customIcon' in service ? (service as ServiceItemCMS).customIcon : undefined;
            const customIconUrl = getMediaUrl(customIcon, '');
            const hasIcon = service.icon !== 'none' || Boolean(customIconUrl);
            const Icon = service.icon && service.icon !== 'none' ? iconMap[service.icon] || Briefcase : null;
            const isAccentExplicit = Boolean(data?.appearance?.accentColor);
            const isGreenAccent = isAccentExplicit
              ? data?.appearance?.accentColor === 'verde'
              : index % 2 === 1;

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
                  {/* Icon Header */}
                  <div className={`flex items-center ${hasIcon ? 'justify-between' : 'justify-end'} mb-6`}>
                    {hasIcon && (
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                          isGreenAccent
                            ? 'bg-[#3cac59]/10 text-[#3cac59] group-hover:bg-[#3cac59] group-hover:text-white'
                            : 'bg-[#1b87c7]/10 text-[#1b87c7] group-hover:bg-[#1b87c7] group-hover:text-white'
                        }`}
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

                  {/* Title & Subtitle */}
                  {service.subtitle ? (
                    <span
                      className={`text-xs font-bold tracking-wider uppercase mb-1.5 block ${
                        isGreenAccent ? 'text-[#3cac59]' : 'text-[#1b87c7]'
                      }`}
                    >
                      {service.subtitle}
                    </span>
                  ) : null}
                  <h3 className={`text-xl font-bold mb-3 group-hover:text-[#1b87c7] transition-colors ${sectionAppearance.cardTitleClass}`}>
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
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            isGreenAccent ? 'text-[#3cac59]' : 'text-[#1b87c7]'
                          }`}
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
