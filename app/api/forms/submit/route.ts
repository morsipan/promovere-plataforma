import { NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  dispatchNativeFormIntegrations,
  type NativeFormPayload,
  type NativeFormType,
  type LeadProfileSegment,
} from '@/lib/integrations/forms';

const ALLOWED_FORM_TYPES = new Set<NativeFormType>([
  'contacto_comercial',
  'alta_comunidad',
  'consulta_marca',
  'newsletter_trade',
  'general',
]);

const ALLOWED_SEGMENTS = new Set<LeadProfileSegment>([
  'agencia_minorista',
  'operador_mayorista',
  'marca_hotel_destino',
  'prensa',
  'otro',
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sanitizeText(value: unknown, maxLen = 1000): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot anti-spam silencioso
    if (typeof body?.website_hp === 'string' && body.website_hp.trim().length > 0) {
      return NextResponse.json({
        ok: true,
        submissionId: 'filtered',
        message: 'Consulta recibida correctamente.',
      });
    }

    const name = sanitizeText(body?.name, 140);
    const email = sanitizeText(body?.email, 180).toLowerCase();
    const company = sanitizeText(body?.company, 160);
    const country = sanitizeText(body?.country, 100);
    const service = sanitizeText(body?.service, 140);
    const brand = sanitizeText(body?.brand, 140);
    const message = sanitizeText(body?.message, 2500);
    const source = sanitizeText(body?.source, 100) || 'web-promovere';

    const rawFormType = sanitizeText(body?.formType, 60) as NativeFormType;
    const formType: NativeFormType = ALLOWED_FORM_TYPES.has(rawFormType)
      ? rawFormType
      : 'contacto_comercial';

    const rawSegment = sanitizeText(body?.roleInterest, 60) as LeadProfileSegment;
    const roleInterest: LeadProfileSegment | undefined = ALLOWED_SEGMENTS.has(rawSegment)
      ? rawSegment
      : undefined;

    // Validaciones de entrada
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Por favor, ingresá tu nombre y apellido.' },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Por favor, ingresá un correo electrónico válido.' },
        { status: 400 }
      );
    }

    if (formType !== 'newsletter_trade' && (!message || message.length < 5)) {
      return NextResponse.json(
        { error: 'Por favor, contanos brevemente el motivo de tu consulta.' },
        { status: 400 }
      );
    }

    // Etiquetas de segmentación (sin datos sensibles ni tarifas)
    const inputTags: string[] = Array.isArray(body?.tags)
      ? body.tags
          .filter((t: unknown): t is string => typeof t === 'string')
          .map((t: string) => sanitizeText(t, 60))
          .filter(Boolean)
      : [];

    const computedTags = Array.from(
      new Set([
        `origen:${source}`,
        `tipo:${formType}`,
        ...(roleInterest ? [`perfil:${roleInterest}`] : []),
        ...(service ? [`servicio:${service}`] : []),
        ...(brand ? [`marca:${brand}`] : []),
        ...inputTags,
      ])
    );

    const payload: NativeFormPayload = {
      submissionId: `prm_${crypto.randomBytes(6).toString('hex')}`,
      formType,
      source,
      name,
      email,
      ...(company ? { company } : {}),
      ...(country ? { country } : {}),
      ...(roleInterest ? { roleInterest } : {}),
      ...(service ? { service } : {}),
      ...(brand ? { brand } : {}),
      ...(message ? { message } : {}),
      tags: computedTags,
      submittedAt: new Date().toISOString(),
    };

    const integrations = await dispatchNativeFormIntegrations(payload);

    // Log estructurado no sensible para trazabilidad en servidor
    console.info('[Promovere Form]', {
      submissionId: payload.submissionId,
      formType: payload.formType,
      source: payload.source,
      tags: payload.tags,
      make: integrations.make.status,
      doppler: integrations.doppler.status,
    });

    // Si las integraciones activas fallaron todas, informar error al cliente para reintentar
    const configuredResults = [integrations.make, integrations.doppler].filter(
      (r) => r.status !== 'skipped_not_configured'
    );
    const allConfiguredFailed =
      configuredResults.length > 0 && configuredResults.every((r) => r.status === 'error');

    if (allConfiguredFailed) {
      return NextResponse.json(
        {
          error:
            'No pudimos conectar con el servicio de envíos en este momento. Por favor, intentá nuevamente en unos minutos.',
          integrations: {
            make: integrations.make.status,
            doppler: integrations.doppler.status,
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      submissionId: payload.submissionId,
      message:
        '¡Recibimos tu consulta! Un asesor de Promovêre se pondrá en contacto a la brevedad.',
      integrations: {
        make: integrations.make.status,
        doppler: integrations.doppler.status,
      },
    });
  } catch (err: any) {
    console.error('Error procesando formulario nativo:', err);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu solicitud. Revisá los datos e intentá nuevamente.' },
      { status: 500 }
    );
  }
}
