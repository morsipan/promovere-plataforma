'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  MousePointerClick,
  Eye,
  TrendingUp,
  Image as ImageIcon,
  RefreshCw,
  Monitor,
  Smartphone,
} from 'lucide-react';

interface AnalyticsSummary {
  range: string;
  since: string;
  totals: {
    pageViews: number;
    clicks: number;
    bannerClicks: number;
    conversions: number;
  };
  topPages: Array<{ path: string; count: number; mobile: number; desktop: number }>;
  topClicks: Array<{ label: string; section: string; count: number }>;
  topBanners: Array<{
    bannerId: string;
    label: string;
    section: string;
    count: number;
    mobile: number;
    desktop: number;
  }>;
  conversions: Array<{ label: string; section: string; count: number }>;
}

const RANGES: Array<{ value: '7d' | '30d' | '90d'; label: string }> = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
];

export const AdminAnalyticsDashboard: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (selectedRange: '7d' | '30d' | '90d') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics/summary?range=${selectedRange}`, {
        credentials: 'include',
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error('No se pudieron obtener las métricas.');
      }
      const json = (await res.json()) as AnalyticsSummary;
      setData(json);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar analíticas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(range);
  }, [range, loadData]);

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--theme-elevation-0, #ffffff)',
    border: '1px solid var(--theme-elevation-150, #e5e7eb)',
    borderRadius: '14px',
    padding: '20px',
  };

  const kpis = [
    {
      label: 'Visitas de Páginas',
      value: data?.totals.pageViews ?? 0,
      accent: '#1b87c7',
      icon: Eye,
    },
    {
      label: 'Clics Registrados',
      value: data?.totals.clicks ?? 0,
      accent: '#4d4e4f',
      icon: MousePointerClick,
    },
    {
      label: 'Clics en Banners',
      value: data?.totals.bannerClicks ?? 0,
      accent: '#3cac59',
      icon: ImageIcon,
    },
    {
      label: 'Conversiones',
      value: data?.totals.conversions ?? 0,
      accent: '#3cac59',
      icon: TrendingUp,
    },
  ];

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '28px 24px 56px',
        fontFamily: "'Roboto', system-ui, -apple-system, sans-serif",
        color: 'var(--theme-text, #4d4e4f)',
      }}
    >
      {/* Encabezado y selector de rango */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(27, 135, 199, 0.1)',
              color: '#1b87c7',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            <BarChart3 size={14} />
            <span>Panel de Analíticas Promovêre</span>
          </div>
          <h1
            style={{
              fontFamily: "'Baloo Da 2', system-ui, sans-serif",
              fontSize: '28px',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Tráfico, Clics, Banners y Conversiones
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--theme-elevation-600, #64748b)',
              margin: '4px 0 0',
            }}
          >
            Datos reales registrados automáticamente en el sitio público y la Comunidad (solo visible para Admin y Editor).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {RANGES.map((r) => {
            const active = range === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setRange(r.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: active ? '1px solid #1b87c7' : '1px solid var(--theme-elevation-200, #d1d5db)',
                  backgroundColor: active ? '#1b87c7' : 'var(--theme-elevation-0, #ffffff)',
                  color: active ? '#ffffff' : 'var(--theme-text, #4d4e4f)',
                  transition: 'all 0.15s ease',
                }}
              >
                {r.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => void loadData(range)}
            disabled={loading}
            title="Actualizar métricas"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              border: '1px solid var(--theme-elevation-200, #d1d5db)',
              backgroundColor: 'var(--theme-elevation-50, #f9f9f9)',
              color: 'var(--theme-text, #4d4e4f)',
            }}
          >
            <RefreshCw size={14} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {error ? (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#b91c1c',
            fontSize: '13px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      ) : null}

      {/* 4 KPIs Principales */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} style={cardStyle}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--theme-elevation-600, #64748b)',
                  }}
                >
                  {kpi.label}
                </span>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: `${kpi.accent}18`,
                    color: kpi.accent,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} />
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'Baloo Da 2', system-ui, sans-serif",
                  fontSize: '32px',
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {loading && !data ? '—' : kpi.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Tablas / Rankings */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '20px',
        }}
      >
        {/* 1. Páginas con mayor tráfico */}
        <section style={cardStyle}>
          <h2
            style={{
              fontFamily: "'Baloo Da 2', system-ui, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              margin: '0 0 14px',
              borderLeft: '3px solid #1b87c7',
              paddingLeft: '10px',
            }}
          >
            Páginas con Mayor Tráfico
          </h2>
          {!data || data.topPages.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500, #64748b)', margin: 0 }}>
              Sin visitas registradas todavía en este período.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.topPages.map((row) => {
                const max = data.topPages[0]?.count || 1;
                const pct = Math.max(4, Math.round((row.count / max) * 100));
                return (
                  <div key={row.path}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        marginBottom: '4px',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontWeight: 500, wordBreak: 'break-all' }}>{row.path}</span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px',
                          flexShrink: 0,
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ color: 'var(--theme-elevation-500)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Monitor size={12} /> {row.desktop}
                        </span>
                        <span style={{ color: 'var(--theme-elevation-500)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Smartphone size={12} /> {row.mobile}
                        </span>
                        <strong style={{ color: '#1b87c7' }}>{row.count}</strong>
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '9999px', backgroundColor: 'var(--theme-elevation-100, #f1f5f9)' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: '9999px', backgroundColor: '#1b87c7' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 2. Lugares con más clics */}
        <section style={cardStyle}>
          <h2
            style={{
              fontFamily: "'Baloo Da 2', system-ui, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              margin: '0 0 14px',
              borderLeft: '3px solid #4d4e4f',
              paddingLeft: '10px',
            }}
          >
            Lugares con Más Clics
          </h2>
          {!data || data.topClicks.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500, #64748b)', margin: 0 }}>
              Sin clics registrados todavía en este período.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.topClicks.map((row) => {
                const max = data.topClicks[0]?.count || 1;
                const pct = Math.max(4, Math.round((row.count / max) * 100));
                return (
                  <div key={`${row.label}-${row.section}`}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        marginBottom: '4px',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{row.label}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            backgroundColor: 'var(--theme-elevation-100, #f1f5f9)',
                          }}
                        >
                          {row.section}
                        </span>
                        <strong>{row.count}</strong>
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '9999px', backgroundColor: 'var(--theme-elevation-100, #f1f5f9)' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: '9999px', backgroundColor: '#4d4e4f' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 3. Banners con más clics */}
        <section style={cardStyle}>
          <h2
            style={{
              fontFamily: "'Baloo Da 2', system-ui, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              margin: '0 0 14px',
              borderLeft: '3px solid #3cac59',
              paddingLeft: '10px',
            }}
          >
            Banners con Más Clics
          </h2>
          {!data || data.topBanners.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500, #64748b)', margin: 0 }}>
              Sin clics en banners registrados todavía en este período.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.topBanners.map((row) => {
                const max = data.topBanners[0]?.count || 1;
                const pct = Math.max(4, Math.round((row.count / max) * 100));
                return (
                  <div key={`${row.bannerId}-${row.section}`}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        marginBottom: '4px',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>
                        {row.label}{' '}
                        <span style={{ fontSize: '11px', color: 'var(--theme-elevation-500)' }}>
                          ({row.section})
                        </span>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', flexShrink: 0, fontSize: '12px' }}>
                        <span style={{ color: 'var(--theme-elevation-500)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Monitor size={12} /> {row.desktop}
                        </span>
                        <span style={{ color: 'var(--theme-elevation-500)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Smartphone size={12} /> {row.mobile}
                        </span>
                        <strong style={{ color: '#3cac59' }}>{row.count}</strong>
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '9999px', backgroundColor: 'var(--theme-elevation-100, #f1f5f9)' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: '9999px', backgroundColor: '#3cac59' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. Puntos de conversión */}
        <section style={cardStyle}>
          <h2
            style={{
              fontFamily: "'Baloo Da 2', system-ui, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              margin: '0 0 14px',
              borderLeft: '3px solid #3cac59',
              paddingLeft: '10px',
            }}
          >
            Puntos de Conversión
          </h2>
          {!data || data.conversions.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500, #64748b)', margin: 0 }}>
              Sin conversiones registradas todavía en este período.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.conversions.map((row) => {
                const max = data.conversions[0]?.count || 1;
                const pct = Math.max(4, Math.round((row.count / max) * 100));
                return (
                  <div key={`${row.label}-${row.section}`}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        marginBottom: '4px',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{row.label}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(60, 172, 89, 0.12)',
                            color: '#3cac59',
                            fontWeight: 600,
                          }}
                        >
                          {row.section}
                        </span>
                        <strong style={{ color: '#3cac59' }}>{row.count}</strong>
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '9999px', backgroundColor: 'var(--theme-elevation-100, #f1f5f9)' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: '9999px', backgroundColor: '#3cac59' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
