'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { LayoutGrid, List, FileText, Search, Loader2 } from 'lucide-react';
import { formatBlobUrl } from '@/lib/blob';

type MediaViewMode = 'list' | 'grid';

const STORAGE_KEY = 'promovere_media_view_mode';

interface MediaDoc {
  id: string | number;
  filename?: string;
  alt?: string;
  url?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  filesize?: number;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const MediaViewToggle: React.FC = () => {
  const [mode, setMode] = useState<MediaViewMode>('list');
  const [items, setItems] = useState<MediaDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Cargar preferencia guardada
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'grid' || saved === 'list') {
        setMode(saved);
      }
    } catch {}
  }, []);

  // Activar/desactivar clase en body para alternar la tabla nativa de Payload
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mode === 'grid') {
      document.body.classList.add('promovere-media-grid-active');
    } else {
      document.body.classList.remove('promovere-media-grid-active');
    }
    return () => {
      document.body.classList.remove('promovere-media-grid-active');
    };
  }, [mode]);

  const fetchMedia = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '60',
        sort: '-createdAt',
      });
      if (query.trim()) {
        params.set('where[or][0][filename][like]', query.trim());
        params.set('where[or][1][alt][like]', query.trim());
      }
      const res = await fetch(`/api/media?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      setItems(Array.isArray(data.docs) ? data.docs : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === 'grid') {
      const t = window.setTimeout(() => {
        fetchMedia(search);
      }, 180);
      return () => window.clearTimeout(t);
    }
  }, [mode, search, fetchMedia]);

  const handleModeChange = (next: MediaViewMode) => {
    setMode(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return (
    <div suppressHydrationWarning style={{ marginBottom: '16px' }}>
      {/* Barra superior con Conmutador Cuadrícula / Listado */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '10px 14px',
          borderRadius: '8px',
          backgroundColor: 'var(--theme-elevation-50)',
          border: '1px solid var(--theme-elevation-150)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '200px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--theme-elevation-600)',
              whiteSpace: 'nowrap',
            }}
          >
            Vista:
          </span>

          <div
            style={{
              display: 'inline-flex',
              padding: '2px',
              borderRadius: '7px',
              backgroundColor: 'var(--theme-elevation-100)',
              border: '1px solid var(--theme-elevation-200)',
              gap: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => handleModeChange('grid')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '5px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: mode === 'grid' ? 'var(--theme-text)' : 'transparent',
                color: mode === 'grid' ? 'var(--theme-bg)' : 'var(--theme-text)',
                transition: 'all 0.15s ease',
              }}
            >
              <LayoutGrid size={14} />
              <span>Cuadrícula</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('list')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '5px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: mode === 'list' ? 'var(--theme-text)' : 'transparent',
                color: mode === 'list' ? 'var(--theme-bg)' : 'var(--theme-text)',
                transition: 'all 0.15s ease',
              }}
            >
              <List size={14} />
              <span>Listado</span>
            </button>
          </div>
        </div>

        {mode === 'grid' && (
          <div style={{ position: 'relative', width: '240px', maxWidth: '100%' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--theme-elevation-500)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar archivos..."
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                borderRadius: '6px',
                border: '1px solid var(--theme-elevation-200)',
                backgroundColor: 'var(--theme-input-bg, var(--theme-bg))',
                color: 'var(--theme-text)',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>
        )}
      </div>

      {/* Grilla de Miniaturas cuando mode === 'grid' */}
      {mode === 'grid' && (
        <div style={{ marginTop: '16px' }}>
          {loading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '48px 16px',
                color: 'var(--theme-elevation-500)',
                fontSize: '13px',
              }}
            >
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Cargando biblioteca multimedia...</span>
            </div>
          ) : items.length === 0 ? (
            <div
              style={{
                padding: '40px 16px',
                textAlign: 'center',
                borderRadius: '10px',
                border: '1px dashed var(--theme-elevation-200)',
                color: 'var(--theme-elevation-500)',
                fontSize: '13px',
              }}
            >
              No se encontraron archivos multimedia.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
                gap: '14px',
              }}
            >
              {items.map((doc) => {
                const isImage = Boolean(doc.mimeType?.startsWith('image/'));
                const imgSrc = doc.url
                  ? formatBlobUrl(doc.url)
                  : doc.filename
                  ? `/api/media/file/${doc.filename}`
                  : '';

                return (
                  <Link
                    key={String(doc.id)}
                    href={`/admin/collections/media/${doc.id}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid var(--theme-elevation-150)',
                      backgroundColor: 'var(--theme-elevation-50)',
                      textDecoration: 'none',
                      color: 'var(--theme-text)',
                      transition: 'border-color 0.15s ease, transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--theme-elevation-400)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--theme-elevation-150)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      style={{
                        height: '135px',
                        width: '100%',
                        backgroundColor: 'var(--theme-elevation-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {isImage && imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={doc.alt || doc.filename || 'Media'}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'var(--theme-elevation-500)',
                          }}
                        >
                          <FileText size={28} />
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600 }}>
                            {doc.mimeType?.split('/')[1] || 'Archivo'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '10px' }}>
                      <div
                        title={doc.filename || doc.alt || ''}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--theme-text)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {doc.filename || doc.alt || `Archivo #${doc.id}`}
                      </div>
                      <div
                        style={{
                          marginTop: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '10px',
                          color: 'var(--theme-elevation-500)',
                        }}
                      >
                        <span>
                          {doc.width && doc.height ? `${doc.width}×${doc.height}` : doc.mimeType?.split('/')[1] || ''}
                        </span>
                        <span>{formatBytes(doc.filesize)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaViewToggle;
