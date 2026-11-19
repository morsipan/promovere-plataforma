'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '@payloadcms/ui';
import { formatBlobUrl } from '@/lib/blob';

export interface AdminSidebarUserProps {
  user?: any;
}

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

function getInitial(name?: string | null, email?: string | null): string {
  if (name && typeof name === 'string' && name.trim().length > 0) {
    return name.trim().charAt(0).toUpperCase();
  }
  if (email && typeof email === 'string' && email.trim().length > 0) {
    return email.trim().charAt(0).toUpperCase();
  }
  return 'U';
}

function formatRole(role?: string | null): string {
  if (!role || typeof role !== 'string') return 'Usuario';
  const roles: Record<string, string> = {
    admin: 'Administrador',
    editor: 'Editor',
    mayorista: 'Mayorista',
    minorista: 'Minorista',
  };
  const key = role.toLowerCase();
  return roles[key] || role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

/**
 * Credencial minimalista de usuario ubicada en la parte inferior del sidebar del Admin Panel.
 * Sin colores estridentes — adaptada 100% a los tokens monocromáticos del tema de Payload CMS.
 */
export const AdminSidebarUser: React.FC<AdminSidebarUserProps> = ({ user: propUser }) => {
  const { user: authUser } = useAuth();
  const currentUser = authUser || propUser;

  const [imageError, setImageError] = useState(false);
  const [resolvedAvatarUrl, setResolvedAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const directUrl = extractAvatarUrl(currentUser.avatar);
    if (directUrl) {
      setResolvedAvatarUrl(directUrl);
      setImageError(false);
      return;
    }

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

  if (!currentUser) {
    return null;
  }

  const displayName = currentUser.name?.trim() || currentUser.email?.split('@')[0] || 'Usuario';
  const displayEmail = currentUser.email?.trim() || '';
  const initialLetter = getInitial(currentUser.name, currentUser.email);
  const formattedRole = formatRole(currentUser.role);
  const showAvatarImage = Boolean(resolvedAvatarUrl && !imageError);

  return (
    <div className="promovere-sidebar-user-wrap" suppressHydrationWarning>
      <div
        suppressHydrationWarning
        style={{
          margin: '12px 0 4px 0',
          padding: '12px',
          borderRadius: '10px',
          backgroundColor: 'var(--theme-elevation-50)',
          border: '1px solid var(--theme-elevation-150)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          color: 'var(--theme-text)',
          fontFamily: 'inherit',
        }}
      >
        {/* Identidad minimalista: Avatar/Inicial + Nombre, Correo y Rol */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{ flexShrink: 0 }}>
            {showAvatarImage ? (
              <img
                src={resolvedAvatarUrl!}
                alt={displayName}
                onError={() => setImageError(true)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--theme-elevation-200)',
                  display: 'block',
                }}
              />
            ) : (
              <div
                suppressHydrationWarning
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--theme-elevation-200)',
                  color: 'var(--theme-text)',
                  border: '1px solid var(--theme-elevation-300)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                {initialLetter}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <span
              suppressHydrationWarning
              title={displayName}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--theme-text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.25,
              }}
            >
              {displayName}
            </span>

            {displayEmail ? (
              <span
                suppressHydrationWarning
                title={displayEmail}
                style={{
                  fontSize: '11px',
                  color: 'var(--theme-elevation-500)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.25,
                  marginTop: '1px',
                }}
              >
                {displayEmail}
              </span>
            ) : null}

            <span
              suppressHydrationWarning
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--theme-elevation-600)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginTop: '3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {formattedRole}
            </span>
          </div>
        </div>

        {/* Acciones minimalistas: Configurar + Salir */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            paddingTop: '8px',
            borderTop: '1px solid var(--theme-elevation-150)',
          }}
        >
          <Link
            href="/admin/account"
            title="Configurar mis datos"
            aria-label="Configurar mis datos"
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '6px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 500,
              textDecoration: 'none',
              color: 'var(--theme-text)',
              backgroundColor: 'var(--theme-elevation-100)',
              border: '1px solid var(--theme-elevation-200)',
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--theme-elevation-150)';
              e.currentTarget.style.borderColor = 'var(--theme-elevation-300)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)';
              e.currentTarget.style.borderColor = 'var(--theme-elevation-200)';
            }}
          >
            <Settings size={13} style={{ flexShrink: 0, opacity: 0.75 }} />
            <span>Perfil</span>
          </Link>

          <Link
            href="/admin/logout"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '6px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 500,
              textDecoration: 'none',
              color: 'var(--theme-elevation-600)',
              backgroundColor: 'transparent',
              border: '1px solid var(--theme-elevation-200)',
              transition: 'background-color 0.15s ease, color 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--theme-elevation-150)';
              e.currentTarget.style.color = 'var(--theme-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--theme-elevation-600)';
            }}
          >
            <LogOut size={13} style={{ flexShrink: 0, opacity: 0.75 }} />
            <span>Salir</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebarUser;
