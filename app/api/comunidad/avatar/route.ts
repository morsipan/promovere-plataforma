import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config });
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });

    if (!user) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No se recibió ningún archivo de imagen.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Formato no permitido. Usá JPG, PNG, WebP o GIF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'La imagen supera el tamaño máximo de 5 MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: `Avatar de ${user.name || user.email}`,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: `avatar-${user.id}-${Date.now()}-${safeName}`,
        size: file.size,
      },
      overrideAccess: true,
    });

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        avatar: mediaDoc.id,
      },
      overrideAccess: true,
    });

    return NextResponse.json({
      media: mediaDoc,
    });
  } catch (err: any) {
    console.error('Error subiendo avatar de comunidad:', err);
    return NextResponse.json(
      { error: err?.message || 'No se pudo subir la foto de perfil.' },
      { status: 500 }
    );
  }
}
