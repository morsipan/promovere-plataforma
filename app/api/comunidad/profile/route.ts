import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';

const ALLOWED_SECTIONS = new Set([
  'representaciones',
  'promociones',
  'eventos',
  'herramientas',
  'webinars',
  'blog',
]);

export async function PATCH(request: Request) {
  try {
    const payload = await getPayload({ config });
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });

    if (!user) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }

    const body = await request.json();
    const updateData: Record<string, any> = {};

    if (typeof body.name === 'string' && body.name.trim().length > 0) {
      updateData.name = body.name.trim();
    }
    if (typeof body.company === 'string') {
      updateData.company = body.company.trim();
    }
    if (typeof body.phone === 'string') {
      updateData.phone = body.phone.trim();
    }
    if (typeof body.country === 'string') {
      updateData.country = body.country.trim();
    }
    if (Array.isArray(body.dashboardOrder)) {
      const cleaned = body.dashboardOrder.filter(
        (key: unknown): key is string => typeof key === 'string' && ALLOWED_SECTIONS.has(key)
      );
      if (cleaned.length > 0) {
        updateData.dashboardOrder = cleaned;
      }
    }

    const updated = await payload.update({
      collection: 'users',
      id: user.id,
      data: updateData,
      overrideAccess: true,
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        company: updated.company,
        phone: updated.phone,
        country: updated.country,
        avatar: updated.avatar,
        dashboardOrder: (updated as any).dashboardOrder ?? null,
      },
    });
  } catch (err: any) {
    console.error('Error actualizando perfil de comunidad:', err);
    return NextResponse.json(
      { error: err?.message || 'No se pudo actualizar el perfil.' },
      { status: 500 }
    );
  }
}
