import { NextResponse } from 'next/server';
import {
  inferDeviceFromUserAgent,
  recordAnalyticsEventServer,
} from '@/lib/analyticsServer';

const ALLOWED_TYPES = new Set(['page_view', 'click', 'conversion']);

function cleanStr(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Payload inválido' }, { status: 400 });
    }

    const eventType = cleanStr(body.eventType, 30);
    if (!ALLOWED_TYPES.has(eventType)) {
      return NextResponse.json({ ok: false, error: 'eventType no permitido' }, { status: 400 });
    }

    const path = cleanStr(body.path, 240) || '/';
    // Ignorar rutas internas de administración o API
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ ok: true, ignored: true }, { status: 202 });
    }

    const label = cleanStr(body.label, 180) || path;
    const bannerId = cleanStr(body.bannerId, 120) || undefined;
    const section = cleanStr(body.section, 80) || undefined;

    const device =
      body.device === 'mobile' || body.device === 'desktop'
        ? body.device
        : inferDeviceFromUserAgent(request.headers.get('user-agent'));

    await recordAnalyticsEventServer({
      eventType: eventType as 'page_view' | 'click' | 'conversion',
      path,
      label,
      bannerId,
      section,
      device,
    });

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
