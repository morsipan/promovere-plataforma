import Image from 'next/image';
import { FileText } from 'lucide-react';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface RichTextSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    content?: any;
    alignment?: 'left' | 'center';
  };
}

export default function RichTextSection({ data }: RichTextSectionProps) {
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blanco',
    theme: 'light',
  });

  const badge = data?.badge || 'Comunicado Institucional';
  const title =
    data?.title || 'Nuestra visión y compromiso con el trade turístico';
  const isCentered = data?.alignment === 'center';

  return (
    <section className={`py-20 md:py-28 relative overflow-hidden ${sectionAppearance.bgClass}`}>
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo Contenido"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-3xl p-8 sm:p-14 border transition-all duration-300 ${
            sectionAppearance.cardClass
          } ${isCentered ? 'text-center' : 'text-left'}`}
        >
          {/* Badge */}
          {badge ? (
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-6 ${
                sectionAppearance.badgeClass
              } ${isCentered ? 'mx-auto' : ''}`}
            >
              <FileText className="w-3.5 h-3.5 text-[#3cac59]" />
              {badge}
            </div>
          ) : null}

          {/* Title */}
          {title ? (
            <h2
              className={`text-3xl sm:text-4xl font-black tracking-tight mb-8 leading-tight ${sectionAppearance.titleClass}`}
            >
              {title}
            </h2>
          ) : null}

          {/* Content */}
          <div className={`prose prose-lg max-w-none space-y-5 leading-relaxed ${sectionAppearance.bodyClass}`}>
            <p>
              En <strong>Promovêre</strong> creemos que la promoción turística de excelencia se construye a través de relaciones genuinas, conocimiento profundo del producto y una presencia comercial constante junto a los tomadores de decisiones de la industria en Latinoamérica.
            </p>
            <p>
              Nuestro compromiso es brindar a cada destino y cadena hotelera representada una plataforma 360° que combina marketing estratégico, capacitación continua y una distribución ágil a través de operadores mayoristas y agencias de viajes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
