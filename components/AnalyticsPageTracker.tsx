'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

/**
 * Registra visitas de página (page_view) de forma asíncrona y no bloqueante
 * en cada cambio de ruta pública del sitio.
 */
export default function AnalyticsPageTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return;
    if (lastTrackedPath.current === pathname) return;

    lastTrackedPath.current = pathname;
    trackEvent({
      eventType: 'page_view',
      path: pathname,
      label: pathname,
      section: pathname.startsWith('/blog')
        ? 'promo-news'
        : pathname.startsWith('/prensa')
        ? 'prensa'
        : pathname.startsWith('/comunidad')
        ? 'comunidad'
        : pathname === '/'
        ? 'home'
        : 'sitio',
    });
  }, [pathname]);

  return null;
}
