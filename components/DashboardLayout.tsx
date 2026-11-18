'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Building2, Sparkles } from 'lucide-react';
import type { User } from '@/payload-types';
import Sidebar from './comunidad/Sidebar';
import LogoutButton from './comunidad/LogoutButton';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: Partial<User> | null;
  loading?: boolean;
}

export default function DashboardLayout({
  children,
  user,
  loading,
}: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#4d4e4f] flex">
      {/* Barra lateral / Sidebar con UserProfileItem en el footer absoluto */}
      <Sidebar
        user={user}
        loading={loading}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Área de contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior de navegación / Mobile header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Botón menú móvil */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-[#4d4e4f] hover:bg-slate-100 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Identidad en versión móvil */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-[#4d4e4f] text-sm">Promovêre</span>
            </div>

            {/* Título contextual en versión escritorio */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#3cac59]" />
              <span>Portal Privado de la Comunidad Trade</span>
            </div>
          </div>

          {/* Acciones de cabecera */}
          <div className="flex items-center gap-3">
            {user?.role && (
              <span
                suppressHydrationWarning
                className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#3cac59]/10 text-[#3cac59] border border-[#3cac59]/20 capitalize"
              >
                {user.role}
              </span>
            )}
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
