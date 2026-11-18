import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import { getVercelBlobToken } from '@/lib/blob';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path } = await context.params;
    const searchUrl = request.nextUrl.searchParams.get('url');

    let target: string | undefined;

    if (searchUrl) {
      target = searchUrl;
    } else if (path && path.length > 0) {
      target = path.join('/');
    }

    if (!target) {
      return new NextResponse('File path or URL is required', { status: 400 });
    }

    const token = getVercelBlobToken();
    if (!token) {
      return new NextResponse('Blob token not configured', { status: 500 });
    }

    // Consultamos Vercel Blob con acceso privado utilizando el token de servidor
    const result = await get(target, {
      access: 'private',
      token,
    });

    if (!result) {
      return new NextResponse('File not found in Blob storage', { status: 404 });
    }

    if (result.statusCode === 304) {
      return new NextResponse(null, { status: 304 });
    }

    const headers = new Headers();
    headers.set('Content-Type', result.blob.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (result.blob.etag) {
      headers.set('ETag', result.blob.etag);
    }
    if (result.blob.size) {
      headers.set('Content-Length', String(result.blob.size));
    }
    if (result.blob.contentDisposition) {
      headers.set('Content-Disposition', result.blob.contentDisposition);
    }

    return new Response(result.stream as any, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Blob proxy error:', error);
    return new NextResponse(error?.message || 'Internal Server Error', { status: 500 });
  }
}
