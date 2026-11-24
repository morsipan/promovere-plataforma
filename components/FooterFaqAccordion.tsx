'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FooterFaqItem {
  id?: string | null;
  question: string;
  answer: string;
}

interface FooterFaqAccordionProps {
  items: FooterFaqItem[];
}

/**
 * Acordeón simple de un solo nivel para las Preguntas Frecuentes en el Footer.
 * Accesible por teclado y semántico para AEO (sin acordeones anidados ni rutas externas).
 */
export default function FooterFaqAccordion({ items }: FooterFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `footer-faq-panel-${idx}`;
        const buttonId = `footer-faq-trigger-${idx}`;

        return (
          <div
            key={item.id || `footer-faq-${idx}`}
            className="rounded-2xl border border-white/10 bg-white/[0.04] hover:border-[#1b87c7]/50 transition-colors overflow-hidden"
          >
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left cursor-pointer px-5 py-4 flex items-center justify-between gap-3"
              >
                <span className="font-heading text-sm sm:text-base font-bold text-white leading-snug">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#3cac59] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </h3>

            {isOpen ? (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-5 pb-4 pt-2 border-t border-white/10"
              >
                <p className="text-xs sm:text-sm text-[#f9f9f9]/85 leading-relaxed font-sans">
                  {item.answer}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
