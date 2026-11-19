'use client';

import React from 'react';

export const Icon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#promovere-dashboard-grad)"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Panel de Control Promovêre"
      style={{
        display: 'block',
        width: '18px',
        height: '18px',
        minWidth: '18px',
        minHeight: '18px',
        flexShrink: 0,
      }}
    >
      <defs>
        <linearGradient id="promovere-dashboard-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2da0e6" />
          <stop offset="100%" stopColor="#3cac59" />
        </linearGradient>
      </defs>
      <rect width="7" height="9" x="3" y="3" rx="1.5" />
      <rect width="7" height="5" x="14" y="3" rx="1.5" />
      <rect width="7" height="9" x="14" y="12" rx="1.5" />
      <rect width="7" height="5" x="3" y="16" rx="1.5" />
    </svg>
  );
};

export default Icon;
