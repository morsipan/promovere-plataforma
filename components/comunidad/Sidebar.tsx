'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Compass,
  FolderOpen,
  Globe,
  Shield,
  LogOut,
  X,
  Sparkles,
  ExternalLink,
  User as UserIcon,
  CheckCircle2,
  Phone,
  MapPin,
  Tag,
  Calendar,
} from 'lucide-react';
import type { User } from '@/payload-types';
import UserProfileItem, { formatRole } from './UserProfileItem';

export interface SidebarProps {
  /**
   * Datos del usuario obtenidos desde la sesión (Server Component).
   * Si no se especifica, UserProfileItem los consultará automáticamente vía REST.
   */
  user?: Partial<User> | any | null;
  /**
   * Estado de carga de la sesión.
   */
  loading?: boolean;
  /**
   * Control opcional de visibilidad para versión móvil.
   */
  isOpen?: boolean;
  /**
   * Función para cerrar el sidebar en dispositivos móviles.
   */
  onClose?: () => void;
  /**
   * Clases CSS complementarias.
   */
  className?: string;
}

export default function Sidebar({
  user,
  loading,
  isOpen = false,
  onClose,
  className = '',
}: SidebarProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch('/api/users/logout', {
        method: 'POST',
      });
      window.location.href = '/comunidad/login';
    } catch {
      window.location.href = '/comunidad/login';
    }
  };

  const navLinks = [
    {
      name: 'Catálogo de Destinos',
      href: '/comunidad/dashboard#representaciones',
      icon: Compass,
      description: 'Marcas y cadenas hoteleras',
    },
    {
      name: 'Promociones & Incentivos',
      href: '/comunidad/dashboard#promociones',
      icon: Tag,
      description: 'Beneficios y vigencia trade',
    },
    {
      name: 'Eventos & Capacitaciones',
      href: '/comunidad/dashboard#eventos',
      icon: Calendar,
      description: 'Webinars, workshops y videos',
    },
    {
      name: 'Recursos & Herramientas',
      href: '/comunidad/dashboard#herramientas',
      icon: FolderOpen,
      description: 'Manuales, novedades y descargas',
    },
  ];

  const isAdminOrEditor = user?.role === 'admin' || user?.role === 'editor';

  const sidebarContent = (
    <div
      suppressHydrationWarning
      className="flex flex-col h-full bg-white text-[#4d4e4f] select-none"
    >
      {/* 1. Header del Sidebar */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
        <Link
          href="/comunidad/dashboard"
          onClick={onClose}
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] flex items-center justify-center text-white shadow-md shadow-[#1b87c7]/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-[#4d4e4f] tracking-tight block leading-tight">
              Promovêre
            </span>
            <span className="text-[10px] font-bold text-[#1b87c7] uppercase tracking-wider block">
              Comunidad Trade
            </span>
          </div>
        </Link>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-[#4d4e4f] hover:bg-slate-100 transition-colors"
            aria-label="Cerrar menú lateral"
          >
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      {/* 2. Cuerpo de Navegación y Accesos Rápidos (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Sección Principal */}
        <div>
          <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Navegación Privada
          </span>
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#4d4e4f] hover:text-[#1b87c7] hover:bg-[#f0f7fc] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#1b87c7]/10 flex items-center justify-center text-slate-500 group-hover:text-[#1b87c7] transition-colors shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate leading-tight font-medium">
                      {item.name}
                    </span>
                    <span className="block text-[11px] text-slate-400 truncate font-normal">
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sección Sitios y Enlaces Externos */}
        <div>
          <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Ecosistema Promovêre
          </span>
          <div className="space-y-1">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#1b87c7] hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                Sitio Institucional
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            {isAdminOrEditor ? (
              <Link
                href="/admin"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  Panel Payload CMS
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-200 text-purple-800 font-bold uppercase">
                  Admin
                </span>
              </Link>
            ) : null}
          </div>
        </div>

        {/* Banner Trade Exclusivo */}
        <div className="mx-1 p-3.5 rounded-2xl bg-gradient-to-br from-[#113d5b] to-[#1b87c7] text-white">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3cac59] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Soporte Comercial</span>
          </div>
          <p className="text-xs text-white/90 leading-relaxed font-light">
            ¿Necesitas cotizaciones o material personalizado? Contacta a tu ejecutivo de cuentas.
          </p>
        </div>
      </div>

      {/* 3. Footer Absoluto: Perfil de Usuario (UserProfileItem) */}
      <div className="mt-auto shrink-0 relative bg-white border-t border-gray-100">
        <UserProfileItem
          user={user}
          loading={loading}
          showChevron={true}
          onClick={() => setShowProfileModal(true)}
        />
      </div>

      {/* Modal / Detalle de Perfil Interactivo al hacer clic en el UserProfileItem */}
      {showProfileModal ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-[#4d4e4f] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#1b87c7]" />
                <h3 className="font-bold text-sm text-[#4d4e4f]">Detalle de Cuenta</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Cerrar modal de perfil"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="flex items-center gap-3">
                <UserProfileItem
                  user={user}
                  loading={loading}
                  className="border-t-0 p-0 hover:bg-transparent cursor-default"
                />
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {user?.company ? (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span suppressHydrationWarning className="truncate">{user.company}</span>
                  </div>
                ) : null}
                {user?.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span suppressHydrationWarning>{user.phone}</span>
                  </div>
                ) : null}
                {user?.country ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span suppressHydrationWarning>{user.country}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3cac59] shrink-0" />
                  <span suppressHydrationWarning className="font-semibold text-slate-700">
                    {`Cuenta Verificada Trade (${formatRole(user?.role)})`}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                <span>{loggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Sidebar fijo en escritorio y tablets (>= 768px) */}
      <aside
        suppressHydrationWarning
        className={`hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 bg-white border-r border-gray-200 shadow-xs z-30 shrink-0 ${className}`}
      >
        {sidebarContent}
      </aside>

      {/* Drawer móvil con overlay (< 768px) */}
      {isOpen ? (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      ) : null}
    </>
  );
}
