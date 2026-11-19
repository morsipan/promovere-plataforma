'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export interface TopProgressBarProps {
  /**
   * Variante visual de la barra superior:
   * - 'brand': degradado corporativo Azul -> Verde (#1b87c7 -> #3cac59)
   * - 'community': degradado Comunidad Verde -> Azul (#3cac59 -> #1b87c7)
   * Si se omite, se detecta automáticamente según la ruta (/comunidad).
   */
  tone?: 'brand' | 'community';
}

export default function TopProgressBar({ tone }: TopProgressBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  const isNavigatingRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);

  const resolvedTone: 'brand' | 'community' =
    tone || (pathname?.startsWith('/comunidad') ? 'community' : 'brand');

  const clearAllTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (safetyTimerRef.current !== null) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const finishProgress = useCallback(() => {
    if (!isNavigatingRef.current) return;
    isNavigatingRef.current = false;
    clearAllTimers();

    setProgress(100);
    setFadingOut(false);

    fadeTimerRef.current = window.setTimeout(() => {
      setFadingOut(true);
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        setFadingOut(false);
        setProgress(0);
      }, 300);
    }, 180);
  }, [clearAllTimers]);

  const startProgress = useCallback(() => {
    clearAllTimers();
    isNavigatingRef.current = true;
    setFadingOut(false);
    setVisible(true);
    setProgress(12);

    // Avanza de forma fluida desacelerando asintóticamente hasta 92%
    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        const remaining = 92 - prev;
        const step = Math.max(0.6, remaining * 0.14);
        return Math.min(92, prev + step);
      });
    }, 120);

    // Respaldo de seguridad por si la navegación se cancela o falla
    safetyTimerRef.current = window.setTimeout(() => {
      finishProgress();
    }, 12000);
  }, [clearAllTimers, finishProgress]);

  // Completar al detectar cambio de ruta o query params
  const searchKey = searchParams?.toString() || '';
  useEffect(() => {
    finishProgress();
  }, [pathname, searchKey, finishProgress]);

  // Interceptar clics en enlaces internos <a>
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (
        !href ||
        anchor.hasAttribute('download') ||
        (anchor.target && anchor.target !== '_self') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:')
      ) {
        return;
      }

      try {
        const currentUrl = new URL(window.location.href);
        const nextUrl = new URL(anchor.href, window.location.href);

        // Ignorar enlaces externos
        if (nextUrl.origin !== currentUrl.origin) return;

        // Ignorar navegación a la misma ruta y query (incluye cambios de solo hash)
        if (
          nextUrl.pathname === currentUrl.pathname &&
          nextUrl.search === currentUrl.search
        ) {
          return;
        }

        startProgress();
      } catch {
        // Ignorar URLs malformadas
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      clearAllTimers();
    };
  }, [startProgress, clearAllTimers]);

  if (!visible) return null;

  const barGradientClass =
    resolvedTone === 'community'
      ? 'bg-gradient-to-r from-[#3cac59] via-[#1b87c7] to-[#3cac59]'
      : 'bg-gradient-to-r from-[#1b87c7] via-[#1b87c7] to-[#3cac59]';

  const roundedPercent = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      aria-live="polite"
      aria-label={`Cargando página: ${roundedPercent}%`}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] transition-opacity duration-300 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Barra fija superior de 3px en degradado corporativo */}
      <div className="h-[3px] w-full bg-transparent overflow-hidden">
        <div
          className={`h-full ${barGradientClass} shadow-[0_0_10px_rgba(27,135,199,0.55)] transition-[width] duration-150 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Badge flotante discreto arriba a la derecha */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-5 inline-flex items-center gap-2 rounded-full bg-[#f9f9f9]/95 backdrop-blur-md border border-slate-200/90 px-3 py-1 shadow-md">
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full animate-pulse ${
            resolvedTone === 'community' ? 'bg-[#3cac59]' : 'bg-[#1b87c7]'
          }`}
        />
        <span className="font-baloo tabular-nums text-xs font-extrabold text-[#4d4e4f] leading-none">
          {roundedPercent}%
        </span>
      </div>
    </div>
  );
}
