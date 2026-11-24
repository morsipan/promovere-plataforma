import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config });
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });

    if (!user) {
      return NextResponse.json(
        { error: 'Debés iniciar sesión en Comunidad para inscribirte en 1 clic.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const rawEventId = body?.eventId;
    if (!rawEventId) {
      return NextResponse.json({ error: 'Falta eventId.' }, { status: 400 });
    }

    // Validar que el evento exista y sea accesible según el rol del usuario (RBAC)
    let eventDoc: any = null;
    try {
      eventDoc = await payload.findByID({
        collection: 'community-events',
        id: rawEventId,
        user,
        overrideAccess: false,
        depth: 1,
      });
    } catch {
      eventDoc = null;
    }

    if (!eventDoc) {
      return NextResponse.json(
        { error: 'No se encontró el evento o no tenés permiso para acceder.' },
        { status: 404 }
      );
    }

    // Verificar si el usuario ya tiene inscripción previa para este evento
    const existing = await payload.find({
      collection: 'event-registrations',
      where: {
        and: [
          { user: { equals: user.id } },
          { event: { equals: eventDoc.id } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length > 0) {
      const current = existing.docs[0] as any;
      if (current.status === 'cancelled') {
        const reactivated = await payload.update({
          collection: 'event-registrations',
          id: current.id,
          data: { status: 'registered' },
          overrideAccess: true,
        });
        return NextResponse.json({
          registered: true,
          alreadyRegistered: false,
          registrationId: reactivated.id,
        });
      }

      return NextResponse.json({
        registered: true,
        alreadyRegistered: true,
        registrationId: current.id,
      });
    }

    // Extraer marca/representación asociada al evento
    const repObj =
      typeof eventDoc.representation === 'object' && eventDoc.representation !== null
        ? eventDoc.representation
        : null;
    const repId = repObj?.id ?? (eventDoc.representation || undefined);
    const brandName = repObj
      ? `${repObj.brand || repObj.title}${repObj.title && repObj.brand && repObj.title !== repObj.brand ? ` (${repObj.title})` : ''}`
      : 'Promovêre';

    const created = await payload.create({
      collection: 'event-registrations',
      data: {
        user: user.id,
        event: eventDoc.id,
        representation: repId,
        eventTitle: eventDoc.title,
        eventModality: eventDoc.modality || 'webinar',
        brandName,
        userName: (user as any).name || user.email,
        userEmail: user.email,
        userCompany: (user as any).company || '',
        userRole: (user as any).role || 'minorista',
        status: 'registered',
      },
      overrideAccess: true,
    });

    return NextResponse.json({
      registered: true,
      alreadyRegistered: false,
      registrationId: created.id,
    });
  } catch (err: any) {
    console.error('Error en inscripción 1 clic:', err);
    return NextResponse.json(
      { error: err?.message || 'No se pudo registrar la inscripción.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await getPayload({ config });
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });

    if (!user) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }

    const body = await request.json();
    const rawEventId = body?.eventId;
    if (!rawEventId) {
      return NextResponse.json({ error: 'Falta eventId.' }, { status: 400 });
    }

    const existing = await payload.find({
      collection: 'event-registrations',
      where: {
        and: [
          { user: { equals: user.id } },
          { event: { equals: rawEventId } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length > 0) {
      await payload.delete({
        collection: 'event-registrations',
        id: existing.docs[0].id,
        overrideAccess: true,
      });
    }

    return NextResponse.json({ registered: false });
  } catch (err: any) {
    console.error('Error cancelando inscripción:', err);
    return NextResponse.json(
      { error: err?.message || 'No se pudo cancelar la inscripción.' },
      { status: 500 }
    );
  }
}
