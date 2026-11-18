'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { User, Media } from '@/payload-types';

export interface UserProfileItemProps {
  /**
   * Datos del usuario obtenidos de la sesión (Server Component o prop).
   * Si no se proporciona o es undefined, el componente consulta `/api/users/me`.
   */
  user?: Partial<User> | null;
  /**
   * Estado de carga explícito si se controla externamente.
   */
  loading?: boolean;
  /**
   * Acción opcional al hacer clic en el perfil (ej. abrir modal de perfil o navegar).
   */
  onClick?: () => void;
  /**
   * Clases CSS adicionales para el contenedor.
   */
  className?: string;
  /**
   * Si se muestra un indicador visual o acción adicional (ej. menú desplegable / chevron).
   */
  showChevron?: boolean;
}

/**
 * Extrae la URL de la imagen del avatar en base al tipo de dato (Media, string o null).
 */
export function getAvatarUrl(avatar: (number | null) | Media | string | undefined): string | null {
  if (!avatar) return null;
  if (typeof avatar === 'string' && avatar.trim().length > 0) {
    return avatar;
  }
  if (typeof avatar === 'object' && avatar !== null) {
    if (avatar.url && typeof avatar.url === 'string') {
      return avatar.url;
    }
    if (avatar.filename && typeof avatar.filename === 'string') {
      return `/api/media/file/${avatar.filename}`;
    }
  }
  return null;
}

/**
 * Obtiene la inicial en mayúscula a partir del nombre (o email si no hay nombre).
 */
export function getInitial(name?: string | null, email?: string | null): string {
  if (name && name.trim().length > 0) {
    return name.trim().charAt(0).toUpperCase();
  }
  if (email && email.trim().length > 0) {
    return email.trim().charAt(0).toUpperCase();
  }
  return 'U';
}

/**
 * Formatea y capitaliza el rol del usuario (ej. "Mayorista", "Admin").
 */
export function formatRole(role?: string | null): string {
  if (!role) return 'Usuario';
  const roleNames: Record<string, string> = {
    admin: 'Admin',
    editor: 'Editor',
    mayorista: 'Mayorista',
    minorista: 'Minorista',
  };
  const lower = role.toLowerCase();
  return roleNames[lower] || (role.charAt(0).toUpperCase() + role.slice(1).toLowerCase());
}

/**
 * Bloque de perfil de usuario para el footer del Sidebar de la Comunidad Promovêre.
 */
export default function UserProfileItem({
  user: initialUser,
  loading: externalLoading,
  onClick,
  className = '',
  showChevron = false,
}: UserProfileItemProps) {
  const [user, setUser] = useState<Partial<User> | null>(initialUser ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(
    externalLoading ?? (initialUser === undefined)
  );
  const [imageError, setImageError] = useState<boolean>(false);

  // Sincronizar o cargar sesión del usuario si no se proveyó inicialmente
  useEffect(() => {
    if (initialUser !== undefined) {
      setUser(initialUser);
      setIsLoading(false);
      setImageError(false);
      return;
    }

    let isMounted = true;
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('No hay sesión activa');
        }

        const data = await res.json();
        if (isMounted) {
          setUser(data?.user || null);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, [initialUser]);

  // Si se provee control de loading externo, sincronizarlo
  useEffect(() => {
    if (externalLoading !== undefined) {
      setIsLoading(externalLoading);
    }
  }, [externalLoading]);

  // Estado de carga (Skeleton Loading)
  if (isLoading) {
    return (
      <div
        className={`w-full border-t border-gray-200 p-4 flex items-center gap-3 animate-pulse bg-white/50 ${className}`}
        aria-busy="true"
        aria-label="Cargando perfil de usuario"
      >
        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="h-4 bg-slate-200 rounded w-28" />
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="h-3 bg-slate-200 rounded w-36" />
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <div
        className={`w-full border-t border-gray-200 p-4 flex items-center gap-3 text-slate-400 text-xs italic ${className}`}
      >
        <span>Sesión no disponible</span>
      </div>
    );
  }

  const avatarUrl = !imageError ? getAvatarUrl(user.avatar) : null;
  const initialLetter = getInitial(user.name, user.email);
  const formattedRole = formatRole(user.role);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      title={`Perfil de ${user.name || user.email}`}
      className={`w-full border-t border-gray-200 p-4 hover:bg-[#f9f9f9] transition-colors cursor-pointer flex items-center gap-3 select-none text-left group ${className}`}
    >
      {/* A. Lógica del Avatar (Fallback) */}
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={user.name || 'Foto de perfil'}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover shrink-0"
          onError={() => setImageError(true)}
          unoptimized={avatarUrl.startsWith('/api/') || avatarUrl.startsWith('data:')}
        />
      ) : (
        <div
          className="w-10 h-10 rounded-full bg-[#3cac59] text-white flex items-center justify-center font-bold font-baloo shrink-0 text-base"
          aria-hidden="true"
        >
          {initialLetter}
        </div>
      )}

      {/* B. Datos del Usuario */}
      <div className="flex flex-col min-w-0 flex-1">
        {/* Nombre */}
        <span className="font-roboto font-semibold text-sm text-[#4d4e4f] truncate leading-tight group-hover:text-black transition-colors">
          {user.name || user.email || 'Usuario'}
        </span>

        {/* Rol */}
        <span className="text-xs font-medium text-[#3cac59] leading-tight mt-0.5">
          {formattedRole}
        </span>

        {/* Email */}
        <span
          className="text-xs text-gray-500 truncate leading-tight mt-0.5"
          title={user.email || ''}
        >
          {user.email || ''}
        </span>
      </div>

      {/* Indicador opcional de interactividad */}
      {showChevron && (
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-[#1b87c7] transition-colors shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
}
