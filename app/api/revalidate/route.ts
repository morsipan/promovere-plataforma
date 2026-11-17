import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const secret = body?.secret || req.nextUrl.searchParams.get('secret');
    const path = body?.path || req.nextUrl.searchParams.get('path');

    const expectedSecret = process.env.PAYLOAD_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ message: 'Token de revalidación inválido' }, { status: 401 });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, path: 'all', timestamp: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ message: 'Error revalidando', error: err?.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
