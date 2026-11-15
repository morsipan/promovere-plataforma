import {
  Plane,
  Ship,
  Globe,
  Mountain,
  Users,
  Award,
  LucideIcon,
} from 'lucide-react';
import { partnersContent } from '@/data/content';

const iconMap: Record<string, LucideIcon> = {
  Plane,
  Ship,
  Globe,
  Mountain,
  Users,
  Award,
};

export default function PartnersSection() {
  return (
    <section id="socios" className="py-24 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-badge mb-4">{partnersContent.badge}</span>
          <h2 className="section-title mb-4">{partnersContent.title}</h2>
          <p className="section-subtitle">{partnersContent.subtitle}</p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partnersContent.partners.map((partner) => {
            const Icon = iconMap[partner.icon] || Globe;
            return (
              <div
                key={partner.name}
                className="card p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-600 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-brand-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1">{partner.name}</h3>
                <p className="text-gray-400 text-xs leading-tight">{partner.description}</p>
              </div>
            );
          })}
        </div>

        {/* Trust bar */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="text-4xl font-black text-brand-600 mb-1">AAA+</div>
              <div className="text-sm text-gray-500">Calificación de socios estratégicos</div>
            </div>
            <div className="text-center border-y md:border-y-0 md:border-x border-gray-100 py-6 md:py-0 md:px-8">
              <div className="text-4xl font-black text-brand-600 mb-1">100%</div>
              <div className="text-sm text-gray-500">Comprometidos con la excelencia turística</div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-4xl font-black text-brand-600 mb-1">24/7</div>
              <div className="text-sm text-gray-500">Soporte y atención a clientes y socios</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
