import Link from 'next/link';
import { MessageCircle, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react';

interface WhatsAppBannerProps {
  data?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    phone?: string;
  };
}

export default function WhatsAppBanner({ data }: WhatsAppBannerProps = {}) {
  const title = data?.title || '¡Sumate a nuestra Comunidad de WhatsApp!';
  const subtitle =
    data?.subtitle ||
    'Recibí al instante en tu celular alertas exclusivas de cupos, promociones de último momento, invitaciones a webinars y novedades de destinos de toda América Latina.';
  const ctaText = data?.ctaText || 'Unirme a la Comunidad de WhatsApp';
  const phone = data?.phone || '5491145876932';

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    'Hola equipo Promovêre, deseo unirme al canal oficial de WhatsApp para agencias y operadores de la Comunidad Promovêre.'
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#25D366] via-[#27ae60] to-[#128C7E] text-white py-16 sm:py-20">
      {/* Decorative Blur Circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-black/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna Izquierda: Información y CTA (8 cols) */}
          <div className="lg:col-span-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Canal Directo de Comunicación B2B</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight font-heading">
              {title}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 font-light">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#128C7E] font-black text-sm sm:text-base hover:bg-slate-50 transition-all duration-200 shadow-xl shadow-black/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]" />
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#128C7E]" />
              </a>

              <Link
                href="/comunidad/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-bold text-sm border border-white/25 backdrop-blur-sm transition-all"
              >
                <span>Acceder al Portal Web</span>
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Mockup Visual del Teléfono (4 cols) */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-64 sm:w-72 rounded-3xl bg-slate-900 p-3 shadow-2xl border-4 border-white/20">
              {/* Pantalla del teléfono */}
              <div className="rounded-2xl bg-[#0b141a] p-3 text-white text-xs space-y-2.5 overflow-hidden">
                {/* Header del chat */}
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center font-black text-white text-xs">
                    P
                  </div>
                  <div>
                    <h5 className="font-bold text-[11px] text-white leading-tight">
                      Promovêre Comunidad Trade
                    </h5>
                    <span className="text-[9px] text-[#25D366] block">Canal Oficial Verificado</span>
                  </div>
                </div>

                {/* Burbujas de chat simuladas */}
                <div className="p-2.5 rounded-xl bg-[#1f2c34] text-[10px] text-slate-200 space-y-1 shadow-xs">
                  <span className="text-[9px] font-bold text-[#25D366] block">Promovêre Alert:</span>
                  <p>🚨 ¡Últimos 3 cupos para el Fam Tour Riviera Maya 2026!</p>
                  <span className="text-[8px] text-slate-400 block text-right">10:45 AM</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#005c4b] text-[10px] text-white space-y-1 shadow-xs ml-4">
                  <p>¿Dónde descargo la ficha técnica de Gaviota Hoteles?</p>
                  <span className="text-[8px] text-emerald-200 block text-right">10:47 AM</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1f2c34] text-[10px] text-slate-200 space-y-1 shadow-xs">
                  <p>✅ Ya está disponible en tu dashboard privado de la Comunidad con manuales descargables.</p>
                  <span className="text-[8px] text-slate-400 block text-right">10:48 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
