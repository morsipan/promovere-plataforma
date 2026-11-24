/**
 * Generador de enlaces de Google Calendar (sin dependencias externas).
 * Formatea fechas en UTC (YYYYMMDDTHHMMSSZ) para evitar desfasajes entre SSR y cliente.
 */

export interface GoogleCalendarEventInput {
  title: string;
  startDate?: string | null;
  durationMinutes?: number;
  description?: string | null;
  location?: string | null;
}

function toGoogleUtcTimestamp(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`;
}

export function buildGoogleCalendarUrl(input: GoogleCalendarEventInput): string | null {
  if (!input.startDate) return null;
  const start = new Date(input.startDate);
  if (Number.isNaN(start.getTime())) return null;

  const durationMs = (input.durationMinutes ?? 60) * 60 * 1000;
  const end = new Date(start.getTime() + durationMs);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: input.title,
    dates: `${toGoogleUtcTimestamp(start)}/${toGoogleUtcTimestamp(end)}`,
  });

  if (input.description && input.description.trim().length > 0) {
    params.set('details', input.description.trim());
  }

  if (input.location && input.location.trim().length > 0) {
    params.set('location', input.location.trim());
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
