import { getPayload } from 'payload';
import config from '@payload-config';

export interface ServerAnalyticsEvent {
  eventType: 'page_view' | 'click' | 'conversion';
  path: string;
  label: string;
  bannerId?: string;
  section?: string;
  device?: 'desktop' | 'mobile';
}

export function inferDeviceFromUserAgent(ua?: string | null): 'desktop' | 'mobile' {
  if (!ua) return 'desktop';
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : 'desktop';
}

export async function recordAnalyticsEventServer(input: ServerAnalyticsEvent): Promise<void> {
  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: 'analytics-events',
      data: {
        eventType: input.eventType,
        path: input.path.trim().slice(0, 240) || '/',
        label: input.label.trim().slice(0, 180) || input.eventType,
        ...(input.bannerId ? { bannerId: input.bannerId.trim().slice(0, 120) } : {}),
        ...(input.section ? { section: input.section.trim().slice(0, 80) } : {}),
        device: input.device === 'mobile' ? 'mobile' : 'desktop',
      },
      overrideAccess: true,
    });
  } catch {
    // Registro no bloqueante: nunca debe interrumpir formularios ni inscripciones
  }
}
