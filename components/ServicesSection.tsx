import {
  Briefcase,
  Megaphone,
  Users,
  GraduationCap,
  Compass,
  Calendar,
  CheckCircle2,
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
};

export default function ServicesSection() {
  return (
    <section id="servicios" className="py-20 md:py-28 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] border border-[#1b87c7]/20 text-xs font-bold uppercase tracking-wider mb-4">
            {servicesContent.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4d4e4f] tracking-tight mb-4 leading-tight">
            {servicesContent.title}
          </h2>
          <p className="text-base sm:text-lg text-[#4d4e4f]/80 leading-relaxed font-normal">
            {servicesContent.subtitle}
          </p>
        </div>

        {/* Services Grid (6 Servicios Oficiales) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicesContent.services.map((service, index) => {
            const Icon = iconMap[service.icon] || Briefcase;
            const isGreenAccent = index % 2 === 1;

            return (
              <div
                key={service.id}
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
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <span
                    className={`text-xs font-bold tracking-wider uppercase mb-1.5 block ${
                      isGreenAccent ? 'text-[#3cac59]' : 'text-[#1b87c7]'
                    }`}
                  >
                    {service.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-[#4d4e4f] mb-3 group-hover:text-[#1b87c7] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#4d4e4f]/80 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {service.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 text-xs font-medium text-[#4d4e4f]/90">
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isGreenAccent ? 'text-[#3cac59]' : 'text-[#1b87c7]'}`} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
