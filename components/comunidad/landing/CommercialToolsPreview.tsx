import Link from 'next/link';
import {
  FileCheck2,
  Plane,
  Lock,
  Search,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Globe2,
  MapPin,
  Clock,
} from 'lucide-react';
import { resolveAppearance, type AppearanceData } from '@/lib/appearance';

interface CommercialToolsPreviewProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    appearance?: AppearanceData;
  };
}

export default function CommercialToolsPreview({ data }: CommercialToolsPreviewProps = {}) {
  const badge = data?.badge || 'Herramientas Operativas';
  const title = data?.title || 'Herramientas Comerciales en Tiempo Real';
  const subtitle =
    data?.subtitle ||
    'Consultá requisitos migratorios actualizados y realizá el seguimiento de vuelos de tus pasajeros directamente desde tu panel.';
  const app = resolveAppearance(data?.appearance, {
    backgroundColor: 'blancoHumo',
    theme: 'light',
    accentColor: 'azul',
    buttonColor: 'azul',
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
            <Globe2 className={`w-3.5 h-3.5 ${app.badgeIconClass}`} />
            {badge}
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight ${app.titleClass}`}>
            {title}
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed font-normal ${app.subtitleClass}`}>
            {subtitle}
          </p>
        </div>

        {/* Grilla de 2 Tarjetas con Overlay de Captación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Tarjeta 1: Pasaportes y Visas */}
          <div className="relative rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group">
            {/* Cabecera de la herramienta */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#3cac59]/10 text-[#3cac59] flex items-center justify-center">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                  Requisitos Migratorios
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#4d4e4f] mb-2 font-heading">
                Verificador de Pasaportes & Visas
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                Verificá de forma instantánea si tus clientes necesitan visa, vacuna de fiebre amarilla o vigencia de 6 meses para su destino internacional.
              </p>

              {/* Mockup visual de la interfaz */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Nacionalidad / Emisión
                    </span>
                    <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#4d4e4f] flex items-center justify-between">
                      <span>Argentina (ARG)</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Destino Final
                    </span>
                    <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#4d4e4f] flex items-center justify-between">
                      <span>Estados Unidos (USA)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5 select-none">
                  <div className="flex items-center justify-between font-bold text-[#4d4e4f]">
                    <span>Resultado de Requisitos:</span>
                    <span className="text-[#3cac59]">Actualizado hoy</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    • Visa de no inmigrante (B1/B2 o ESTA si aplica pasaporte europeo).
                  </p>
                  <p className="text-[11px] text-slate-500">
                    • Pasaporte válido por la duración de la estadía prevista.
                  </p>
                </div>
              </div>
            </div>

            {/* Desenfoque y Overlay de Captación */}
            <div className="relative p-6 pt-0 mt-2">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent backdrop-blur-[2px] z-10 flex flex-col items-center justify-end pb-8 px-6 text-center">
                <div className="w-10 h-10 rounded-full bg-[#3cac59]/15 text-[#3cac59] flex items-center justify-center mb-3 shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#4d4e4f] mb-1">
                  Acceso Exclusivo para Miembros
                </h4>
                <p className="text-xs text-slate-500 mb-4 max-w-xs">
                  Consultá requisitos de más de 190 países en segundos.
                </p>
                <Link
                  href="/comunidad/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3cac59] hover:bg-[#2e934a] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#3cac59]/25 hover:-translate-y-0.5 transition-all"
                >
                  <span>Iniciá sesión para usar esta herramienta</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="h-16" />
            </div>
          </div>

          {/* Tarjeta 2: FlightAware */}
          <div className="relative rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group">
            {/* Cabecera de la herramienta */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#1b87c7]/10 text-[#1b87c7] flex items-center justify-center">
                  <Plane className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                  Radar en Vivo
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#4d4e4f] mb-2 font-heading">
                FlightAware • Monitoreo de Vuelos
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                Rastreo y estado en tiempo real de salidas, llegadas, cancelaciones y demoras de aerolíneas globales y regionales.
              </p>

              {/* Mockup visual de vuelo */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#4d4e4f]">
                  <span>Vuelo: AR 1300 / AA 900</span>
                  <span className="text-xs font-bold text-[#3cac59] bg-[#3cac59]/10 px-2 py-0.5 rounded-md">
                    En Horario
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-2 select-none">
                  <div className="flex items-center justify-between text-slate-600">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Origen</span>
                      <span className="font-bold text-[#4d4e4f]">EZE (Buenos Aires)</span>
                    </div>
                    <div className="text-center px-2">
                      <Plane className="w-4 h-4 text-[#1b87c7] mx-auto animate-pulse" />
                      <span className="text-[10px] text-slate-400">Directo</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Destino</span>
                      <span className="font-bold text-[#4d4e4f]">MIA (Miami Intl)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#1b87c7] h-1.5 rounded-full w-3/4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Desenfoque y Overlay de Captación */}
            <div className="relative p-6 pt-0 mt-2">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent backdrop-blur-[2px] z-10 flex flex-col items-center justify-end pb-8 px-6 text-center">
                <div className="w-10 h-10 rounded-full bg-[#1b87c7]/15 text-[#1b87c7] flex items-center justify-center mb-3 shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#4d4e4f] mb-1">
                  Radar en Vivo Exclusivo
                </h4>
                <p className="text-xs text-slate-500 mb-4 max-w-xs">
                  Brindá asistencia inmediata ante retrasos y cambios de compuerta.
                </p>
                <Link
                  href="/comunidad/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1b87c7] hover:bg-[#1571a8] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#1b87c7]/25 hover:-translate-y-0.5 transition-all"
                >
                  <span>Iniciá sesión para usar esta herramienta</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="h-16" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
