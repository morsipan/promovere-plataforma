'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: FAQItem[];
  };
}

export default function FAQSection({ data }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const badge = data?.badge || 'Preguntas Frecuentes';
  const title = data?.title || 'Resolvemos tus dudas sobre nuestra operativa';
  const subtitle =
    data?.subtitle ||
    'Respuestas claras para cadenas hoteleras, destinos, operadores mayoristas y agencias de viajes.';

  const defaultItems: FAQItem[] = [
    {
      question: '¿Qué tipo de marcas y destinos representa Promovêre?',
      answer:
        'Representamos cadenas hoteleras all-inclusive, hoteles boutique, resorts de lujo, oficinas de turismo de destinos internacionales, aerolíneas regionales y empresas de experiencias turísticas.',
      category: 'representaciones',
    },
    {
      question: '¿Cómo beneficia a una agencia de viajes la Comunidad Promovêre?',
      answer:
        'Las agencias acceden a material de marketing listo para usar, capacitaciones exclusivas en webinars, fichas técnicas de producto y contacto comercial directo para resolver cotizaciones complejas sin fricción.',
      category: 'trade',
    },
    {
      question: '¿Promovêre vende directo al pasajero final?',
      answer:
        'No. Nuestro modelo es 100% B2B enfocado en el canal comercial (Trade). Respetamos la cadena de distribución turística trabajando junto a operadores mayoristas y agencias minoristas.',
      category: 'general',
    },
    {
      question: '¿En qué países de LATAM tiene presencia y alcance comercial?',
      answer:
        'Operamos activamente en Argentina, Brasil, Chile, Colombia, México, Uruguay, Paraguay, Perú y Bolivia a través de acciones presenciales, roadshows, ferias y plataformas digitales.',
      category: 'general',
    },
  ];

  const items = data?.items && data.items.length > 0 ? data.items : defaultItems;

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#f9f9f9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] border border-[#1b87c7]/20 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#3cac59]" />
            {badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4d4e4f] tracking-tight mb-4 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base sm:text-lg text-[#4d4e4f]/80 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-hidden"
                >
                  <span className="text-base sm:text-lg font-bold text-[#4d4e4f] pr-4">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-[#1b87c7] text-white rotate-180' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#4d4e4f]/80 leading-relaxed border-t border-gray-100">
                    <p className="pt-3">{item.answer}</p>
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
