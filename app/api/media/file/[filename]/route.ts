import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

  // Rutas donde buscar el archivo estático
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
        console.error('Error al servir archivo multimedia:', err);
      }
    }
  }

  return new NextResponse('File not found', { status: 404 });
}
