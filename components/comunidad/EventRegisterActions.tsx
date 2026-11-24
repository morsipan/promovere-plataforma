'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Loader2,
  CalendarPlus,
  ArrowUpRight,
  Zap,
  Lock,
} from 'lucide-react';
import { buildGoogleCalendarUrl } from '@/lib/google-calendar';

export interface EventRegisterActionsProps {
  eventId: string | number;
  title: string;
  modality: string;
  eventDate?: string | null;
  description?: string | null;
  locationOrPlatform?: string | null;
  registrationUrl?: string | null;
  initialRegistered?: boolean;
  isAuthenticated?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  onRegisteredChange?: (eventId: string | number, registered: boolean) => void;
}

export default function EventRegisterActions({
  eventId,
  title,
  modality,
  eventDate,
  description,
  locationOrPlatform,
  registrationUrl,
  initialRegistered = false,
  isAuthenticated = true,
  compact = false,
  fullWidth = false,
  onRegisteredChange,
}: EventRegisterActionsProps) {
  const [registered, setRegistered] = useState(initialRegistered);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isOnDemand = modality === 'on_demand';
  const isFamTrip = modality === 'fam_trip';
  const calendarUrl = buildGoogleCalendarUrl({
    title,
    startDate: eventDate,
    durationMinutes: isFamTrip ? 480 : 60,
    description: description || undefined,
    location: locationOrPlatform || undefined,
  });

  const handleOneClickRegister = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/comunidad/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo completar la inscripción.');
      }
      setRegistered(true);
      onRegisteredChange?.(eventId, true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al registrar inscripción.');
    } finally {
      setLoading(false);
    }
  };

  const sizeClass = compact ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2.5 text-xs';
  const widthClass = fullWidth ? 'w-full justify-center' : '';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${fullWidth ? 'flex-col w-full' : ''}`}>
      {/* Botón de Inscripción en 1 Clic (para Webinars, Presenciales y FAM Tours) */}
      {!isOnDemand ? (
        isAuthenticated ? (
          registered ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl bg-[#3cac59]/15 text-[#266f39] border border-[#3cac59]/35 font-bold font-sans ${sizeClass} ${widthClass}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3cac59] shrink-0" />
              <span>{isFamTrip ? '¡Interés registrado!' : '¡Inscripto en 1 clic!'}</span>
            </span>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleOneClickRegister}
              className={`inline-flex items-center gap-1.5 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white font-bold font-sans shadow-sm transition-all cursor-pointer disabled:opacity-60 ${sizeClass} ${widthClass}`}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-[#f9f9f9] shrink-0" />
              )}
              <span>
                {loading
                  ? 'Registrando...'
                  : isFamTrip
                  ? 'Postularme en 1 clic'
                  : 'Inscribirme en 1 clic'}
              </span>
            </button>
          )
        ) : (
          <Link
            href="/comunidad/login"
            className={`inline-flex items-center gap-1.5 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white font-bold font-sans shadow-sm transition-all ${sizeClass} ${widthClass}`}
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Ingresá para inscribirte en 1 clic</span>
          </Link>
        )
      ) : null}

      {/* Botón Agendar en Google Calendar */}
      {calendarUrl ? (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-xl bg-[#f9f9f9] hover:bg-[#3cac59]/10 text-[#4d4e4f] hover:text-[#266f39] border border-gray-200 hover:border-[#3cac59]/40 font-bold font-sans transition-colors ${sizeClass} ${widthClass}`}
        >
          <CalendarPlus className="w-3.5 h-3.5 text-[#3cac59] shrink-0" />
          <span>{compact ? 'Google Calendar' : 'Agendar en Google Calendar'}</span>
        </a>
      ) : null}

      {/* Enlace externo opcional (Zoom / Sala) si el evento lo define y el usuario está autenticado */}
      {isAuthenticated && registrationUrl && !isOnDemand ? (
        <a
          href={registrationUrl}
          target={registrationUrl.startsWith('http') ? '_blank' : undefined}
          rel={registrationUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={`inline-flex items-center gap-1 rounded-xl border border-gray-200 hover:border-[#1b87c7] text-[#4d4e4f] hover:text-[#1b87c7] font-semibold font-sans transition-colors ${sizeClass} ${widthClass}`}
        >
          <span>Enlace sala</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        </a>
      ) : null}

      {errorMsg ? (
        <p className="w-full text-[11px] font-semibold text-red-600">{errorMsg}</p>
      ) : null}
    </div>
  );
}
