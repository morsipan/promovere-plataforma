'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

export interface AnimCounterItem {
  topText: string;
  prefix?: string;
  countValue: number;
  suffix?: string;
  bottomText: string;
  // Colores
  topTextColor?: 'azul' | 'verde' | 'antracita' | 'gris' | 'blanco';
  counterColor?: 'antracita' | 'azul' | 'verde' | 'degrade' | 'blanco';
  bottomTextColor?: 'gris' | 'antracita' | 'azul' | 'verde' | 'blanco';
  cardBg?: 'blanco' | 'blancoHumo' | 'oscuro' | 'glass';
  cardBorderAccent?: 'azul' | 'verde' | 'gris';
  // Fuentes
  topTextFont?: 'sans-bold' | 'sans-medium' | 'mono' | 'serif';
  counterFont?: 'sans-black' | 'sans-bold' | 'mono' | 'serif';
  bottomTextFont?: 'sans-normal' | 'sans-medium' | 'sans-bold' | 'mono';
  // Animación
  entryAnimation?: 'fade-up' | 'scale-up' | 'fade-in' | 'bounce';
  counterSpeed?: string;
}

export interface PromovereAnimCounterProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: AnimCounterItem[];
  };
}

// Mapas de utilidades visuales
const colorMap = {
  azul: 'text-[#1b87c7]',
  verde: 'text-[#3cac59]',
  antracita: 'text-[#4d4e4f]',
  gris: 'text-[#7b7d80]',
  blanco: 'text-white',
  degrade: 'text-transparent bg-clip-text bg-gradient-to-r from-[#1b87c7] to-[#3cac59]',
};

const bgMap = {
  blanco: 'bg-white border-gray-200/80 shadow-xs hover:shadow-xl',
  blancoHumo: 'bg-[#f9f9f9] border-gray-200/80 shadow-xs hover:shadow-xl',
  oscuro: 'bg-[#4d4e4f] text-white border-white/10 shadow-lg hover:shadow-2xl',
  glass: 'bg-white/80 backdrop-blur-md border-white/60 shadow-md hover:shadow-xl',
};

const borderHoverMap = {
  azul: 'hover:border-[#1b87c7]/50',
  verde: 'hover:border-[#3cac59]/50',
  gris: 'hover:border-gray-400',
};

const fontMap = {
  'sans-normal': 'font-sans font-normal',
  'sans-medium': 'font-sans font-medium',
  'sans-bold': 'font-sans font-bold',
  'sans-black': 'font-sans font-black tracking-tight',
  mono: 'font-mono tracking-wider',
  serif: 'font-serif',
};

const animationClassMap = {
  'fade-up': 'transition-all duration-700 transform translate-y-0 opacity-100',
  'scale-up': 'transition-all duration-500 transform scale-100 opacity-100',
  'fade-in': 'transition-opacity duration-700 opacity-100',
  bounce: 'transition-all duration-700 transform translate-y-0 opacity-100',
};

const animationInitialClassMap = {
  'fade-up': 'translate-y-8 opacity-0',
  'scale-up': 'scale-90 opacity-0',
  'fade-in': 'opacity-0',
  bounce: '-translate-y-4 opacity-0',
};

// Componente individual de conteo animado
function SingleCounterItem({ item, index }: { item: AnimCounterItem; index: number }) {
  const [displayedValue, setDisplayedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const targetValue = Number(item.countValue) || 0;
  const hasDecimals = targetValue % 1 !== 0;
  const duration = parseInt(item.counterSpeed || '2000', 10);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing cúbico hacia el final (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * targetValue;

      setDisplayedValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayedValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, targetValue, duration]);

  const topColorClass = colorMap[item.topTextColor || 'azul'];
  const counterColorClass = colorMap[item.counterColor || 'antracita'];
  const bottomColorClass = colorMap[item.bottomTextColor || 'gris'];
  const bgClass = bgMap[item.cardBg || 'blanco'];
  const borderHoverClass = borderHoverMap[item.cardBorderAccent || 'azul'];

  const topFontClass = fontMap[item.topTextFont || 'sans-bold'];
  const counterFontClass = fontMap[item.counterFont || 'sans-black'];
  const bottomFontClass = fontMap[item.bottomTextFont || 'sans-normal'];

  const animType = item.entryAnimation || 'fade-up';
  const animClass = isVisible
    ? animationClassMap[animType]
    : animationInitialClassMap[animType];

  const formattedValue = hasDecimals
    ? displayedValue.toFixed(1)
    : Math.floor(displayedValue).toLocaleString('es-AR');

  return (
    <div
      ref={itemRef}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`rounded-3xl p-6 sm:p-7 border flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 text-center group ${bgClass} ${borderHoverClass} ${animClass}`}
    >
      <div>
        {/* Texto Superior (Facto) */}
        <div
          className={`text-xs uppercase tracking-widest mb-3.5 ${topFontClass} ${topColorClass}`}
        >
          {item.topText}
        </div>

        {/* Contador Central (Prefix + Number + Suffix) */}
        <div
          className={`text-3xl sm:text-4xl lg:text-5xl my-2 leading-none flex items-baseline justify-center gap-1 ${counterFontClass} ${counterColorClass}`}
        >
          {item.prefix && (
            <span className="text-xl sm:text-2xl font-bold opacity-80">
              {item.prefix}
            </span>
          )}
          <span>{formattedValue}</span>
          {item.suffix && (
            <span className="text-xl sm:text-2xl font-bold opacity-80">
              {item.suffix}
            </span>
          )}
        </div>
      </div>

      {/* Texto Inferior */}
      <div
        className={`text-xs sm:text-sm mt-3 pt-3 border-t border-gray-100/60 leading-snug ${bottomFontClass} ${bottomColorClass}`}
      >
        {item.bottomText}
      </div>
    </div>
  );
}

