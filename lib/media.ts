import { formatBlobUrl } from './blob';

/**
 * Utilidades para extraer y formatear URLs y textos alternativos de campos Upload de Payload CMS.
 * Es compatible tanto con objetos poblados { url, alt, ... } como con URLs directas de respaldo.
 */

export function getMediaUrl(media: unknown, fallback: string = ''): string {
  if (!media) return fallback;

  // Si es un string directo (ej: URL externa o ruta relativa)
  if (typeof media === 'string') {
    // Si es un ID numérico o UUID sin formato de ruta ni protocolo, no es una URL utilizable
    if (
      /^\d+$/.test(media) ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(media)
    ) {
      return fallback;
    }
    return formatBlobUrl(media);
  }

  // Si es un objeto poblado de la colección Media
  if (typeof media === 'object' && media !== null) {
    const mediaObj = media as { url?: string; filename?: string };
    if (typeof mediaObj.url === 'string' && mediaObj.url.trim().length > 0) {
      return formatBlobUrl(mediaObj.url);
    }
  }

  return fallback;
}

export function getMediaAlt(media: unknown, fallback: string = ''): string {
  if (typeof media === 'object' && media !== null) {
    const mediaObj = media as { alt?: string; filename?: string };
    if (typeof mediaObj.alt === 'string' && mediaObj.alt.trim().length > 0) {
      return mediaObj.alt;
    }
    if (typeof mediaObj.filename === 'string' && mediaObj.filename.trim().length > 0) {
      return mediaObj.filename;
    }
  }
  return fallback;
}
