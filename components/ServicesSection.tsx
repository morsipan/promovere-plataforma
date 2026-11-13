import {
  Globe,
  TrendingUp,
  Users,
  BarChart3,
  Calendar,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import { servicesContent } from '@/data/content';

// Handshake is not in lucide-react older versions, using a custom SVG
function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

const iconMap: Record<string, LucideIcon | React.FC<{ className?: string }>> = {
  Globe,
  TrendingUp,
  Users,
  Handshake: HandshakeIcon,
  BarChart3,
  Calendar,
};

const iconColors = [
  'bg-brand-50 text-brand-600',
  'bg-blue-50 text-blue-600',
  'bg-purple-50 text-purple-600',
  'bg-amber-50 text-amber-600',
  'bg-rose-50 text-rose-600',
  'bg-teal-50 text-teal-600',
];

export default function ServicesSection() {
  return (
    <section id="servicios" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-badge mb-4">{servicesContent.badge}</span>
          <h2 className="section-title mb-4">{servicesContent.title}</h2>
          <p className="section-subtitle">{servicesContent.subtitle}</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesContent.services.map((service, index) => {
            const Icon = iconMap[service.icon] || Globe;
            const colorClass = iconColors[index % iconColors.length];

            return (
              <div
                key={service.title}
                className="card p-8 group cursor-pointer hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorClass} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Learn More */}
                <div className="flex items-center gap-2 text-brand-600 text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Más información
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <a href="#contacto" className="btn-outline">
            Solicitar propuesta
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
