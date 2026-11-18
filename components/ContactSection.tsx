'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Building,
  User,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { contactContent, siteConfig } from '@/data/content';
import { resolveAppearance, AppearanceData } from '@/lib/appearance';

interface ContactSectionProps {
  data?: {
    appearance?: AppearanceData;
    badge?: string;
    title?: string;
    subtitle?: string;
    email?: string;
    phone?: string;
    address?: string;
    addressDetail?: string;
    schedule?: string;
  };
}

export default function ContactSection({ data }: ContactSectionProps = {}) {
  // Resolución dinámica de apariencia no-code
  const sectionAppearance = resolveAppearance(data?.appearance, {
    backgroundColor: 'blanco',
    theme: 'light',
    overlayOpacity: 'media',
  });

  const badge = data?.badge || contactContent.badge;
  const title = data?.title || contactContent.title;
  const subtitle = data?.subtitle || contactContent.subtitle;
  const email = data?.email || siteConfig.email;
  const phone = data?.phone || siteConfig.phone;
  const address = data?.address || siteConfig.address;
  const addressDetail = data?.addressDetail || siteConfig.addressDetail;
  const schedule = data?.schedule || 'Lunes a Viernes 09:00 - 18:00 (GMT-3)';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Representaciones Turísticas',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section id="contacto" className={`py-20 md:py-28 relative overflow-hidden ${sectionAppearance.bgClass}`}>
      {/* Fondo de Imagen Opcional configurado en Apariencia */}
      {sectionAppearance.backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionAppearance.backgroundImageUrl}
            alt="Fondo decorativo de contacto"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${sectionAppearance.overlayClass}`} />
        </div>
      ) : null}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge ? (
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 font-sans ${sectionAppearance.badgeClass}`}>
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

        {/* Dos Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Columna Izquierda: Datos Institucionales y Oficina (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className={`border rounded-2xl p-6 sm:p-8 ${
              sectionAppearance.isDark ? 'bg-white/10 border-white/15 text-white' : 'bg-[#f9f9f9] border-gray-200/80 text-[#4d4e4f]'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${sectionAppearance.accentBgClass}`} />
                <h3 className={`text-lg font-bold ${sectionAppearance.titleClass}`}>
                  Oficinas Centrales en Buenos Aires
                </h3>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${sectionAppearance.subtitleClass}`}>
                Representamos y conectamos destinos internacionales desde el corazón financiero y turístico de la región.
              </p>

              <div className="space-y-4">
                {/* Dirección */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-gray-100 hover:border-[#1b87c7]/30 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${sectionAppearance.accentIconBgClass}`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[11px] font-bold ${sectionAppearance.accentTextClass} uppercase tracking-wider block font-sans`}>
                      Dirección Comercial
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[#4d4e4f]">
                      {address}
                    </p>
                    {addressDetail ? (
                      <p className="text-xs text-[#4d4e4f]/70 mt-0.5">
                        {addressDetail}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Teléfono */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-gray-100 hover:border-[#1b87c7]/30 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${sectionAppearance.accentIconBgClass}`}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[11px] font-bold ${sectionAppearance.accentTextClass} uppercase tracking-wider block font-sans`}>
                      Teléfono / WhatsApp Trade
                    </span>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-xs sm:text-sm font-semibold text-[#4d4e4f] hover:text-[#1b87c7] transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                {/* Correo Electrónico */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-gray-100 hover:border-[#1b87c7]/30 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${sectionAppearance.accentIconBgClass}`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[11px] font-bold ${sectionAppearance.accentTextClass} uppercase tracking-wider block font-sans`}>
                      Correo Electrónico
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="text-xs sm:text-sm font-semibold text-[#4d4e4f] hover:text-[#1b87c7] transition-colors break-words"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* Horario de Atención */}
                {schedule ? (
                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-gray-100 hover:border-[#1b87c7]/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-[#3cac59]/10 text-[#3cac59] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-[#3cac59] uppercase tracking-wider block font-sans">
                        Horario de Atención
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-[#4d4e4f]">
                        {schedule}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Portal Comunidad Banner */}
            <div className="bg-gradient-to-r from-[#1b87c7]/10 to-[#3cac59]/10 border border-[#1b87c7]/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#4d4e4f]">
                  Comunidad Promovêre
                </h4>
                <p className="text-xs text-[#4d4e4f]/80 leading-relaxed font-sans">
                  Acceso exclusivo para agentes de viajes, operadores y profesionales del trade turístico.
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario Funcional (7 cols) */}
          <div className="lg:col-span-7 bg-[#f9f9f9] border border-gray-200/80 rounded-2xl p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#3cac59]/10 text-[#3cac59] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#4d4e4f] mb-2 font-heading">
                  ¡Mensaje Enviado con Éxito!
                </h3>
                <p className="text-sm text-[#4d4e4f]/80 max-w-md mx-auto mb-6 font-sans">
                  Muchas gracias por comunicarte con Promovêre. Un asesor de nuestro equipo comercial te responderá a la brevedad.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#1b87c7] text-white font-semibold text-xs hover:bg-[#1571a8] transition-colors"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Nombre */}
                  <div>
                    <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5 font-sans">
                      Nombre y Apellido *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej. Martín González"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5 font-sans">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ejemplo@empresa.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Empresa / Operador */}
                  <div>
                    <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5 font-sans">
                      Empresa / Agencia / Destino *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Nombre comercial"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Servicio de Interés */}
                  <div>
                    <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5 font-sans">
                      Área de Interés
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] focus:outline-none focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent transition-all"
                    >
                      <option value="Representaciones Turísticas">Representaciones Turísticas (Vê REPS®)</option>
                      <option value="Marketing Turístico">Marketing Turístico y Promoción</option>
                      <option value="Relaciones Públicas">Relaciones Públicas y Medios</option>
                      <option value="Capacitación">Capacitación y Formación</option>
                      <option value="Desarrollo de Producto">Desarrollo de Producto</option>
                      <option value="Eventos y Fam Tours">Eventos y Fam Tours</option>
                      <option value="Comunidad">Comunidad Promovêre</option>
                    </select>
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5 font-sans">
                    Detalle de la Consulta *
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Cuéntanos sobre tu marca, objetivos de expansión en LATAM o necesidades comerciales..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Botón de Envío */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed ${sectionAppearance.buttonClass}`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Procesando mensaje...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{contactContent.form.submitLabel}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
