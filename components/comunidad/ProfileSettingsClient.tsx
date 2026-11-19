'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Save,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
  Building2,
  Phone,
  Globe,
  LayoutList,
  Loader2,
} from 'lucide-react';
import { getMediaUrl } from '@/lib/media';

export const DEFAULT_DASHBOARD_ORDER = [
  'representaciones',
  'promociones',
  'eventos',
  'herramientas',
  'webinars',
  'blog',
] as const;

export const SECTION_LABELS: Record<string, { title: string; subtitle: string }> = {
  representaciones: {
    title: 'Catálogo de Representaciones Oficiales',
    subtitle: 'Marcas, cadenas hoteleras y destinos representados.',
  },
  promociones: {
    title: 'Promociones e Incentivos Trade',
    subtitle: 'Campañas vigentes, beneficios y cuenta regresiva.',
  },
  eventos: {
    title: 'Eventos & Fam Tours (Calendario + Destacados)',
    subtitle: 'Agenda mensual/semanal/lista y Fam Tours destacados.',
  },
  herramientas: {
    title: 'Herramientas Comerciales e Inteligentes',
    subtitle: 'Brochures, cotizadores, bancos de fotos y kits descargables.',
  },
  webinars: {
    title: 'Webinars & Capacitaciones en Video',
    subtitle: 'Sesiones grabadas y próximas transmisiones en vivo.',
  },
  blog: {
    title: 'Herramientas Importantes (Notas de Blog)',
    subtitle: 'Guías editoriales, tendencias y noticias clave del trade.',
  },
};

export interface ProfileSettingsClientProps {
  initialUser: {
    id: string | number;
    name: string;
    email: string;
    role: string;
    company: string;
    phone: string;
    country: string;
    avatar?: any;
    dashboardOrder?: string[] | null;
  };
}

function normalizeOrder(order?: string[] | null): string[] {
  const validKeys = new Set<string>(DEFAULT_DASHBOARD_ORDER);
  const cleaned = Array.isArray(order) ? order.filter((k) => validKeys.has(k)) : [];
  const missing = DEFAULT_DASHBOARD_ORDER.filter((k) => !cleaned.includes(k));
  return [...cleaned, ...missing];
}

export default function ProfileSettingsClient({ initialUser }: ProfileSettingsClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialUser.name || '');
  const [company, setCompany] = useState(initialUser.company || '');
  const [phone, setPhone] = useState(initialUser.phone || '');
  const [country, setCountry] = useState(initialUser.country || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(getMediaUrl(initialUser.avatar, ''));
  const [order, setOrder] = useState<string[]>(() => normalizeOrder(initialUser.dashboardOrder));

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialLetter = (name.trim() || initialUser.email || 'U').charAt(0).toUpperCase();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/comunidad/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo subir la imagen.');
      }

      const newUrl = getMediaUrl(data.media, '');
      if (newUrl) {
        setAvatarUrl(newUrl);
      }
      setSuccessMsg('Foto de perfil actualizada correctamente.');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al subir la foto de perfil.');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= order.length) return;
    const next = [...order];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    setOrder(next);
  };

  const handleResetOrder = () => {
    setOrder([...DEFAULT_DASHBOARD_ORDER]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/comunidad/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          phone,
          country,
          dashboardOrder: order,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudieron guardar los cambios.');
      }

      setSuccessMsg('Tus datos y el orden de tu panel se guardaron correctamente.');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Ocurrió un error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/comunidad/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b87c7] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Panel de Comunidad</span>
          </Link>
          <h1 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f]">
            Configuración de Mi Perfil y Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Actualizá tus datos, cargá tu foto de perfil y personalizá el orden en que ves las
            secciones de tu panel de bienvenida.
          </p>
        </div>
      </div>

      {/* Alertas */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#3cac59]/10 border border-[#3cac59]/30 text-[#235831] text-xs sm:text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#3cac59] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Tarjeta de Avatar y Datos Personales */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name || 'Avatar'}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#3cac59]/40 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#3cac59] text-white flex items-center justify-center font-baloo font-extrabold text-3xl shadow-md">
                  {initialLetter}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                aria-label="Cambiar foto de perfil"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1b87c7] hover:bg-[#156d9f] text-white flex items-center justify-center shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <h2 className="font-baloo text-lg font-extrabold text-[#4d4e4f]">
                Foto de Perfil / Avatar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">
                JPG, PNG o WebP hasta 5 MB. Si no cargás una foto, mostramos la inicial de tu nombre.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#4d4e4f] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5 text-[#1b87c7]" />
                <span>{uploadingAvatar ? 'Subiendo...' : 'Subir nueva foto'}</span>
              </button>
            </div>
          </div>

          {/* Campos de datos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
                Nombre y Apellido
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
                Correo Electrónico (Cuenta)
              </label>
              <input
                type="email"
                value={initialUser.email}
                disabled
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
                Agencia / Empresa Operadora
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ej: Viajes LATAM S.A."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
                Teléfono / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 9 11 ..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5">
                País de Operación
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Ej: Argentina, Chile, Uruguay, Colombia..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Orden de los Elementos del Panel de Bienvenida */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b87c7] uppercase tracking-wider mb-1">
                <LayoutList className="w-4 h-4" />
                <span>Personalización del Dashboard</span>
              </div>
              <h2 className="font-baloo text-xl font-extrabold text-[#4d4e4f]">
                Orden de los Elementos en tu Panel
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Usá las flechas para elegir qué secciones querés ver primero al iniciar sesión.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetOrder}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer self-start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer orden</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {order.map((sectionKey, idx) => {
              const info = SECTION_LABELS[sectionKey] || {
                title: sectionKey,
                subtitle: '',
              };
              return (
                <div
                  key={sectionKey}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-[#f9f9f9]/80 hover:border-[#1b87c7]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-[#1b87c7]/10 text-[#1b87c7] font-baloo font-extrabold text-sm flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#4d4e4f] truncate">{info.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{info.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveSection(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Subir ${info.title}`}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-[#4d4e4f] hover:border-[#1b87c7] hover:text-[#1b87c7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(idx, 1)}
                      disabled={idx === order.length - 1}
                      aria-label={`Bajar ${info.title}`}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-[#4d4e4f] hover:border-[#1b87c7] hover:text-[#1b87c7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/comunidad/dashboard"
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#1b87c7] to-[#3cac59] hover:from-[#156d9f] hover:to-[#32964c] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#1b87c7]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
