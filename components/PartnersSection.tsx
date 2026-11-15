import { Handshake } from 'lucide-react';
import { partnersContent } from '@/data/content';

export default function PartnersSection() {
  return (
    <section id="partners" className="py-20 md:py-28 bg-[#f9f9f9] border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] border border-[#1b87c7]/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Handshake className="w-3.5 h-3.5" />
            {partnersContent.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4d4e4f] tracking-tight mb-4 leading-tight">
            {partnersContent.title}
          </h2>
          <p className="text-base sm:text-lg text-[#4d4e4f]/80 leading-relaxed font-normal">
            {partnersContent.subtitle}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {partnersContent.partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1b87c7]/10 to-[#3cac59]/10 text-[#1b87c7] font-black text-lg flex items-center justify-center border border-gray-100 group-hover:from-[#1b87c7] group-hover:to-[#3cac59] group-hover:text-white transition-all duration-300">
                    {partner.initials}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#f9f9f9] text-[#4d4e4f]/70 border border-gray-200">
                    {partner.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#4d4e4f] mb-2 group-hover:text-[#1b87c7] transition-colors">
                  {partner.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#4d4e4f]/80 leading-relaxed">
                  {partner.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#3cac59]">
                <span>Alianza Comercial Activa</span>
                <span className="w-2 h-2 rounded-full bg-[#3cac59]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
