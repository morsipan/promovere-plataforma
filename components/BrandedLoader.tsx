'use client';

import React, { useState, useEffect } from 'react';

export interface BrandedLoaderProps {
  /** Mensaje descriptivo debajo de la barra (tipografía Roboto) */
  message?: string;
  /** Etiqueta superior opcional */
  eyebrow?: string;
  /** Si es true, ocupa toda la pantalla; si es false, se adapta al contenedor */
  fullScreen?: boolean;
  /** Clases CSS adicionales */
  className?: string;
}

export default function BrandedLoader({
  message = 'Cargando plataforma Promovêre...',
  eyebrow = 'Preparando contenido',
  fullScreen = true,
  className = '',
}: BrandedLoaderProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Avanza de forma suave desde 0% hasta 95% desacelerando progresivamente
    const timer = window.setInterval(() => {
      setPercent((prev) => {
        if (prev >= 95) {
          window.clearInterval(timer);
          return 95;
        }
        const remaining = 95 - prev;
        const step = Math.max(1, Math.ceil(remaining * 0.12));
        return Math.min(95, prev + step);
      });
    }, 85);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${message} ${percent}%`}
      className={`${
        fullScreen ? 'min-h-screen' : 'min-h-[340px]'
      } w-full bg-[#f9f9f9] flex flex-col items-center justify-center px-6 py-12 ${className}`}
    >
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center text-center">
        {/* Isotipo / Logotipo oficial de marca */}
        <div className="mb-6 relative">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#1b87c7]/15 to-[#3cac59]/15 blur-2xl animate-pulse"
          />
          <img
            src="/assets/SVG/logo-principal.svg"
            alt="Promovêre"
            className="relative h-12 sm:h-14 w-auto object-contain select-none"
          />
        </div>

        {/* Porcentaje animado en Baloo Da 2 */}
        <div className="mb-3 flex items-baseline justify-center gap-1">
          <span className="font-baloo tabular-nums text-3xl sm:text-4xl font-extrabold text-[#4d4e4f] tracking-tight leading-none">
            {percent}%
          </span>
        </div>

        {/* Barra de progreso horizontal en degradado corporativo */}
        <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden shadow-inner mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1b87c7] to-[#3cac59] transition-[width] duration-150 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Mensajes en Roboto */}
        {eyebrow && (
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#1b87c7] mb-1">
            {eyebrow}
          </span>
        )}
        <p className="font-sans text-xs sm:text-sm text-[#4d4e4f]/75 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
