/**
 * Utilidades centralizadas para Vercel Blob Storage.
 * Permite detectar el token y gestionar el acceso (private o public) de manera transparente.
 */

export function getVercelBlobToken(): string {
  const rawToken =
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN ||
    Object.entries(process.env).find(
      ([k]) => k.endsWith('_READ_WRITE_TOKEN') || (k.includes('BLOB') && k.includes('TOKEN'))
    )?.[1] ||
    '';

  return rawToken.trim().replace(/^["']|["']$/g, '');
}

export function getBlobAccess(): 'public' | 'private' {
  // Si explícitamente se especifica 'public', usamos 'public'.
  // Por defecto, si el store conectado en Vercel es privado, usamos 'private'.
  if (process.env.BLOB_ACCESS === 'public') {
    return 'public';
  }
  return 'private';
}

export function isVercelBlobEnabled(): boolean {
  const token = getVercelBlobToken();
  return Boolean(token && /^vercel_blob_rw_/i.test(token));
}

/**
 * Convierte URLs privadas de Vercel Blob en rutas de entrega de medios (/api/media/file/...)
 * para que puedan ser visualizadas tanto en el panel de Payload CMS como en el frontend público.
 */
export function formatBlobUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return url || '';

  if (url.includes('.private.blob.vercel-storage.com/')) {
    const parts = url.split('.private.blob.vercel-storage.com/');
    if (parts[1]) {
      return `/api/media/file/${parts[1]}`;
    }
  }

  return url;
}
