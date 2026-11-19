'use client';

import React, { useState, useEffect, useRef } from 'react';

const ADMIN_REMEMBERED_EMAIL_KEY = 'promovere_admin_remembered_email';

/**
 * Componente "Recordar mi cuenta" para la pantalla de Login del Panel de Administración (/admin/login).
 * Pre-completa el correo electrónico guardado en el formulario de Payload CMS y lo actualiza al iniciar sesión.
 */
export const AdminRememberMe: React.FC = () => {
  const [remember, setRemember] = useState(false);
  const rememberRef = useRef(false);

  useEffect(() => {
    rememberRef.current = remember;
  }, [remember]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Pre-cargar el correo recordado si existe en localStorage
    try {
      const savedEmail = window.localStorage.getItem(ADMIN_REMEMBERED_EMAIL_KEY);
      if (savedEmail) {
        setRemember(true);
        rememberRef.current = true;

        const fillEmailInput = () => {
          const emailInput = document.querySelector<HTMLInputElement>(
            'input#field-email, input[name="email"]'
          );
          if (emailInput && !emailInput.value) {
            const nativeSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              'value'
            )?.set;
            nativeSetter?.call(emailInput, savedEmail);
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            emailInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        };

        // Intentar inmediatamente y tras un breve tick por si el form de Payload termina de montar
        fillEmailInput();
        const timer = window.setTimeout(fillEmailInput, 150);

        return () => window.clearTimeout(timer);
      }
    } catch {
      // localStorage no disponible
    }
  }, []);

  // 2. Guardar o eliminar el correo al enviar el formulario de login
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFormSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement | null;
      if (!form) return;

      const emailInput = form.querySelector<HTMLInputElement>(
        'input#field-email, input[name="email"]'
      );
      if (!emailInput) return;

      try {
        if (rememberRef.current && emailInput.value.trim()) {
          window.localStorage.setItem(ADMIN_REMEMBERED_EMAIL_KEY, emailInput.value.trim());
        } else if (!rememberRef.current) {
          window.localStorage.removeItem(ADMIN_REMEMBERED_EMAIL_KEY);
        }
      } catch {
        // Ignorar errores de storage
      }
    };

    document.addEventListener('submit', handleFormSubmit, true);
    return () => document.removeEventListener('submit', handleFormSubmit, true);
  }, []);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRemember(checked);
    rememberRef.current = checked;

    if (!checked) {
      try {
        window.localStorage.removeItem(ADMIN_REMEMBERED_EMAIL_KEY);
      } catch {
        // Ignorar
      }
    } else {
      const emailInput = document.querySelector<HTMLInputElement>(
        'input#field-email, input[name="email"]'
      );
      if (emailInput?.value?.trim()) {
        try {
          window.localStorage.setItem(ADMIN_REMEMBERED_EMAIL_KEY, emailInput.value.trim());
        } catch {
          // Ignorar
        }
      }
    }
  };

  return (
    <div
      suppressHydrationWarning
      style={{
        marginTop: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderRadius: '8px',
        backgroundColor: 'var(--theme-elevation-50, #f8fafc)',
        border: '1px solid var(--theme-elevation-150, #e2e8f0)',
      }}
    >
      <label
        htmlFor="admin-remember-me"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--theme-text, #4d4e4f)',
          margin: 0,
          userSelect: 'none',
        }}
      >
        <input
          id="admin-remember-me"
          type="checkbox"
          checked={remember}
          onChange={handleToggle}
          style={{
            width: '16px',
            height: '16px',
            accentColor: '#1b87c7',
            cursor: 'pointer',
            margin: 0,
          }}
        />
        <span>Recordar mi cuenta en este dispositivo</span>
      </label>
    </div>
  );
};

export default AdminRememberMe;
