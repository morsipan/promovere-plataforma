import { FileText } from 'lucide-react';

interface RichTextSectionProps {
  data?: {
    badge?: string;
    title?: string;
    content?: any;
    alignment?: 'left' | 'center';
  };
}

export default function RichTextSection({ data }: RichTextSectionProps) {
  const badge = data?.badge || 'Comunicado Institucional';
  const title =
    data?.title || 'Nuestra visión y compromiso con el trade turístico';
  const isCentered = data?.alignment === 'center';

  return (
    <section className="py-20 md:py-28 bg-[#f9f9f9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`bg-white rounded-3xl p-8 sm:p-14 border border-gray-200/80 shadow-xs ${
            isCentered ? 'text-center' : 'text-left'
          }`}
        >
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] border border-[#1b87c7]/20 text-xs font-bold uppercase tracking-wider mb-6 ${
              isCentered ? 'mx-auto' : ''
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#3cac59]" />
            {badge}
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-black text-[#4d4e4f] tracking-tight mb-8 leading-tight">
            {title}
          </h2>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-[#4d4e4f]/85 space-y-5 leading-relaxed">
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
