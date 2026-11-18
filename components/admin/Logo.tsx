'use client';

import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div
      suppressHydrationWarning
      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}
    >
      <div
        suppressHydrationWarning
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1b87c7 0%, #3cac59 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '22px',
          boxShadow: '0 4px 14px rgba(27, 135, 199, 0.3)',
          flexShrink: 0,
        }}
      >
        P
      </div>
      <div
        suppressHydrationWarning
        style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}
      >
        <span
          suppressHydrationWarning
          style={{
            fontSize: '22px',
            fontWeight: 900,
            color: '#4d4e4f',
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
          }}
        >
          Promovêre
        </span>
        <span
          suppressHydrationWarning
          style={{
            fontSize: '10px',
            fontWeight: 800,
            color: '#1b87c7',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            marginTop: '3px',
          }}
        >
          Panel de Administración
        </span>
      </div>
    </div>
  );
};

export default Logo;
