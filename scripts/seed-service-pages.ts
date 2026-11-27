import pg from 'pg';
import { getPayload } from 'payload';
import config from '../payload.config';

const { Client } = pg;

interface ServicePageSeed {
  slug: string;
  title: string;
  badge: string;
  subtitle: string;
  sourceUrl: string;
  includePrMetrics?: boolean;
  fallbackParagraphs: string[];
}

const SERVICE_PAGES: ServicePageSeed[] = [
  {
    slug: 'representaciones-turisticas',
    title: 'Representaciones Turísticas (Vê REPS®)',
    badge: 'Vê REPS® · Gestión Comercial Activa',
    subtitle:
      'Representamos destinos, cadenas hoteleras, DMCs y marcas turísticas en América Latina, impulsando su presencia comercial y posicionamiento en la red de operadores mayoristas y agencias de viajes.',
    sourceUrl: 'https://www.promovere.com.ar/servicios_1/representaciones-tur%C3%ADsticas',
    fallbackParagraphs: [
      'A través de Vê REPS®, Promovêre actúa como oficina comercial y brazo estratégico en América Latina para destinos, cadenas hoteleras, operadores receptivos y marcas turísticas internacionales.',
      'Nuestro trabajo combina visitas comerciales sistemáticas a operadores mayoristas y agencias minoristas, capacitaciones presenciales y virtuales, participación activa en ferias y workshops sectoriales y seguimiento comercial continuo orientado a resultados.',
      'Desarrollamos relaciones comerciales de largo plazo con el trade regional, acercando herramientas de venta, novedades de producto y soporte permanente para potenciar la demanda en los principales mercados emisivos de la región.',
    ],
  },
  {
    slug: 'marketing-turistico',
    title: 'Marketing Turístico',
    badge: 'Vê MKT · Campañas de Alta Conversión',
    subtitle:
      'Diseñamos e implementamos estrategias integrales de marketing turístico omnicanal, branding y generación de demanda para posicionar destinos y marcas hoteleras en América Latina.',
    sourceUrl: 'https://www.promovere.com.ar/servicios_1/marketing-tur%C3%ADstico',
    fallbackParagraphs: [
      'En Promovêre desarrollamos planes de marketing turístico pensados específicamente para la dinámica del sector de viajes en Latinoamérica, integrando acciones B2B dirigidas al trade con campañas de visibilidad orientadas al viajero final.',
      'Creamos campañas de branding, comunicación digital, pauta segmentada, contenidos editoriales, activaciones de marca y acciones cooperadas junto a operadores y medios estratégicos.',
      'Cada campaña se diseña a medida de los objetivos comerciales de la marca o destino, midiendo alcance, interacción y generación de oportunidades comerciales concretas.',
    ],
  },
  {
    slug: 'relaciones-publicas',
    title: 'Relaciones Públicas',
    badge: 'Vê PR · Visibilidad en Prensa y Trade',
    subtitle:
      'Construimos presencia sostenida en medios especializados del trade turístico y prensa masiva mediante comunicados, entrevistas, coberturas audiovisuales y gestión estratégica de prensa.',
    sourceUrl: 'https://www.promovere.com.ar/servicios_1/relaciones-p%C3%BAblicas',
    includePrMetrics: true,
    fallbackParagraphs: [
      'Nuestro departamento de Relaciones Públicas vincula a las marcas representadas con los principales medios especializados del trade turístico, prensa masiva, programas de televisión, radio y creadores de contenido de la región.',
      'Gestionamos gacetillas y comunicados oficiales, entrevistas exclusivas con voceros, media tours, Fam Press y coberturas en ferias internacionales para consolidar la reputación y el posicionamiento de cada destino o cadena hotelera.',
      'Complementamos la difusión periodística con seguimiento editorial permanente y difusión en nuestros propios canales de Prensa y Entrevistas.',
    ],
  },
];

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&aacute;/gi, 'á')
    .replace(/&eacute;/gi, 'é')
    .replace(/&iacute;/gi, 'í')
    .replace(/&oacute;/gi, 'ó')
    .replace(/&uacute;/gi, 'ú')
    .replace(/&ntilde;/gi, 'ñ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

async function extractRealParagraphs(sourceUrl: string): Promise<string[]> {
  try {
    const res = await fetch(sourceUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const html = await res.text();
    const mainMatch = /<div[^>]+role=["']main["'][\s\S]*$/i.exec(html);
    const scope = (mainMatch ? mainMatch[0] : html)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<footer[\s\S]*?<\/footer>/gi, ' ');

    const paragraphs: string[] = [];
    const tagRegex = /<(?:p|h2|h3|li)[^>]*>([\s\S]*?)<\/(?:p|h2|h3|li)>/gi;
    let m: RegExpExecArray | null;
    while ((m = tagRegex.exec(scope)) !== null) {
      const clean = decodeHtmlEntities(m[1].replace(/<[^>]+>/g, ' '));
      if (
        clean.length >= 35 &&
        !/cookies|política de privacidad|google sites|informar uso inadecuado/i.test(clean) &&
        !paragraphs.includes(clean)
      ) {
        paragraphs.push(clean);
      }
      if (paragraphs.length >= 10) break;
    }
    return paragraphs;
  } catch {
    return [];
  }
}

function buildLexicalRichText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
      })),
    },
  };
}

