'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  List,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  UserCheck,
  Building2,
  ArrowUpRight,
  PlayCircle,
  Download,
  Star,
  Plane,
  Video,
} from 'lucide-react';
import { getMediaUrl } from '@/lib/media';

export interface CalendarEventItem {
  id: string | number;
  title: string;
  modality: 'webinar' | 'presencial' | 'fam_trip' | 'on_demand' | string;
  eventDate?: string | null;
  locationOrPlatform?: string | null;
  speaker?: string | null;
  description: string;
  registrationUrl?: string | null;
  recordingUrl?: string | null;
  coverImage?: any;
  materialAttachment?: any;
  representation?: any;
  featured?: boolean | null;
}

export interface CommunityEventsCalendarProps {
  events: CalendarEventItem[];
}

type CalendarView = 'month' | 'week' | 'list';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const MODALITY_META: Record<
  string,
  { label: string; badgeClass: string; dotClass: string; pillClass: string }
> = {
  fam_trip: {
    label: 'Fam Tour',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/25',
    dotClass: 'bg-amber-500',
    pillClass: 'bg-amber-500/15 text-amber-800',
  },
  webinar: {
    label: 'Webinar en Vivo',
    badgeClass: 'bg-[#1b87c7]/10 text-[#1b87c7] border-[#1b87c7]/25',
    dotClass: 'bg-[#1b87c7]',
    pillClass: 'bg-[#1b87c7]/15 text-[#0e5a8a]',
  },
  presencial: {
    label: 'Presencial',
    badgeClass: 'bg-[#3cac59]/10 text-[#266f39] border-[#3cac59]/25',
    dotClass: 'bg-[#3cac59]',
    pillClass: 'bg-[#3cac59]/15 text-[#235831]',
  },
  on_demand: {
    label: 'On-Demand',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500',
    pillClass: 'bg-purple-100 text-purple-800',
  },
};

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getMonday(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0=Dom, 1=Lun...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatMonthTitle(d: Date): string {
  const raw = d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function formatShortDate(dateIso?: string | null, includeTime = false): string {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

function formatTimeOnly(dateIso?: string | null): string {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

export default function CommunityEventsCalendar({ events }: CommunityEventsCalendarProps) {
  const [view, setView] = useState<CalendarView>('month');
  const [todayKey, setTodayKey] = useState<string>('');
  const [anchorDate, setAnchorDate] = useState<Date>(() => {
    // Inicializar de forma determinista según el primer evento con fecha para evitar hydration mismatch
    const dated = events
      .map((e) => (e.eventDate ? new Date(e.eventDate) : null))
      .filter((d): d is Date => Boolean(d && !Number.isNaN(d.getTime())))
      .sort((a, b) => a.getTime() - b.getTime());
    if (dated.length > 0) {
      return new Date(dated[0].getFullYear(), dated[0].getMonth(), dated[0].getDate());
    }
    return new Date(2026, 10, 1);
  });
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  // Al montar en cliente, sincronizamos el "hoy" real y pre-seleccionamos el próximo día con evento si existe
  useEffect(() => {
    const now = new Date();
    setTodayKey(toDateKey(now));
    setAnchorDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }, []);

  // Agrupar eventos por YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEventItem[]> = {};
    for (const ev of events) {
      if (!ev.eventDate) continue;
      const d = new Date(ev.eventDate);
      if (Number.isNaN(d.getTime())) continue;
      const key = toDateKey(d);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  // Eventos ordenados cronológicamente para la vista Lista
  const chronologicalEvents = useMemo(() => {
    const withDate = events
      .filter((e) => e.eventDate && !Number.isNaN(new Date(e.eventDate).getTime()))
      .sort((a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime());
    const withoutDate = events.filter(
      (e) => !e.eventDate || Number.isNaN(new Date(e.eventDate).getTime())
    );
    return [...withDate, ...withoutDate];
  }, [events]);

  // Columna derecha: Eventos Destacados (o fallback a los primeros 3 eventos si ninguno tiene featured=true)
  const featuredEvents = useMemo(() => {
    const marked = events.filter((e) => Boolean(e.featured));
    if (marked.length > 0) return marked;
    return chronologicalEvents.slice(0, 3);
  }, [events, chronologicalEvents]);

  // Celdas del calendario mensual (6 semanas x 7 días = 42 o 35 días completos)
  const monthDays = useMemo(() => {
    const firstOfMonth = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
    const start = getMonday(firstOfMonth);
    const days: Date[] = [];
    for (let i = 0; i < 35; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    // Si el mes tiene días que caen en la 6ta semana, agregamos 7 días más
    const lastOfMonth = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);
    if (days[days.length - 1] < lastOfMonth) {
      for (let i = 35; i < 42; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(d);
      }
    }
    return days;
  }, [anchorDate]);

  // Días de la vista semanal (Lun -> Dom)
  const weekDays = useMemo(() => {
    const monday = getMonday(anchorDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [anchorDate]);

  const weekRangeLabel = useMemo(() => {
    const first = weekDays[0];
    const last = weekDays[6];
    const fStr = first.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
    const lStr = last.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return `${fStr} – ${lStr}`;
  }, [weekDays]);

  const handlePrev = () => {
    setAnchorDate((prev) => {
      const next = new Date(prev);
      if (view === 'week') {
        next.setDate(prev.getDate() - 7);
      } else {
        next.setMonth(prev.getMonth() - 1);
      }
      return next;
    });
  };

  const handleNext = () => {
    setAnchorDate((prev) => {
      const next = new Date(prev);
      if (view === 'week') {
        next.setDate(prev.getDate() + 7);
      } else {
        next.setMonth(prev.getMonth() + 1);
      }
      return next;
    });
  };

  const handleToday = () => {
    const now = new Date();
    setAnchorDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    setSelectedDayKey(toDateKey(now));
  };

  const selectedDayEvents = selectedDayKey ? eventsByDate[selectedDayKey] || [] : [];

  const getModMeta = (modality: string) =>
    MODALITY_META[modality] || {
      label: modality,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      dotClass: 'bg-slate-400',
      pillClass: 'bg-slate-100 text-slate-700',
    };

  const renderEventActions = (ev: CalendarEventItem, compact = false) => {
    const materialUrl = getMediaUrl(ev.materialAttachment);
    const ctaText = ev.modality === 'fam_trip' ? 'Postularme' : 'Inscribirme';

    return (
      <div className="flex flex-wrap items-center gap-2">
        {ev.registrationUrl && ev.modality !== 'on_demand' && (
          <a
            href={ev.registrationUrl}
            target={ev.registrationUrl.startsWith('http') ? '_blank' : undefined}
            rel={ev.registrationUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`inline-flex items-center gap-1 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white font-bold transition-colors ${
              compact ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'
            }`}
          >
            <span>{ctaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
        {ev.recordingUrl && (
          <a
            href={ev.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 rounded-xl bg-[#4d4e4f] hover:bg-[#38393a] text-white font-bold transition-colors ${
              compact ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#3cac59]" />
            <span>Ver Grabación</span>
          </a>
        )}
        {materialUrl && (
          <a
            href={materialUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className={`inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#4d4e4f] font-bold transition-colors ${
              compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3.5 py-2 text-xs'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#1b87c7]" />
            <span>PDF</span>
          </a>
        )}
      </div>
    );
  };

  return (
    <section id="eventos" className="scroll-mt-24">
      {/* Encabezado de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1b87c7] mb-1">
            <Calendar className="w-4 h-4" />
            <span>Agenda Trade, Fam Tours & Capacitaciones</span>
          </div>
          <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
            Eventos & Fam Tours
          </h2>
        </div>
        <span className="text-xs font-medium text-slate-500">
          {events.length} {events.length === 1 ? 'actividad programada' : 'actividades programadas'}
        </span>
      </div>

      {/* Grilla 2 Columnas: Izquierda Calendario (7 cols) | Derecha Destacados (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================================================================== */}
        {/* COLUMNA IZQUIERDA: Calendario Interactivo (Mensual / Semanal / Lista) */}
        {/* ================================================================== */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Toolbar superior del calendario */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f9f9f9]/70">
            {/* Navegación de período */}
            <div className="flex items-center gap-2">
              {view !== 'list' && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Período anterior"
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-[#4d4e4f] hover:border-[#1b87c7] hover:text-[#1b87c7] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Período siguiente"
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-[#4d4e4f] hover:border-[#1b87c7] hover:text-[#1b87c7] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleToday}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-[#4d4e4f] hover:border-[#1b87c7] hover:text-[#1b87c7] transition-colors cursor-pointer"
                  >
                    Hoy
                  </button>
                </>
              )}
              <h3 className="font-baloo text-base sm:text-lg font-extrabold text-[#4d4e4f] ml-1">
                {view === 'month'
                  ? formatMonthTitle(anchorDate)
                  : view === 'week'
                  ? weekRangeLabel
                  : 'Próximos Eventos'}
              </h3>
            </div>

            {/* Conmutador de vista: Mensual | Semanal | Lista */}
            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setView('month')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  view === 'month'
                    ? 'bg-white text-[#1b87c7] shadow-xs'
                    : 'text-[#4d4e4f]/75 hover:text-[#4d4e4f]'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Mensual</span>
              </button>
              <button
                type="button"
                onClick={() => setView('week')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  view === 'week'
                    ? 'bg-white text-[#1b87c7] shadow-xs'
                    : 'text-[#4d4e4f]/75 hover:text-[#4d4e4f]'
                }`}
              >
                <CalendarRange className="w-3.5 h-3.5" />
                <span>Semanal</span>
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  view === 'list'
                    ? 'bg-white text-[#1b87c7] shadow-xs'
                    : 'text-[#4d4e4f]/75 hover:text-[#4d4e4f]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Lista</span>
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* VISTA 1: MENSUAL                                                 */}
          {/* ---------------------------------------------------------------- */}
          {view === 'month' && (
            <div className="p-4 sm:p-5">
              {/* Cabecera de días */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grilla de días */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {monthDays.map((dayDate) => {
                  const key = toDateKey(dayDate);
                  const isCurrentMonth = dayDate.getMonth() === anchorDate.getMonth();
                  const isToday = key === todayKey;
                  const isSelected = key === selectedDayKey;
                  const dayEvents = eventsByDate[key] || [];
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDayKey(key === selectedDayKey ? null : key)}
                      className={`min-h-[62px] sm:min-h-[78px] p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1b87c7] bg-[#f0f7fc] ring-2 ring-[#1b87c7]/25'
                          : isToday
                          ? 'border-[#3cac59]/60 bg-[#f2fbf4]/60'
                          : hasEvents
                          ? 'border-slate-200 bg-white hover:border-[#1b87c7]/60 hover:bg-[#f9f9f9]'
                          : 'border-slate-100 bg-white hover:bg-slate-50/70'
                      } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-xs font-bold leading-none px-1.5 py-0.5 rounded-md ${
                            isToday
                              ? 'bg-[#3cac59] text-white'
                              : isSelected
                              ? 'text-[#1b87c7]'
                              : 'text-[#4d4e4f]'
                          }`}
                        >
                          {dayDate.getDate()}
                        </span>
                        {hasEvents && (
                          <span className="w-2 h-2 rounded-full bg-[#1b87c7] shrink-0 sm:hidden" />
                        )}
                      </div>

                      {/* Pills de eventos en desktop/tablet */}
                      {hasEvents && (
                        <div className="space-y-0.5 mt-1 w-full hidden sm:block">
                          {dayEvents.slice(0, 2).map((ev) => {
                            const meta = getModMeta(ev.modality);
                            return (
                              <div
                                key={String(ev.id)}
                                title={ev.title}
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded truncate ${meta.pillClass}`}
                              >
                                {ev.title}
                              </div>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <div className="text-[9px] font-bold text-[#1b87c7] px-1">
                              +{dayEvents.length - 2} más
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Leyenda de colores */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Fam Tour
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1b87c7]" /> Webinar en Vivo
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3cac59]" /> Presencial
                </span>
              </div>

              {/* Detalle del día seleccionado */}
              {selectedDayKey && (
                <div className="mt-4 p-4 rounded-2xl bg-[#f0f7fc]/70 border border-[#1b87c7]/20">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-[#1b87c7] uppercase tracking-wider">
                      Eventos del {formatShortDate(`${selectedDayKey}T12:00:00`)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDayKey(null)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-[#4d4e4f] cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </div>

                  {selectedDayEvents.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      No hay eventos agendados para esta fecha.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedDayEvents.map((ev) => {
                        const meta = getModMeta(ev.modality);
                        return (
                          <div
                            key={String(ev.id)}
                            className="bg-white rounded-xl p-3.5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${meta.badgeClass}`}
                                >
                                  {meta.label}
                                </span>
                                {ev.eventDate && (
                                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-[#1b87c7]" />
                                    {formatTimeOnly(ev.eventDate)} hs
                                  </span>
                                )}
                              </div>
                              <p className="font-baloo text-sm font-extrabold text-[#4d4e4f]">
                                {ev.title}
                              </p>
                              {ev.locationOrPlatform && (
                                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-[#3cac59]" />
                                  {ev.locationOrPlatform}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0">{renderEventActions(ev, true)}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* VISTA 2: SEMANAL                                                 */}
          {/* ---------------------------------------------------------------- */}
          {view === 'week' && (
            <div className="p-4 sm:p-5 divide-y divide-slate-100">
              {weekDays.map((dayDate) => {
                const key = toDateKey(dayDate);
                const isToday = key === todayKey;
                const dayEvents = eventsByDate[key] || [];
                const dayName = dayDate.toLocaleDateString('es-AR', { weekday: 'short' });
                const monthShort = dayDate.toLocaleDateString('es-AR', { month: 'short' });

                return (
                  <div
                    key={key}
                    className={`py-3 flex flex-col sm:flex-row sm:items-start gap-3 ${
                      isToday ? 'bg-[#f2fbf4]/50 -mx-2 px-2 rounded-xl' : ''
                    }`}
                  >
                    <div className="sm:w-24 shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0.5">
                      <span className="text-[11px] font-bold uppercase text-slate-400">
                        {dayName}
                      </span>
                      <span
                        className={`font-baloo text-lg font-extrabold leading-tight ${
                          isToday ? 'text-[#3cac59]' : 'text-[#4d4e4f]'
                        }`}
                      >
                        {dayDate.getDate()} {monthShort}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {dayEvents.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">Sin eventos agendados</span>
                      ) : (
                        <div className="space-y-2">
                          {dayEvents.map((ev) => {
                            const meta = getModMeta(ev.modality);
                            return (
                              <div
                                key={String(ev.id)}
                                className="rounded-xl border border-slate-200/80 bg-[#f9f9f9]/80 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${meta.badgeClass}`}
                                    >
                                      {meta.label}
                                    </span>
                                    {ev.eventDate && (
                                      <span className="text-[11px] font-semibold text-slate-500">
                                        {formatTimeOnly(ev.eventDate)} hs
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-baloo text-sm font-extrabold text-[#4d4e4f]">
                                    {ev.title}
                                  </p>
                                  {ev.locationOrPlatform && (
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                      {ev.locationOrPlatform}
                                    </p>
                                  )}
                                </div>
                                <div className="shrink-0">{renderEventActions(ev, true)}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* VISTA 3: LISTA DE PRÓXIMOS EVENTOS                               */}
          {/* ---------------------------------------------------------------- */}
          {view === 'list' && (
            <div className="p-4 sm:p-5 space-y-3">
              {chronologicalEvents.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  No hay eventos cargados en este momento.
                </div>
              ) : (
                chronologicalEvents.map((ev) => {
                  const meta = getModMeta(ev.modality);
                  const d = ev.eventDate ? new Date(ev.eventDate) : null;
                  const validDate = d && !Number.isNaN(d.getTime());

                  return (
                    <div
                      key={String(ev.id)}
                      className="rounded-2xl border border-slate-200/80 hover:border-[#1b87c7]/40 bg-[#f9f9f9]/60 hover:bg-white p-4 transition-all flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      {/* Bloque de fecha */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1b87c7]/10 to-[#3cac59]/10 border border-[#1b87c7]/20 flex flex-col items-center justify-center shrink-0 text-center">
                        {validDate ? (
                          <>
                            <span className="text-[10px] font-extrabold uppercase text-[#1b87c7]">
                              {d.toLocaleDateString('es-AR', { month: 'short' })}
                            </span>
                            <span className="font-baloo text-xl font-black text-[#4d4e4f] leading-none">
                              {d.getDate()}
                            </span>
                          </>
                        ) : (
                          <Video className="w-5 h-5 text-purple-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${meta.badgeClass}`}
                          >
                            {meta.label}
                          </span>
                          {validDate && (
                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#1b87c7]" />
                              {formatTimeOnly(ev.eventDate)} hs
                            </span>
                          )}
                        </div>
                        <h4 className="font-baloo text-base font-extrabold text-[#4d4e4f] leading-snug">
                          {ev.title}
                        </h4>
                        {ev.locationOrPlatform && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#3cac59]" />
                            {ev.locationOrPlatform}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0">{renderEventActions(ev, true)}</div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ================================================================== */}
        {/* COLUMNA DERECHA: Listado de Eventos Destacados                     */}
        {/* ================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <h3 className="font-baloo text-lg font-extrabold text-[#4d4e4f]">
                Eventos Destacados
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              {featuredEvents.length}{' '}
              {featuredEvents.length === 1 ? 'destacado' : 'destacados'}
            </span>
          </div>

          {featuredEvents.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-sm font-semibold text-[#4d4e4f]">
                Sin eventos destacados por el momento.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Marcá cualquier evento o Fam Tour como &ldquo;Destacar Evento&rdquo; desde /admin.
              </p>
            </div>
          ) : (
            featuredEvents.map((ev) => {
              const meta = getModMeta(ev.modality);
              const coverSrc = getMediaUrl(ev.coverImage);
              const repLabel =
                typeof ev.representation === 'object' && ev.representation !== null
                  ? `${ev.representation.title} (${ev.representation.brand})`
                  : null;

              return (
                <article
                  key={`feat-${ev.id}`}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-[#1b87c7]/40 shadow-xs hover:shadow-md transition-all overflow-hidden"
                >
                  {coverSrc && (
                    <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                      <img
                        src={coverSrc}
                        alt={ev.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${meta.badgeClass}`}
                      >
                        {ev.modality === 'fam_trip' ? (
                          <Plane className="w-3 h-3" />
                        ) : ev.modality === 'on_demand' ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <Calendar className="w-3 h-3" />
                        )}
                        <span>{meta.label}</span>
                      </span>

                      {ev.eventDate && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4d4e4f] bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3 h-3 text-[#1b87c7]" />
                          <span>{formatShortDate(ev.eventDate, true)} hs</span>
                        </span>
                      )}
                    </div>

                    {repLabel && (
                      <p className="text-[11px] font-semibold text-[#1b87c7] flex items-center gap-1 mb-1">
                        <Building2 className="w-3 h-3" />
                        <span>{repLabel}</span>
                      </p>
                    )}

                    <h4 className="font-baloo text-lg font-extrabold text-[#4d4e4f] leading-snug mb-1.5">
                      {ev.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
                      {ev.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-4">
                      {ev.locationOrPlatform && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#3cac59]" />
                          <span>{ev.locationOrPlatform}</span>
                        </span>
                      )}
                      {ev.speaker && (
                        <span className="inline-flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-[#1b87c7]" />
                          <span>{ev.speaker}</span>
                        </span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      {renderEventActions(ev)}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
