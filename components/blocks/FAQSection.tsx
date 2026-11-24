'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: FAQItem[];
  };
}

export default function FAQSection({ data }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blancoHumo',
    theme: 'light',
  });

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
        'Operamos activamente en Argentina, Brasil, Chile, Uruguay, Paraguay, Bolivia, Perú, Colombia y México, cubriendo los principales mercados emisores de Sudamérica y Centroamérica.',
      category: 'cobertura',
    },
  ];

  const items = data?.items && data.items.length > 0 ? data.items : defaultItems;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className={`py-20 md:py-28 relative overflow-hidden ${sectionAppearance.bgClass}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo FAQ"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="text-center mb-16">
          {badge ? (
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${sectionAppearance.badgeClass}`}>
              <HelpCircle className={`w-3.5 h-3.5 ${sectionAppearance.badgeIconClass}`} />
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

        {/* Acordeón de FAQs */}
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${sectionAppearance.cardClass}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg transition-colors"
                >
                  <span className={sectionAppearance.cardTitleClass}>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 ${sectionAppearance.accentTextClass} transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className={`px-6 pb-6 pt-2 border-t text-sm sm:text-base leading-relaxed ${sectionAppearance.cardSubtextClass} ${sectionAppearance.borderClass}`}>
                    <p>{item.answer}</p>
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
