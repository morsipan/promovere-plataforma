'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, Building2, Sparkles } from 'lucide-react';
import type { User } from '@/payload-types';
import Sidebar from './comunidad/Sidebar';
import LogoutButton from './comunidad/LogoutButton';
import { getAvatarUrl, getInitial, formatRole } from './comunidad/UserProfileItem';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: Partial<User> | any | null;
  loading?: boolean;
}

export default function DashboardLayout({
  children,
  user,
  loading,
}: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const avatarUrl = !avatarError ? getAvatarUrl(user?.avatar) : null;
  const initialLetter = getInitial(user?.name, user?.email);
  const roleFormatted = formatRole(user?.role);
  const displayName = user?.name?.trim() || user?.email?.trim() || 'Usuario';

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen bg-[#f8fafc] text-[#4d4e4f] flex"
    >
      {/* Barra lateral / Sidebar con UserProfileItem en el footer absoluto */}
      <Sidebar
        user={user}
        loading={loading}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Área de contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior de navegación / Header */}
        <header
          suppressHydrationWarning
          className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {/* Botón menú móvil (< 768px) */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden flex items-center gap-1.5 p-2 rounded-xl text-slate-600 hover:text-[#4d4e4f] hover:bg-slate-100 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5 text-[#1b87c7]" />
              <span className="text-xs font-bold text-slate-700">Menú</span>
            </button>

            {/* Identidad en versión móvil */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] flex items-center justify-center text-white shadow-xs">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-[#4d4e4f] text-sm">Promovêre</span>
            </div>

            {/* Título contextual en versión escritorio (>= 768px) */}
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#3cac59]" />
              <span>Portal Privado de la Comunidad Trade</span>
            </div>
          </div>

          {/* Acciones de cabecera & Perfil Activo */}
          <div className="flex items-center gap-3">
            {/* Badge de Perfil / Avatar en Header */}
            {user ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => setMobileSidebarOpen(true)}
                title={`Sesión activa: ${displayName}`}
                className="flex items-center gap-2.5 py-1 px-2 sm:px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-all cursor-pointer select-none group"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                    onError={() => setAvatarError(true)}
                    unoptimized={true}
                  />
                ) : (
                  <div
                    suppressHydrationWarning
                    className="w-8 h-8 rounded-full bg-[#3cac59] text-white flex items-center justify-center font-bold font-baloo text-xs shrink-0 shadow-xs"
                  >
                    {initialLetter}
                  </div>
                )}
                <div className="hidden sm:flex flex-col text-left">
                  <span
                    suppressHydrationWarning
                    className="font-roboto font-semibold text-xs text-[#4d4e4f] max-w-[120px] truncate leading-tight group-hover:text-black"
                  >
                    {displayName}
                  </span>
                  <span
                    suppressHydrationWarning
                    className="text-[10px] font-bold text-[#3cac59] leading-tight"
                  >
                    {roleFormatted}
                  </span>
                </div>
              </div>
            ) : null}

            <LogoutButton />
          </div>
        </header>

        {/* Contenido inyectado */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
