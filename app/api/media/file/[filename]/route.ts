import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { get } from '@vercel/blob';
import { getVercelBlobToken, isVercelBlobEnabled } from '@/lib/blob';

export const dynamic = 'force-dynamic';

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!filename || filename.includes('..')) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  // 1. Rutas locales donde buscar el archivo estático
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'media', filename),
    path.join(process.cwd(), 'public', 'assets', 'PNG', filename),
    path.join(process.cwd(), 'public', 'assets', 'SVG', filename),
    path.join(process.cwd(), 'public', 'assets', 'WebP', filename),
    path.join(process.cwd(), 'public', 'assets', filename),
    path.join('/tmp', 'media', filename),
    path.join('/tmp', filename),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const ext = path.extname(filename).toLowerCase();
        const contentType = MIME_MAP[ext] || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } catch (err) {
        console.error('Error al servir archivo multimedia local:', err);
      }
    }
  }

  // 2. Si no está en disco y Vercel Blob está habilitado, intentar obtenerlo de Blob
  if (isVercelBlobEnabled()) {
    try {
      const token = getVercelBlobToken();
      const result = await get(filename, {
        access: 'private',
        token,
      });

      if (result && result.stream) {
        const headers = new Headers();
        headers.set('Content-Type', result.blob.contentType || 'application/octet-stream');
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        if (result.blob.etag) headers.set('ETag', result.blob.etag);
        if (result.blob.size) headers.set('Content-Length', String(result.blob.size));

        return new Response(result.stream as any, {
          status: 200,
          headers,
        });
      }
    } catch (blobErr) {
      console.error('Error al consultar blob en media file endpoint:', blobErr);
    }
  }

  return new NextResponse('File not found', { status: 404 });
}
