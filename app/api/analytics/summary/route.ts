import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import config from '@payload-config';

const RANGE_DAYS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config });
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const role = (user as any).role;
    if (!role || !['admin', 'editor'].includes(role)) {
      return NextResponse.json({ error: 'Acceso restringido a admin y editor' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const rangeKey = searchParams.get('range') || '30d';
    const days = RANGE_DAYS[rangeKey] || 30;
    const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const res = await payload.find({
      collection: 'analytics-events',
      where: {
        createdAt: { greater_than_equal: sinceIso },
      },
      sort: '-createdAt',
      limit: 5000,
      overrideAccess: true,
    });

    const docs = (res.docs || []) as Array<{
      eventType: 'page_view' | 'click' | 'conversion';
      path: string;
      label: string;
      bannerId?: string | null;
      section?: string | null;
      device?: 'desktop' | 'mobile' | null;
      createdAt: string;
    }>;

    const totals = {
      pageViews: 0,
      clicks: 0,
      bannerClicks: 0,
      conversions: 0,
    };

    const pageMap = new Map<string, { path: string; count: number; mobile: number; desktop: number }>();
    const clickMap = new Map<string, { label: string; section: string; count: number }>();
    const bannerMap = new Map<
      string,
      { bannerId: string; label: string; section: string; count: number; mobile: number; desktop: number }
    >();
    const conversionMap = new Map<string, { label: string; section: string; count: number }>();

    for (const ev of docs) {
      const isMobile = ev.device === 'mobile';

      if (ev.eventType === 'page_view') {
        totals.pageViews++;
        const key = ev.path || '/';
        const cur = pageMap.get(key) || { path: key, count: 0, mobile: 0, desktop: 0 };
        cur.count++;
        if (isMobile) cur.mobile++;
        else cur.desktop++;
        pageMap.set(key, cur);
      } else if (ev.eventType === 'click') {
        totals.clicks++;
        const sec = ev.section || 'general';
        const cKey = `${ev.label}::${sec}`;
        const curC = clickMap.get(cKey) || { label: ev.label, section: sec, count: 0 };
        curC.count++;
        clickMap.set(cKey, curC);

        if (ev.bannerId || ev.label.startsWith('banner:')) {
          totals.bannerClicks++;
          const bId = ev.bannerId || ev.label;
          const bKey = `${bId}::${sec}`;
          const curB = bannerMap.get(bKey) || {
            bannerId: bId,
            label: ev.label.replace(/^banner:/, ''),
            section: sec,
            count: 0,
            mobile: 0,
            desktop: 0,
          };
          curB.count++;
          if (isMobile) curB.mobile++;
          else curB.desktop++;
          bannerMap.set(bKey, curB);
        }
      } else if (ev.eventType === 'conversion') {
        totals.conversions++;
        const sec = ev.section || 'general';
        const cvKey = `${ev.label}::${sec}`;
        const curCv = conversionMap.get(cvKey) || { label: ev.label, section: sec, count: 0 };
        curCv.count++;
        conversionMap.set(cvKey, curCv);
      }
    }

    const topPages = Array.from(pageMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
    const topClicks = Array.from(clickMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
    const topBanners = Array.from(bannerMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
    const conversions = Array.from(conversionMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    return NextResponse.json({
      range: rangeKey,
      since: sinceIso,
      totals,
      topPages,
      topClicks,
      topBanners,
      conversions,
    });
  } catch (err: any) {
    console.error('Error consultando analíticas:', err);
    return NextResponse.json(
      { error: 'No se pudieron cargar las métricas de analítica.' },
      { status: 500 }
    );
  }
}
