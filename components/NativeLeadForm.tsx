'use client';

import { useState, type FormEvent } from 'react';
import {
  User,
  Mail,
  Building,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Globe,
} from 'lucide-react';
import type { NativeFormType, LeadProfileSegment } from '@/lib/integrations/forms';

export interface NativeLeadFormProps {
  formType?: NativeFormType;
  source?: string;
  defaultService?: string;
  brand?: string;
  tags?: string[];
  submitLabel?: string;
  compact?: boolean;
  onSuccess?: (submissionId: string) => void;
}

export default function NativeLeadForm({
  formType = 'contacto_comercial',
  source = 'native-form',
  defaultService = 'Representaciones Turísticas',
  brand,
  tags = [],
  submitLabel = 'Enviar consulta comercial',
  compact = false,
  onSuccess,
}: NativeLeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    roleInterest: 'agencia_minorista' as LeadProfileSegment,
    service: defaultService,
    message: '',
    website_hp: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          formType,
          source,
          brand,
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudo enviar tu consulta.');
      }

      const id = data?.submissionId || 'ok';
      setSubmittedId(id);
      onSuccess?.(id);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Ocurrió un error al enviar el formulario.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <div className="py-10 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-[#3cac59]/10 text-[#3cac59] flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-[#4d4e4f] mb-2">
          ¡Mensaje Enviado con Éxito!
        </h3>
        <p className="text-sm text-[#4d4e4f]/80 max-w-md mx-auto mb-6">
          Muchas gracias por comunicarte con Promovêre. Nuestro equipo comercial recibió tu
          solicitud y te responderá a la brevedad.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedId(null);
            setFormData((prev) => ({ ...prev, message: '' }));
          }}
          className="px-6 py-2.5 rounded-xl bg-[#1b87c7] text-white font-bold text-xs hover:bg-[#156d9f] transition-colors cursor-pointer"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      {/* Honeypot oculto */}
      <input
        type="text"
        name="website_hp"
        tabIndex={-1}
        autoComplete="off"
        value={formData.website_hp}
        onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
        className="hidden"
        aria-hidden="true"
      />

      {errorMsg ? (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
            Nombre y Apellido *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Martín González"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b87c7]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
            Correo Electrónico *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ejemplo@empresa.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b87c7]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
            Empresa / Agencia / Marca *
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Nombre comercial"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b87c7]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
            Perfil / Segmento
          </label>
          <select
            value={formData.roleInterest}
            onChange={(e) =>
              setFormData({ ...formData, roleInterest: e.target.value as LeadProfileSegment })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] focus:outline-none focus:ring-2 focus:ring-[#1b87c7]"
          >
            <option value="agencia_minorista">Agencia Minorista</option>
            <option value="operador_mayorista">Operador Mayorista</option>
            <option value="marca_hotel_destino">Marca / Hotel / Destino</option>
            <option value="prensa">Prensa / Medios</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      {!compact ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
              País
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Ej. Argentina, Chile, México..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b87c7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
              Área de Interés
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] focus:outline-none focus:ring-2 focus:ring-[#1b87c7]"
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
      ) : null}

      <div>
        <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
          Detalle de la Consulta *
        </label>
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
          <textarea
            rows={compact ? 3 : 4}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Contanos sobre tu marca, agencia u objetivos comerciales en LATAM..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#4d4e4f] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b87c7] resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white font-bold text-sm transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Enviando consulta...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>{submitLabel}</span>
          </>
        )}
      </button>
    </form>
  );
}
