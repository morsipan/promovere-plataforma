import { getPayload } from 'payload';
import config from '../payload.config';

const PROMO_NEWS_URLS: string[] = [
  'https://www.promovere.com.ar/novedades/promo-news/ampliamos-el-equipo-comercial',
  'https://www.promovere.com.ar/novedades/promo-news/mais-brasil-nota',
  'https://www.promovere.com.ar/novedades/promo-news/atpm-reconocimiento-2026',
  'https://www.promovere.com.ar/novedades/promo-news/promoweek-nota',
  'https://www.promovere.com.ar/novedades/promo-news/fit-2026',
  'https://www.promovere.com.ar/novedades/promo-news/adh-lujo',
  'https://www.promovere.com.ar/novedades/promo-news/omnibees-nota',
  'https://www.promovere.com.ar/novedades/promo-news/vila-galé-brasil',
  'https://www.promovere.com.ar/novedades/promo-news/presencia-del-trade',
  'https://www.promovere.com.ar/novedades/promo-news/comunidad-promovêre',
  'https://www.promovere.com.ar/novedades/promo-news/htn-2027',
  'https://www.promovere.com.ar/novedades/promo-news/lomas-hospitaluty-nota',
  'https://www.promovere.com.ar/novedades/promo-news/fam-solaris',
  'https://www.promovere.com.ar/novedades/promo-news/lifestyle-nota',
  'https://www.promovere.com.ar/novedades/promo-news/exitosa-caravana-hoteles-solaris',
  'https://www.promovere.com.ar/novedades/promo-news/vila-galee',
  'https://www.promovere.com.ar/novedades/promo-news/anunciamos-el-arribo-de-caribe-mexicano',
  'https://www.promovere.com.ar/novedades/promo-news/fitur-2026',
  'https://www.promovere.com.ar/novedades/promo-news/best-sellers-2025',
  'https://www.promovere.com.ar/novedades/promo-news/desayuno-con-el-trade',
  'https://www.promovere.com.ar/novedades/promo-news/las-vegas-nuevo-partner',
  'https://www.promovere.com.ar/novedades/promo-news/fit-2025',
  'https://www.promovere.com.ar/novedades/promo-news/promovere-en-fit-2025',
  'https://www.promovere.com.ar/novedades/promo-news/cordoba',
  'https://www.promovere.com.ar/novedades/promo-news/webinar-los-cabos',
  'https://www.promovere.com.ar/novedades/promo-news/paraguay-y-bolviia',
  'https://www.promovere.com.ar/novedades/promo-news/tigre-fortalece-su-identidad-como-destino-turistico',
  'https://www.promovere.com.ar/novedades/promo-news/etg-incorpora-a-argentina',
  'https://www.promovere.com.ar/novedades/promo-news/preventa-2026-htn',
  'https://www.promovere.com.ar/novedades/promo-news/5-workshop-tigre',
  'https://www.promovere.com.ar/novedades/promo-news/primer-congreso-santa-hospitalidad-2025',
  'https://www.promovere.com.ar/novedades/promo-news/seguimos-impulsando-el-turismo-de-lujo',
  'https://www.promovere.com.ar/novedades/promo-news/hoteles-solaris-exitoso-webinar-de-capacitación',
  'https://www.promovere.com.ar/novedades/promo-news/promovêre-y-rumbo-producciones-consolidan-su-alianza',
  'https://www.promovere.com.ar/novedades/promo-news/llega-la-vii-bolsa-turística-destinos-gaviota',
  'https://www.promovere.com.ar/novedades/promo-news/santa-hospitalidad-2025',
  'https://www.promovere.com.ar/novedades/promo-news/destinos-gaviota-2025',
  'https://www.promovere.com.ar/novedades/promo-news/promovêre-y-un-comienzo-de-año-que-promete',
  'https://www.promovere.com.ar/novedades/promo-news/sun-vista-apuesta-al-cono-sur',
  'https://www.promovere.com.ar/novedades/promo-news/playa-kids-cayo-santa-maría',
  'https://www.promovere.com.ar/novedades/promo-news/escapada-a-islas-caimán-durante-el-mundial-de-clubes-2025',
  'https://www.promovere.com.ar/novedades/promo-news/promovere-despidió-el-año',
  'https://www.promovere.com.ar/novedades/promo-news/enjoy-travel-group-nuevo-miembro-de-la-onu',
  'https://www.promovere.com.ar/novedades/promo-news/destinos-gaviota-2024',
  'https://www.promovere.com.ar/novedades/promo-news/promovere-marca-tendencia-en-bolivia-y-perú',
  'https://www.promovere.com.ar/novedades/promo-news/descubrí-la-empresa-del-sureste-de-europa-más-innovadora',
  'https://www.promovere.com.ar/novedades/promo-news/promovere-se-acentúa-en-la-caravana-cuba',
  'https://www.promovere.com.ar/novedades/promo-news/oleo-cancún-ofrece-una-promoción-exclusiva',
  'https://www.promovere.com.ar/novedades/promo-news/promovere-y-sus-lazos-por-chile',
  'https://www.promovere.com.ar/novedades/promo-news/promovere-presente-en-las-luxury-travel-talks',
  'https://www.promovere.com.ar/novedades/promo-news/hellenic-travel-network-reps',
  'https://www.promovere.com.ar/novedades/promo-news/coris-asistencia-promovere',
  'https://www.promovere.com.ar/novedades/promo-news/vacaciones-gratis-para-profesionales',
  'https://www.promovere.com.ar/novedades/promo-news/enjoy-pro',
  'https://www.promovere.com.ar/novedades/promo-news/capacitación',
];

