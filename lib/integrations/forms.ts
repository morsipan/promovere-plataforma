/**
 * Capa de integración desacoplada para Formularios Nativos de Promovêre.
 * Soporta envío simultáneo y opcional hacia:
 *   1) Make (Webhook configurable vía process.env.MAKE_WEBHOOK_URL)
 *   2) Doppler (API REST configurable vía process.env.DOPPLER_API_KEY / DOPPLER_ACCOUNT_NAME / DOPPLER_LIST_ID)
 *
 * Si alguna variable de entorno todavía no está definida, el conector responde
 * 'skipped_not_configured' sin interrumpir la experiencia del usuario.
 */

export type NativeFormType =
  | 'contacto_comercial'
  | 'alta_comunidad'
  | 'consulta_marca'
  | 'newsletter_trade'
  | 'general';

export type LeadProfileSegment =
  | 'agencia_minorista'
  | 'operador_mayorista'
  | 'marca_hotel_destino'
  | 'prensa'
  | 'otro';

export interface NativeFormPayload {
  submissionId: string;
  formType: NativeFormType;
  source: string;
  name: string;
  email: string;
  company?: string;
  country?: string;
  roleInterest?: LeadProfileSegment;
  service?: string;
  brand?: string;
  message?: string;
  tags: string[];
  submittedAt: string;
}

export interface IntegrationDispatchResult {
  provider: 'make' | 'doppler';
  status: 'sent' | 'skipped_not_configured' | 'error';
  statusCode?: number;
  error?: string;
}

function resolveMakeWebhookUrl(formType: NativeFormType): string {
  const byType: Partial<Record<NativeFormType, string | undefined>> = {
    contacto_comercial: process.env.MAKE_WEBHOOK_CONTACT_URL,
    alta_comunidad: process.env.MAKE_WEBHOOK_COMMUNITY_URL,
    consulta_marca: process.env.MAKE_WEBHOOK_BRAND_URL,
    newsletter_trade: process.env.MAKE_WEBHOOK_NEWSLETTER_URL,
  };
  return (byType[formType] || process.env.MAKE_WEBHOOK_URL || '').trim();
}

function resolveDopplerListId(formType: NativeFormType): string {
  const byType: Partial<Record<NativeFormType, string | undefined>> = {
    contacto_comercial: process.env.DOPPLER_LIST_ID_CONTACTO,
    alta_comunidad: process.env.DOPPLER_LIST_ID_COMUNIDAD,
    consulta_marca: process.env.DOPPLER_LIST_ID_MARCAS,
    newsletter_trade: process.env.DOPPLER_LIST_ID_NEWSLETTER,
  };
  return (byType[formType] || process.env.DOPPLER_LIST_ID || '').trim();
}

export async function dispatchToMake(
  payload: NativeFormPayload
): Promise<IntegrationDispatchResult> {
  const webhookUrl = resolveMakeWebhookUrl(payload.formType);
  if (!webhookUrl) {
    return { provider: 'make', status: 'skipped_not_configured' };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const secret = (process.env.MAKE_WEBHOOK_SECRET || '').trim();
    if (secret) {
      headers['X-Promovere-Webhook-Secret'] = secret;
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        event: 'promovere.form.submitted',
        ...payload,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return {
        provider: 'make',
        status: 'error',
        statusCode: res.status,
        error: `Make respondió HTTP ${res.status}`,
      };
    }

    return { provider: 'make', status: 'sent', statusCode: res.status };
  } catch (err: any) {
    return {
      provider: 'make',
      status: 'error',
      error: err?.message || 'Error de red enviando a Make',
    };
  }
}

export async function dispatchToDoppler(
  payload: NativeFormPayload
): Promise<IntegrationDispatchResult> {
  const apiKey = (process.env.DOPPLER_API_KEY || '').trim();
  const accountName = (process.env.DOPPLER_ACCOUNT_NAME || '').trim();
  const listId = resolveDopplerListId(payload.formType);

  if (!apiKey || !accountName || !listId) {
    return { provider: 'doppler', status: 'skipped_not_configured' };
  }

  try {
    const baseUrl = (process.env.DOPPLER_API_BASE_URL || 'https://restapi.fromdoppler.com').replace(
      /\/+$/,
      ''
    );
    const endpoint = `${baseUrl}/accounts/${encodeURIComponent(accountName)}/lists/${encodeURIComponent(listId)}/subscribers`;

    const fields: Array<{ name: string; value: string }> = [
      { name: 'FIRSTNAME', value: payload.name },
      { name: 'ORIGIN', value: payload.source },
      { name: 'FORM_TYPE', value: payload.formType },
    ];
    if (payload.company) fields.push({ name: 'COMPANY', value: payload.company });
    if (payload.country) fields.push({ name: 'COUNTRY', value: payload.country });
    if (payload.roleInterest) fields.push({ name: 'SEGMENT', value: payload.roleInterest });
    if (payload.service) fields.push({ name: 'SERVICE', value: payload.service });
    if (payload.brand) fields.push({ name: 'BRAND', value: payload.brand });

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${apiKey}`,
      },
      body: JSON.stringify({
        email: payload.email,
        fields,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return {
        provider: 'doppler',
        status: 'error',
        statusCode: res.status,
        error: `Doppler respondió HTTP ${res.status}`,
      };
    }

    return { provider: 'doppler', status: 'sent', statusCode: res.status };
  } catch (err: any) {
    return {
      provider: 'doppler',
      status: 'error',
      error: err?.message || 'Error de red enviando a Doppler',
    };
  }
}

export async function dispatchNativeFormIntegrations(payload: NativeFormPayload) {
  const [make, doppler] = await Promise.all([
    dispatchToMake(payload),
    dispatchToDoppler(payload),
  ]);

  return { make, doppler };
}
