'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '@payloadcms/ui';
import { formatBlobUrl } from '@/lib/blob';

export interface AdminSidebarUserProps {
  user?: any;
}

/**
 * Extrae la URL de imagen a partir de un objeto Media, string o relación.
 */
function extractAvatarUrl(avatar: any): string | null {
  if (!avatar) return null;

  if (typeof avatar === 'string' && avatar.trim().length > 0) {
    return formatBlobUrl(avatar.trim());
  }

  if (typeof avatar === 'object' && avatar !== null) {
    if (avatar.url && typeof avatar.url === 'string' && avatar.url.trim().length > 0) {
      return formatBlobUrl(avatar.url.trim());
    }
    if (avatar.filename && typeof avatar.filename === 'string' && avatar.filename.trim().length > 0) {
      return `/api/media/file/${avatar.filename.trim()}`;
    }
  }

  return null;
}

/**
 * Obtiene la inicial en mayúscula a partir del nombre o email.
 */
function getInitial(name?: string | null, email?: string | null): string {
  if (name && typeof name === 'string' && name.trim().length > 0) {
    return name.trim().charAt(0).toUpperCase();
  }
  if (email && typeof email === 'string' && email.trim().length > 0) {
    return email.trim().charAt(0).toUpperCase();
  }
  return 'U';
}

/**
 * Formatea y traduce el rol del usuario para el CMS de Promovêre.
 */
function formatRole(role?: string | null): string {
  if (!role || typeof role !== 'string') return 'Usuario';
  const roles: Record<string, string> = {
    admin: 'Administrador',
    editor: 'Editor de Contenidos',
    mayorista: 'Operador Mayorista',
    minorista: 'Agencia Minorista',
  };
  const key = role.toLowerCase();
  return roles[key] || (role.charAt(0).toUpperCase() + role.slice(1).toLowerCase());
}

/**
 * Componente de Perfil de Usuario para el Sidebar del Panel de Administración de Promovêre CMS.
 * Muestra avatar (o inicial), nombre de usuario, correo, rol, ruedita de configuración de datos y botón de salir.
 */