const SLUG_TYPO_FIXES: Record<string, string> = {
  'paraguay-y-bolviia': 'paraguay-y-bolivia',
  'lomas-hospitaluty-nota': 'lomas-hospitality-nota',
};

function normalizeSlug(rawUrl: string): string {
  const rawSegment = rawUrl.split('/').filter(Boolean).pop() || 'nota';
  const decoded = decodeURIComponent(rawSegment);
  const ascii = decoded
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return SLUG_TYPO_FIXES[ascii] || ascii;
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

function inferBrand(title: string, slug: string): string {
  const haystack = `${title} ${slug}`.toLowerCase();
  const rules: Array<[RegExp, string]> = [
    [/atelier|atpm|adh-lujo/, 'Atelier de Hoteles'],
    [/solaris/, 'Hoteles Solaris'],
    [/vila.?gal/, 'Vila Galé'],
    [/hellenic|\bhtn\b|sureste-de-europa/, 'Hellenic Travel Network'],
    [/gaviota|cayo-santa|caravana-cuba/, 'Gaviota Hoteles'],
    [/caribe.?mexicano/, 'Caribe Mexicano'],
    [/caiman|caimán/, 'Islas Caimán'],
    [/enjoy|etg-incorpora/, 'Enjoy Travel Group'],
    [/sun.?vista/, 'SunVista'],
    [/lomas/, 'Lomas Hospitality'],
    [/coris/, 'Coris'],
    [/mais.?brasil/, 'Mais Brasil'],
    [/omnibees/, 'Omnibees'],
    [/las.?vegas/, 'Las Vegas en Tu Idioma'],
    [/lifestyle/, 'Lifestyle Holidays'],
    [/oleo/, 'Óleo Cancún Playa'],
    [/los.?cabos/, 'Los Cabos'],
    [/tigre/, 'Tigre'],
  ];
  for (const [pattern, brand] of rules) {
    if (pattern.test(haystack)) return brand;
  }
  return 'Promovêre';
}

interface ExtractedBlock {
  tag: 'h2' | 'h3' | 'p';
  text: string;
}

function buildLexicalContent(blocks: ExtractedBlock[]) {
  const children = blocks.map((b) => {
    if (b.tag === 'h2' || b.tag === 'h3') {
      return {
        type: 'heading',
        tag: b.tag,
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
            text: b.text,
            version: 1,
          },
        ],
      };
    }
    return {
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
          text: b.text,
          version: 1,
        },
      ],
    };
  });

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children:
        children.length > 0
          ? children
          : [
              {
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
                    text: 'Artículo importado desde Promo News.',
                    version: 1,
                  },
                ],
              },
            ],
    },
  };
}

