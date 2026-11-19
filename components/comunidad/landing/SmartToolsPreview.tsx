import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Send,
  Lock,
  ArrowRight,
  Compass,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Zap,
} from 'lucide-react';
import { resolveAppearance, type AppearanceData } from '@/lib/appearance';

interface SmartToolsPreviewProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    appearance?: AppearanceData;
  };
}

export default function SmartToolsPreview({ data }: SmartToolsPreviewProps = {}) {
  const badge = data?.badge || 'Inteligencia Artificial Trade';
  const title = data?.title || 'Herramientas Inteligentes para Vender Más Rápido';
  const subtitle =
    data?.subtitle ||
    'Tecnología desarrollada a medida para agencias de viajes. Armá propuestas comerciales completas día por día en cuestión de segundos.';
  const app = resolveAppearance(data?.appearance, {
    backgroundColor: 'blancoHumo',
    theme: 'light',
    accentColor: 'azul',
    buttonColor: 'verde',
    badgeColor: 'verde',
  });

  return (
    <section className={`relative py-20 md:py-28 ${app.bgClass} border-b ${app.borderClass} overflow-hidden`}>
      {app.backgroundImageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${app.backgroundImageUrl})` }}
          />
          <div className={`absolute inset-0 ${app.overlayClass}`} />
        </>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${app.badgeClass}`}>
            <Zap className={`w-3.5 h-3.5 ${app.badgeIconClass}`} />
            {badge}
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight ${app.titleClass}`}>
            {title}
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed font-normal ${app.subtitleClass}`}>
            {subtitle}
          </p>
        </div>

        {/* Mockup Interactivo de la IA con Fam Tour & Banner Superpuesto */}
        <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            {/* Lado Izquierdo: Mockup del Chat / Armador de Itinerarios (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between bg-slate-50/50">
              <div>
                {/* Header del Mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] text-white flex items-center justify-center shadow-md">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#4d4e4f] flex items-center gap-1.5">
                        <span>Asistente de Itinerarios IA</span>
                        <span className="w-2 h-2 rounded-full bg-[#3cac59]" />
                      </h4>
                      <span className="text-[11px] text-slate-400">Promovêre Smart Agent</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1b87c7]/10 text-[#1b87c7]">
                    BETA PRIVADA
                  </span>
                </div>

                {/* Mensajes del Chat y Parámetros */}
                <div className="space-y-4">
                  {/* Consulta del Agente */}
                  <div className="flex justify-end">
                    <div className="max-w-md p-3.5 rounded-2xl rounded-tr-xs bg-[#1b87c7] text-white text-xs sm:text-sm font-medium leading-relaxed shadow-sm">
                      "Necesito un itinerario para luna de miel de 10 noches en Grecia (Atenas + Santorini + Mykonos) con excursión al atardecer."
                    </div>
                  </div>

                  {/* Respuesta del Bot */}
                  <div className="flex justify-start">
                    <div className="max-w-lg p-4 rounded-2xl rounded-tl-xs bg-white border border-slate-200 text-xs text-slate-700 space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between font-bold text-[#4d4e4f]">
                        <span className="flex items-center gap-1.5 text-[#3cac59]">
                          <Sparkles className="w-3.5 h-3.5" />
                          Propuesta Sugerida (10 Noches / 11 Días):
                        </span>
                        <span className="text-[10px] text-slate-400">Generado en 2.4s</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-600 pl-1 border-l-2 border-[#1b87c7]/30">
                        <p><strong>Días 1-3: Atenas</strong> — Hotel Boutique Plaka + Tour Acrópolis al amanecer.</p>
                        <p><strong>Días 4-7: Mykonos</strong> — Ferry rápido, estancia en resort con vista al mar eólico.</p>
                        <p><strong>Días 8-11: Santorini</strong> — Oia, catamarán semiprivado al atardecer con cata de vinos.</p>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        Incluye traslados privados recomendados operados por Hellenic Travel Network.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input simulado de chat */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center gap-3">
                <input
                  type="text"
                  disabled
                  placeholder="Escribí aquí tu requerimiento de viaje (ciudades, noches, presupuesto)..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-400 placeholder:text-slate-300 outline-none"
                />
                <button
                  type="button"
                  disabled
                  className="p-3 rounded-xl bg-[#1b87c7] text-white opacity-60"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lado Derecho: Foto Grupal de Fam Tour & Testimonio (5 cols) */}
            <div className="lg:col-span-5 relative flex flex-col justify-between bg-white p-6 sm:p-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3cac59] mb-3">
                  <Compass className="w-4 h-4" />
                  <span>Comunidad en Acción</span>
                </div>
                <h4 className="text-xl font-bold text-[#4d4e4f] mb-2 font-heading">
                  Diseñado para el Agente que Valora su Tiempo
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Nuestras herramientas nacen del feedback directo con turoperadores en fam tours y caravanas en toda la región.
                </p>
              </div>

              {/* Imagen del Fam Tour con Overlay */}
              <div className="relative h-60 w-full rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                  alt="Equipo de agentes de viajes en Fam Tour"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase text-[#3cac59] tracking-wider block">
                    Fam Tour Cancún 2026
                  </span>
                  <p className="text-xs font-medium text-white/90 leading-tight">
                    "Armé una cotización de 12 días en 40 segundos frente al cliente y cerramos la venta."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Superpuesto de Restricción / Embudo */}
          <div className="relative z-20 bg-gradient-to-r from-[#113d5b] via-[#0e496d] to-[#1b87c7] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/20">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <Lock className="w-6 h-6 text-[#3cac59]" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold leading-tight">
                  La Inteligencia Artificial de Promovêre es exclusiva para miembros
                </h4>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                  Iniciá sesión para crear itinerarios completos, flyers personalizados y respuestas comerciales al instante.
                </p>
              </div>
            </div>

            <Link
              href="/comunidad/login"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#3cac59] hover:bg-[#2e934a] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#3cac59]/30 hover:-translate-y-0.5 transition-all shrink-0"
            >
              <span>Iniciá sesión para usar la IA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
