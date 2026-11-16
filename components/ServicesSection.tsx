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
  LucideIcon,
} from 'lucide-react';
import { servicesContent } from '@/data/content';

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
};

interface ServiceItemCMS {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: string;
  highlights?: Array<{ item: string } | string>;
}

interface ServicesSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    servicesList?: ServiceItemCMS[];
  };
}

export default function ServicesSection({ data }: ServicesSectionProps = {}) {
  const badge = data?.badge || servicesContent.badge;
  const title = data?.title || servicesContent.title;
  const subtitle = data?.subtitle || servicesContent.subtitle;
  const services =
    data?.servicesList && data.servicesList.length > 0
      ? data.servicesList
      : servicesContent.services;

  return (
    <section id="servicios" className="py-20 md:py-28 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] border border-[#1b87c7]/20 text-xs font-bold uppercase tracking-wider mb-4">
            {badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4d4e4f] tracking-tight mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-[#4d4e4f]/80 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = (service.icon && iconMap[service.icon]) || Briefcase;
            const isGreenAccent = index % 2 === 1;

            const highlights: string[] = Array.isArray(service.highlights)
              ? service.highlights
                  .map((h: any) => (typeof h === 'string' ? h : h?.item || ''))
                  .filter(Boolean)
              : [];

            return (
              <div
                key={service.id || `service-${index}`}
                className="group relative bg-white rounded-2xl p-7 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isGreenAccent
                          ? 'bg-[#3cac59]/10 text-[#3cac59] group-hover:bg-[#3cac59] group-hover:text-white'
                          : 'bg-[#1b87c7]/10 text-[#1b87c7] group-hover:bg-[#1b87c7] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  {service.subtitle && (
                    <span
                      className={`text-xs font-bold tracking-wider uppercase mb-1.5 block ${
                        isGreenAccent ? 'text-[#3cac59]' : 'text-[#1b87c7]'
                      }`}
                    >
                      {service.subtitle}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-[#4d4e4f] mb-3 group-hover:text-[#1b87c7] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#4d4e4f]/80 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Highlights List */}
                {highlights.length > 0 && (
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    {highlights.map((highlight, hIdx) => (
                      <div
                        key={`highlight-${hIdx}`}
                        className="flex items-center gap-2 text-xs font-medium text-[#4d4e4f]/90"
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