function extractArticleFromHtml(html: string) {
  const rawTitleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawTitle = rawTitleMatch ? decodeHtmlEntities(rawTitleMatch[1]) : '';
  const cleanedTitle = rawTitle.replace(/^Marketing\s+tur[ií]stico\s*[-–—]\s*/i, '').trim();

  const mainStart = html.indexOf('role="main"');
  const mainSlice = mainStart !== -1 ? html.slice(mainStart) : html;
  const footerIdx = mainSlice.indexOf('<footer');
  const bodyHtml = footerIdx !== -1 ? mainSlice.slice(0, footerIdx) : mainSlice;

  // Imágenes dentro del contenido principal (evitando logos del header/footer)
  const imgs = [...bodyHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
    .map((m) => decodeHtmlEntities(m[1]))
    .filter((src) => src.startsWith('http') && !src.includes('=w16383'));

  // Bloques de texto limpio
  const noiseSet = new Set([
    'continuar leyendo',
    'leer más',
    'leer mas',
    'volver',
    'inicio',
    'compartir',
  ]);

  const rawBlocks: ExtractedBlock[] = [];
  for (const match of bodyHtml.matchAll(/<(h1|h2|h3|p)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const rawTag = match[1].toLowerCase();
    const text = decodeHtmlEntities(match[2].replace(/<[^>]+>/g, ' '));
    if (!text || text.length < 3) continue;
    if (noiseSet.has(text.toLowerCase())) continue;
    const tag: 'h2' | 'h3' | 'p' = rawTag === 'h1' || rawTag === 'h2' ? 'h2' : rawTag === 'h3' ? 'h3' : 'p';
    rawBlocks.push({ tag, text });
  }

  const title = cleanedTitle || rawBlocks[0]?.text || 'Novedad Promovêre';
  const firstParagraph = rawBlocks.find((b) => b.tag === 'p' && b.text.length >= 40)?.text || rawBlocks[0]?.text || title;
  const excerpt =
    firstParagraph.length > 280
      ? `${firstParagraph.slice(0, 277).trimEnd()}...`
      : firstParagraph;

  return {
    title,
    excerpt,
    blocks: rawBlocks,
    primaryImageUrl: imgs[0] || null,
  };
}

function getExtFromMime(mime: string): string {
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('gif')) return 'gif';
  return 'jpg';
}

async function uploadImageToMedia(
  payload: any,
  imageUrl: string,
  slug: string,
  alt: string
): Promise<{ id: number | string; url: string } | null> {
  try {
    const res = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;

    const contentType = (res.headers.get('content-type') || 'image/jpeg').split(';')[0].trim();
    if (!contentType.startsWith('image/')) return null;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 500) return null;

    const ext = getExtFromMime(contentType);
    const filename = `promo-news-${slug}.${ext}`;

    // Idempotencia: reutilizar si ya existe en Media
    const existingMedia = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      overrideAccess: true,
    });

    if (existingMedia.docs.length > 0) {
      const m = existingMedia.docs[0];
      return {
        id: m.id,
        url: m.url || `/api/media/file/${encodeURIComponent(m.filename || filename)}`,
      };
    }

    const createdMedia = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buffer,
        mimetype: contentType,
        name: filename,
        size: buffer.length,
      },
      overrideAccess: true,
    });

    return {
      id: createdMedia.id,
      url:
        createdMedia.url ||
        `/api/media/file/${encodeURIComponent(createdMedia.filename || filename)}`,
    };
  } catch {
    return null;
  }
}