async function main() {
  const connectionString = process.env.DATABASE_URI || '';
  if (!connectionString) {
    console.error('❌ Falta DATABASE_URI para migrar y sembrar páginas de servicios.');
    process.exit(1);
  }

  // 1. Migración idempotente de columna is_published en pages
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(`
    ALTER TABLE pages
      ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;
    CREATE INDEX IF NOT EXISTS pages_is_published_idx ON pages (is_published);
  `);
  await client.end();

  const payload = await getPayload({ config });

  let created = 0;
  let existing = 0;

  for (const svc of SERVICE_PAGES) {
    const found = await payload.find({
      collection: 'pages',
      where: { slug: { equals: svc.slug } },
      limit: 1,
      overrideAccess: true,
    });

    if (found.docs.length > 0) {
      existing++;
      console.log(`⏭️  Página ya existe: /servicios/${svc.slug} (id: ${found.docs[0].id})`);
      continue;
    }

    const extracted = await extractRealParagraphs(svc.sourceUrl);
    const paragraphs = extracted.length >= 2 ? extracted : svc.fallbackParagraphs;

    const layout: any[] = [
      {
        blockType: 'hero',
        badge: svc.badge,
        title: svc.title,
        subtitle: svc.subtitle,
        cta1Label: 'Solicitar reunión comercial',
        cta1Href: '#contacto',
        cta2Label: 'Comunidad Promovêre',
        cta2Href: '/comunidad',
      },
      {
        blockType: 'richText',
        badge: svc.badge,
        title: `Cómo trabajamos en ${svc.title}`,
        content: buildLexicalRichText(paragraphs),
        alignment: 'left',
      },
    ];

    if (svc.includePrMetrics) {
      layout.push({
        blockType: 'prMetrics',
      });
    }

    layout.push(
      {
        blockType: 'ctaBanner',
        badge: 'Captación B2B · Promovêre',
        title: '¿Querés potenciar tu marca turística en América Latina?',
        description:
          'Conversá con nuestro equipo comercial para diseñar una estrategia a medida para tu destino, cadena hotelera o DMC.',
        primaryButtonLabel: 'Contactar al equipo comercial',
        primaryButtonHref: '#contacto',
        secondaryButtonLabel: 'Ingresar a Comunidad',
        secondaryButtonHref: '/comunidad',
      },
      {
        blockType: 'contact',
      }
    );

    const doc = await payload.create({
      collection: 'pages',
      data: {
        title: svc.title,
        slug: svc.slug,
        isPublished: true,
        layout,
      } as any,
      overrideAccess: true,
    });

    created++;
    console.log(
      `✅ Creada página /servicios/${svc.slug} (id: ${doc.id}, párrafos: ${paragraphs.length}, origen: ${
        extracted.length >= 2 ? 'HTML real' : 'respaldo institucional'
      })`
    );
  }

  console.log(`✅ Seed de páginas de Servicios finalizado: ${created} creadas, ${existing} existentes.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error sembrando páginas de Servicios:', err);
  process.exit(1);
});