export const AdminSidebarUser: React.FC<AdminSidebarUserProps> = ({ user: propUser }) => {
  const { user: authUser } = useAuth();
  const currentUser = authUser || propUser;

  const [imageError, setImageError] = useState(false);
  const [resolvedAvatarUrl, setResolvedAvatarUrl] = useState<string | null>(null);

  // Resolver la URL del avatar según el formato recibido
  useEffect(() => {
    if (!currentUser) return;

    const directUrl = extractAvatarUrl(currentUser.avatar);
    if (directUrl) {
      setResolvedAvatarUrl(directUrl);
      setImageError(false);
      return;
    }

    // Si es un ID numérico de la colección Media, consultarlo vía API
    if (typeof currentUser.avatar === 'number') {
      fetch(`/api/media/${currentUser.avatar}`)
        .then((res) => {
          if (!res.ok) throw new Error('Media no encontrada');
          return res.json();
        })
        .then((data) => {
          const fetchedUrl = extractAvatarUrl(data);
          if (fetchedUrl) {
            setResolvedAvatarUrl(fetchedUrl);
            setImageError(false);
          }
        })
        .catch(() => {
          setResolvedAvatarUrl(null);
        });
    } else {
      setResolvedAvatarUrl(null);
    }
  }, [currentUser]);

  // Si no hay usuario cargado en la sesión
  if (!currentUser) {
    return null;
  }

  const displayName = currentUser.name?.trim() || currentUser.email?.split('@')[0] || 'Usuario';
  const displayEmail = currentUser.email?.trim() || '';
  const initialLetter = getInitial(currentUser.name, currentUser.email);
  const formattedRole = formatRole(currentUser.role);
  const showAvatarImage = Boolean(resolvedAvatarUrl && !imageError);

  return (
    <div
      suppressHydrationWarning
      style={{
        margin: '0 0 16px 0',
        padding: '12px',
        borderRadius: '14px',
        backgroundColor: 'var(--theme-elevation-50, #f8fafc)',
        border: '1px solid var(--theme-elevation-150, #e2e8f0)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        color: 'var(--theme-text, #1e293b)',
        fontFamily: 'inherit',
      }}
    >
      {/* 1. Fila de Identidad: Avatar + Datos (Nombre, Correo, Rol) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {/* Avatar / Inicial de Fallback */}
        <div style={{ flexShrink: 0 }}>
          {showAvatarImage ? (
            <img
              src={resolvedAvatarUrl!}
              alt={displayName}
              onError={() => setImageError(true)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(60, 172, 89, 0.4)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'block',
              }}
            />
          ) : (
            <div
              suppressHydrationWarning
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3cac59',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '16px',
                boxShadow: '0 1px 3px rgba(60, 172, 89, 0.3)',
                flexShrink: 0,
              }}
            >
              {initialLetter}
            </div>
          )}
        </div>

        {/* Nombre, Correo y Rol */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Nombre de usuario */}
          <span
            suppressHydrationWarning
            title={displayName}
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--theme-text, #1e293b)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.2,
            }}
          >
            {displayName}
          </span>

          {/* Correo electrónico */}
          {displayEmail ? (
            <span
              suppressHydrationWarning
              title={displayEmail}
              style={{
                fontSize: '11px',
                color: 'var(--theme-elevation-500, #64748b)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2,
                marginTop: '2px',
              }}
            >
              {displayEmail}
            </span>
          ) : null}

          {/* Rol del usuario */}
          <div style={{ marginTop: '4px' }}>
            <span
              suppressHydrationWarning
              style={{
                display: 'inline-block',
                padding: '1px 7px',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: 700,
                lineHeight: 1.3,
                backgroundColor: 'rgba(60, 172, 89, 0.12)',
                color: '#24733b',
                border: '1px solid rgba(60, 172, 89, 0.25)',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {formattedRole}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Barra de Acciones: Rueda de Configuración de Datos + Botón de Salir */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px solid var(--theme-elevation-150, rgba(0, 0, 0, 0.06))',
        }}
      >
        {/* Ruedita de Configuración de sus datos (Acceso a /admin/account) */}
        <Link
          href="/admin/account"
          title="Configurar mis datos y perfil"
          aria-label="Configurar mis datos"
          style={{
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 600,
            textDecoration: 'none',
            color: 'var(--theme-text, #334155)',
            backgroundColor: 'var(--theme-elevation-100, #ffffff)',
            border: '1px solid var(--theme-elevation-200, #cbd5e1)',
            transition: 'all 0.15s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--theme-elevation-150, #f1f5f9)';
            e.currentTarget.style.color = '#1b87c7';
            e.currentTarget.style.borderColor = '#1b87c7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100, #ffffff)';
            e.currentTarget.style.color = 'var(--theme-text, #334155)';
            e.currentTarget.style.borderColor = 'var(--theme-elevation-200, #cbd5e1)';
          }}
        >
          <Settings size={14} style={{ color: '#1b87c7', flexShrink: 0 }} />
          <span>Configurar</span>
        </Link>

        {/* Botón de salir del panel (al lado de la rueda de configuración) */}
        <Link
          href="/admin/logout"
          title="Cerrar sesión y salir del panel"
          aria-label="Salir del panel de administración"
          style={{
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 600,
            textDecoration: 'none',
            color: '#dc2626',
            backgroundColor: 'var(--theme-elevation-100, #ffffff)',
            border: '1px solid var(--theme-elevation-200, #cbd5e1)',
            transition: 'all 0.15s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
            e.currentTarget.style.borderColor = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100, #ffffff)';
            e.currentTarget.style.borderColor = 'var(--theme-elevation-200, #cbd5e1)';
          }}
        >
          <LogOut size={14} style={{ color: '#dc2626', flexShrink: 0 }} />
          <span>Salir</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebarUser;