async function main() {
  console.log(`🚀 Iniciando importación idempotente de ${PROMO_NEWS_URLS.length} artículos de Promo News -> Blog...`);
  const payload = await getPayload({ config });

  const stats = {
    total: PROMO_NEWS_URLS.length,
    created: 0,
    skippedExisting: 0,
    failed: [] as Array<{ url: string; reason: string }>,
    withoutImage: [] as Array<{ url: string; slug: string; title: string }>,
    mediaUploaded: 0,
    slugsNormalized: [] as Array<{ original: string; normalized: string }>,
  };

  const orderedUrls = [...PROMO_NEWS_URLS].reverse();
  for (let i = 0; i < orderedUrls.length; i++) {
    const rawUrl = orderedUrls[i];
    const encodedUrl = encodeURI(rawUrl);
    const slug = normalizeSlug(rawUrl);
    const rawSegment = rawUrl.split('/').filter(Boolean).pop() || '';
    if (rawSegment !== slug) {
      stats.slugsNormalized.push({ original: rawSegment, normalized: slug });
    }

    // 1. Verificar idempotencia antes de descargar
    const existing = await payload.find({
      collection: 'blog-posts',
      where: {
        or: [{ slug: { equals: slug } }, { externalUrl: { equals: rawUrl } }],
      },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length > 0) {
      stats.skippedExisting += 1;
      console.log(`⏭️  [${i + 1}/${PROMO_NEWS_URLS.length}] Ya existe: ${slug}`);
      continue;
    }

    // 2. Fetch del HTML real
    try {
      const res = await fetch(encodedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        stats.failed.push({ url: rawUrl, reason: `HTTP ${res.status}` });
        console.log(`❌ [${i + 1}/${PROMO_NEWS_URLS.length}] Error HTTP ${res.status}: ${rawUrl}`);
        continue;
      }

      const html = await res.text();
      const extracted = extractArticleFromHtml(html);

      if (extracted.blocks.length === 0) {
        stats.failed.push({ url: rawUrl, reason: 'Sin contenido textual extraíble en role="main"' });
        console.log(`⚠️  [${i + 1}/${PROMO_NEWS_URLS.length}] Sin contenido: ${rawUrl}`);
        continue;
      }

      // 3. Descargar y subir imagen principal a Media (si existe)
      let mediaResult: { id: number | string; url: string } | null = null;
      if (extracted.primaryImageUrl) {
        mediaResult = await uploadImageToMedia(
          payload,
          extracted.primaryImageUrl,
          slug,
          extracted.title
        );
        if (mediaResult) {
          stats.mediaUploaded += 1;
        }
      }

      if (!mediaResult) {
        stats.withoutImage.push({ url: rawUrl, slug, title: extracted.title });
      }

      // 4. Crear artículo en colección Blog (blog-posts)
      await payload.create({
        collection: 'blog-posts',
        data: {
          title: extracted.title,
          slug,
          excerpt: extracted.excerpt,
          content: buildLexicalContent(extracted.blocks) as any,
          ...(mediaResult ? { coverImage: mediaResult.id as any, coverImageUrl: mediaResult.url } : {}),
          externalUrl: rawUrl,
          category: 'Promo News',
          brand: inferBrand(extracted.title, slug),
          status: 'published',
        },
        overrideAccess: true,
      });

      stats.created += 1;
      console.log(
        `✅ [${i + 1}/${PROMO_NEWS_URLS.length}] Importado: "${extracted.title}" (slug: ${slug}, img: ${mediaResult ? 'Media OK' : 'Sin imagen'})`
      );
    } catch (err: any) {
      stats.failed.push({ url: rawUrl, reason: err?.message || 'Error desconocido' });
      console.log(`❌ [${i + 1}/${PROMO_NEWS_URLS.length}] Excepción en ${rawUrl}: ${err?.message}`);
    }
  }

  console.log('\n==================== RESUMEN DE IMPORTACIÓN PROMO-NEWS ====================');
  console.log(`Total URLs:             ${stats.total}`);
  console.log(`Creados en Blog:        ${stats.created}`);
  console.log(`Omitidos (ya existían): ${stats.skippedExisting}`);
  console.log(`Imágenes en Media:      ${stats.mediaUploaded}`);
  console.log(`Sin imagen:             ${stats.withoutImage.length}`);
  console.log(`Fallidos:               ${stats.failed.length}`);

  if (stats.withoutImage.length > 0) {
    console.log('\n⚠️ Artículos sin imagen (revisar en /admin):');
    stats.withoutImage.forEach((x) => console.log(`  - ${x.slug}: ${x.title} (${x.url})`));
  }

  if (stats.failed.length > 0) {
    console.log('\n❌ URLs fallidas:');
    stats.failed.forEach((f) => console.log(`  - ${f.url} -> ${f.reason}`));
  }

  console.log('\n🔍 Posibles duplicados temáticos para revisión editorial en /admin:');
  console.log('  - vila-gale-brasil vs vila-galee');
  console.log('  - fit-2025 vs promovere-en-fit-2025');
  console.log('  - primer-congreso-santa-hospitalidad-2025 vs santa-hospitalidad-2025');
  console.log('===========================================================================\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error fatal en import-promo-news:', err);
  process.exit(1);
});
