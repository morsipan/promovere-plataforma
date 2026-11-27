import Image from 'next/image';
import Link from 'next/link';
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
  ArrowRight,
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

const DEFAULT_SERVICE_LOGOS = [
  '/assets/SVG/servicio-reps.svg',
  '/assets/SVG/servicio-mkt.svg',
  '/assets/SVG/servicio-pr.svg',
  '/assets/SVG/servicio-events.svg',
  '/assets/SVG/servicio-trade.svg',
  '/assets/SVG/servicio-fams.svg',
];

function resolveServiceLogoFallback(title: string, index: number): string {
  const lower = (title || '').toLowerCase();
  if (lower.includes('rep')) return '/assets/SVG/servicio-reps.svg';
  if (lower.includes('marketing') || lower.includes('mkt')) return '/assets/SVG/servicio-mkt.svg';
  if (lower.includes('relaciones') || lower.includes('pr')) return '/assets/SVG/servicio-pr.svg';
  if (lower.includes('event') || lower.includes('growth')) return '/assets/SVG/servicio-events.svg';
  if (lower.includes('trade') || lower.includes('cap') || lower.includes('desarrollo')) {
    return '/assets/SVG/servicio-trade.svg';
  }
  if (lower.includes('fam')) return '/assets/SVG/servicio-fams.svg';
  return DEFAULT_SERVICE_LOGOS[index] || '';
}

function resolveServicePageHref(title: string, index: number): string | null {
  const lower = (title || '').toLowerCase();
  if (lower.includes('representacion') || lower.includes('rep')) {
    return '/servicios/representaciones-turisticas';
  }
  if (lower.includes('marketing') || lower.includes('mkt')) {
    return '/servicios/marketing-turistico';
  }
  if (lower.includes('relaciones') || lower.includes('pr')) {
    return '/servicios/relaciones-publicas';
  }
  if (index === 0) return '/servicios/representaciones-turisticas';
  if (index === 1) return '/servicios/marketing-turistico';
  if (index === 2) return '/servicios/relaciones-publicas';
  return null;
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
            const cmsImageUrl = getMediaUrl(imageMedia, '');
            const customIcon = 'customIcon' in service ? (service as ServiceItemCMS).customIcon : undefined;
            const customIconUrl = getMediaUrl(customIcon, '');
            const resolvedLogoUrl =
              cmsImageUrl || customIconUrl || resolveServiceLogoFallback(service.title, index);

            const hasIcon = Boolean(service.icon && service.icon !== 'none');
            const Icon = !resolvedLogoUrl && hasIcon ? iconMap[service.icon!] || null : null;

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
                  {/* Logo del servicio directamente sobre el título (sin caja ni numeración lateral) */}
                  {resolvedLogoUrl ? (
                    <div className="mb-4">
                      <img
                        src={resolvedLogoUrl}
                        alt={service.title}
                        className="h-14 sm:h-16 w-auto max-w-[200px] object-contain object-left block"
                        loading="lazy"
                      />
                    </div>
                  ) : Icon ? (
                    <div className="mb-4">
                      <Icon className={`w-8 h-8 ${sectionAppearance.accentTextClass}`} />
                    </div>
                  ) : null}

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

                {/* Enlace a página dedicada del servicio (cuando corresponde) */}
                {(() => {
                  const serviceHref = resolveServicePageHref(service.title, index);
                  if (!serviceHref) return null;
                  return (
                    <div className="mt-5 pt-3 border-t border-gray-100">
                      <Link
                        href={serviceHref}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1b87c7] hover:text-[#3cac59] transition-colors"
                      >
                        <span>Conocer más sobre este servicio</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
