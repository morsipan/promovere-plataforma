import React from 'react';
import type { AdminViewServerProps } from 'payload';
import { DefaultTemplate } from '@payloadcms/next/templates';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';

export const AdminAnalyticsView: React.FC<AdminViewServerProps> = ({
  initPageResult,
  params,
  searchParams,
}) => {
  const user = initPageResult?.req?.user as any;
  const role = user?.role;
  const isAuthorized = Boolean(role && ['admin', 'editor'].includes(role));

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      {isAuthorized ? (
        <AdminAnalyticsDashboard />
      ) : (
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
            Acceso restringido
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--theme-elevation-600)' }}>
            El panel de analíticas está disponible únicamente para administradores y editores.
          </p>
        </div>
      )}
    </DefaultTemplate>
  );
};

export default AdminAnalyticsView;
