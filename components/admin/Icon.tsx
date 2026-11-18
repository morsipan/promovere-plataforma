'use client';

import React from 'react';

export const Icon: React.FC = () => {
  return (
    <div
      suppressHydrationWarning
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #1b87c7 0%, #3cac59 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: 900,
        fontSize: '15px',
        flexShrink: 0,
      }}
    >
      P
    </div>
  );
};

export default Icon;
