export type AnalyticsEventType = 'page_view' | 'click' | 'conversion';

export interface TrackEventInput {
  eventType: AnalyticsEventType;
  path?: string;
  label: string;
  bannerId?: string;
  section?: string;
}

function detectClientDevice(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth < 768) return 'mobile';
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '')) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Envía eventos de analítica de forma liviana y no bloqueante (sendBeacon / keepalive).
 * Nunca interrumpe la navegación, aperturas en target="_blank" ni modales.
 */
export function trackEvent(input: TrackEventInput): void {
  if (typeof window === 'undefined') return;

  const currentPath = (input.path || window.location.pathname || '/').trim();
  if (currentPath.startsWith('/admin') || currentPath.startsWith('/api')) {
    return;
  }

  const payload = JSON.stringify({
    eventType: input.eventType,
    path: currentPath.slice(0, 240),
    label: (input.label || currentPath).trim().slice(0, 180),
    bannerId: input.bannerId ? input.bannerId.trim().slice(0, 120) : undefined,
    section: input.section ? input.section.trim().slice(0, 80) : undefined,
    device: detectClientDevice(),
  });

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon('/api/analytics/track', blob);
      if (sent) return;
    }
    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Nunca romper la interacción del usuario si falla analítica
  }
}