// Sección Principal
export default function PromovereAnimCounterSection({ data }: PromovereAnimCounterProps) {
  const badge = data?.badge || 'Métricas & Resultados';
  const title = data?.title || 'Impacto Comercial en Cifras Reales';
  const subtitle =
    data?.subtitle ||
    'Indicadores de rendimiento, volumen trade y alcance operativo en los mercados turísticos de América Latina.';

  const defaultItems: AnimCounterItem[] = [
    {
      topText: 'Logramos',
      prefix: '+',
      countValue: 500,
      suffix: '',
      bottomText: 'Operadores mayoristas activos en nuestra red',
      topTextColor: 'azul',
      counterColor: 'antracita',
      bottomTextColor: 'gris',
      cardBg: 'blanco',
      cardBorderAccent: 'azul',
      topTextFont: 'sans-bold',
      counterFont: 'sans-black',
      bottomTextFont: 'sans-normal',
      entryAnimation: 'fade-up',
      counterSpeed: '2000',
    },
    {
      topText: 'Tenemos',
      prefix: '',
      countValue: 10,
      suffix: '+',
      bottomText: 'Países con presencia comercial continua en LATAM',
      topTextColor: 'verde',
      counterColor: 'verde',
      bottomTextColor: 'gris',
      cardBg: 'blanco',
      cardBorderAccent: 'verde',
      topTextFont: 'sans-bold',
      counterFont: 'sans-black',
      bottomTextFont: 'sans-normal',
      entryAnimation: 'fade-up',
      counterSpeed: '2000',
    },
    {
      topText: 'Alcanzamos',
      prefix: '+',
      countValue: 15,
      suffix: 'K',
      bottomText: 'Agentes de viajes capacitados en la región',
      topTextColor: 'azul',
      counterColor: 'azul',
      bottomTextColor: 'gris',
      cardBg: 'blanco',
      cardBorderAccent: 'azul',
      topTextFont: 'sans-bold',
      counterFont: 'sans-black',
      bottomTextFont: 'sans-normal',
      entryAnimation: 'scale-up',
      counterSpeed: '2000',
    },
    {
      topText: 'Evitamos',
      prefix: '',
      countValue: 99.8,
      suffix: '%',
      bottomText: 'De fricciones y demoras operativas en reservas',
      topTextColor: 'verde',
      counterColor: 'degrade',
      bottomTextColor: 'gris',
      cardBg: 'blanco',
      cardBorderAccent: 'verde',
      topTextFont: 'sans-bold',
      counterFont: 'sans-black',
      bottomTextFont: 'sans-normal',
      entryAnimation: 'fade-up',
      counterSpeed: '2000',
    },
    {
      topText: 'Garantizamos',
      prefix: '',
      countValue: 100,
      suffix: '%',
      bottomText: 'Enfoque B2B transparente y lealtad con el canal',
      topTextColor: 'azul',
      counterColor: 'antracita',
      bottomTextColor: 'gris',
      cardBg: 'blanco',
      cardBorderAccent: 'azul',
      topTextFont: 'sans-bold',
      counterFont: 'sans-black',
      bottomTextFont: 'sans-normal',
      entryAnimation: 'scale-up',
      counterSpeed: '2000',
    },
  ];

  const items = data?.items && data.items.length > 0 ? data.items : defaultItems;
  const count = items.length;

  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blancoHumo',
    theme: 'light',
  });

  // Clases dinámicas de columnas para desktop (hasta 5 en línea)
  const gridColsClass =
    count === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : count === 2
      ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
      : count === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
      : count === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';

  return (
    <section id="contadores" className={`py-20 md:py-28 relative overflow-hidden ${sectionAppearance.bgClass}`}>
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo Contadores"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de Sección */}
        {badge || title || subtitle ? (
          <div className="text-center max-w-3xl mx-auto mb-16">
            {badge ? (
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${sectionAppearance.badgeClass}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#3cac59]" />
                {badge}
              </div>
            ) : null}
            {title ? (
              <h2
                className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight ${sectionAppearance.titleClass}`}
              >
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p
                className={`text-base sm:text-lg leading-relaxed font-normal ${sectionAppearance.subtitleClass}`}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Layout Responsive: hasta 5 elementos en línea en Desktop */}
        <div className={`grid gap-5 lg:gap-6 ${gridColsClass}`}>
          {items.map((item, index) => (
            <SingleCounterItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
