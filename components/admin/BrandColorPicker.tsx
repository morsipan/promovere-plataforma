'use client';

import React, { useState, useEffect } from 'react';
import { useField } from '@payloadcms/ui';

interface SwatchDef {
  label: string;
  hex: string;
  border?: string;
  isTransparent?: boolean;
}

const COLOR_MAP: Record<string, SwatchDef> = {
  // Fondos y Acentos
  blancoHumo: { label: 'Blanco Humo', hex: '#f9f9f9', border: '#d1d5db' },
  blanco: { label: 'Blanco Puro', hex: '#ffffff', border: '#cbd5e1' },
  grisOscuro: { label: 'Gris Antracita', hex: '#4d4e4f' },
  oscuro: { label: 'Gris Antracita', hex: '#4d4e4f' },
  gris: { label: 'Gris Antracita', hex: '#4d4e4f' },
  verde: { label: 'Verde Corporativo', hex: '#3cac59' },
  azul: { label: 'Azul Brillante', hex: '#1b87c7' },
  transparente: { label: 'Transparente', hex: 'transparent', isTransparent: true, border: '#94a3b8' },
};

export const BrandColorPicker: React.FC<{
  path?: string;
  field?: {
    name?: string;
    label?: string;
    admin?: { description?: string };
    options?: Array<{ label: string; value: string }>;
    required?: boolean;
  };
}> = ({ path = '', field }) => {
  const { value, setValue, disabled } = useField<string>({ path });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const options = field?.options || [];
  const currentValue = typeof value === 'string' ? value : '';

  const activeDef = currentValue ? COLOR_MAP[currentValue] : null;
  const labelText = typeof field?.label === 'string' ? field.label : field?.name || '';

  return (
    <div
      suppressHydrationWarning
      style={{
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            margin: 0,
          }}
        >
          <span>{labelText}</span>
          {field?.required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>

        {mounted && activeDef && (
          <span
            suppressHydrationWarning
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0,0,0,0.06)',
              color: '#334155',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activeDef.hex,
                border: activeDef.border ? `1px solid ${activeDef.border}` : 'none',
                display: 'inline-block',
              }}
            />
            {activeDef.label}
          </span>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 0',
        }}
      >
        {options.map((opt) => {
          const def = COLOR_MAP[opt.value] || {
            label: opt.label || opt.value,
            hex: '#1b87c7',
          };
          const isSelected = currentValue === opt.value;
          const isLight = ['#ffffff', '#f9f9f9', 'transparent'].includes(def.hex);

          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => setValue(opt.value)}
              title={`${opt.label || def.label} (${def.hex})`}
              style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: def.isTransparent ? 'transparent' : def.hex,
                border: def.border ? `1px solid ${def.border}` : '1px solid rgba(0,0,0,0.12)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSelected
                  ? `0 0 0 2px #ffffff, 0 0 0 4px #1b87c7`
                  : '0 1px 2px rgba(0,0,0,0.06)',
                transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                transition: 'all 0.15s ease-in-out',
                backgroundImage: def.isTransparent
                  ? 'repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 50% / 10px 10px'
                  : 'none',
              }}
            >
              {isSelected && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isLight ? '#4d4e4f' : '#ffffff'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {field?.admin?.description && (
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
          {field.admin.description}
        </p>
      )}
    </div>
  );
};

export default BrandColorPicker;
