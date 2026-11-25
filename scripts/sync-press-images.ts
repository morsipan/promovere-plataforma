import { getPayload } from 'payload';
import config from '../payload.config';

function getExtFromMime(mime: string): string {
  const lower = mime.toLowerCase();
  if (lower.includes('png')) return 'png';
  if (lower.includes('webp')) return 'webp';
  if (lower.includes('gif')) return 'gif';
  if (lower.includes('avif')) return 'avif';
  return 'jpg';
}

function slugifyShort(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'nota';
}

function decodeHtmlAttr(val: string): string {
  return val
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function isLikelyLogoOrJunk(urlStr: string): boolean {
  const lower = urlStr.toLowerCase();
  return (
    lower.startsWith('data:') ||
    lower.includes('favicon') ||
    lower.includes('gravatar') ||
    lower.includes('pixel') ||
    lower.includes('doubleclick') ||
    lower.includes('googlesyndication') ||
    lower.includes('/emoji/') ||
    lower.endsWith('.svg') ||
    lower.endsWith('.ico')
  );
}

function extractMetaImage(html: string, baseUrl: string): string[] {
  const candidates: string[] = [];
  const addCandidate = (raw?: string | null) => {
    if (!raw) return;
    const decoded = decodeHtmlAttr(raw);
    if (!decoded || isLikelyLogoOrJunk(decoded)) return;
    try {
      const resolved = new URL(decoded, baseUrl).toString();
      if (/^https?:\/\//i.test(resolved) && !candidates.includes(resolved)) {
        candidates.push(resolved);
      }
    } catch {}
  };

  // 1. <meta property="og:image..." content="..."> (ambos órdenes de atributos)
  const metaRegex = /<meta\s+[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRegex.exec(html)) !== null) {
    const tag = m[0];
    const propMatch = /(?:property|name)=["']([^"']+)["']/i.exec(tag);
    const contentMatch = /content=["']([^"']+)["']/i.exec(tag);
    if (!propMatch || !contentMatch) continue;
    const key = propMatch[1].toLowerCase().trim();
    if (
      key === 'og:image' ||
      key === 'og:image:secure_url' ||
      key === 'og:image:url' ||
      key === 'twitter:image' ||
      key === 'twitter:image:src'
    ) {
      addCandidate(contentMatch[1]);
    }
  }

  // 2. <link rel="image_src" href="...">
  const linkImgMatch =
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i.exec(html) ||
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']image_src["']/i.exec(html);
  if (linkImgMatch) {
    addCandidate(linkImgMatch[1]);
  }

  // 3. JSON-LD "image"
  const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jm: RegExpExecArray | null;
  while ((jm = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(jm[1]);
      const queue = Array.isArray(parsed) ? [...parsed] : [parsed];
      while (queue.length > 0) {
        const node = queue.shift();
        if (!node || typeof node !== 'object') continue;
        if (Array.isArray(node['@graph'])) queue.push(...node['@graph']);
        const img = node.image;
        if (typeof img === 'string') {
          addCandidate(img);
        } else if (Array.isArray(img)) {
          for (const entry of img) {
            if (typeof entry === 'string') addCandidate(entry);
            else if (entry && typeof entry.url === 'string') addCandidate(entry.url);
          }
        } else if (img && typeof img === 'object' && typeof img.url === 'string') {
          addCandidate(img.url);
        }
      }
    } catch {}
  }

  // 4. Primeras <img> editoriales dentro de <article> o <main>
  const articleMatch =
    /<article[\s\S]*?<\/article>/i.exec(html) || /<main[\s\S]*?<\/main>/i.exec(html);
  if (articleMatch) {
    const imgRegex = /<img[^>]+(?:data-src|data-lazy-src|src)=["']([^"']+)["'][^>]*>/gi;
    let im: RegExpExecArray | null;
    while ((im = imgRegex.exec(articleMatch[0])) !== null) {
      if (!/logo|icon|avatar/i.test(im[0])) {
        addCandidate(im[1]);
      }
      if (candidates.length >= 6) break;
    }
  }

  return candidates;
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-AR,es;q=0.9,en;q=0.7',
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct && !ct.includes('text/html') && !ct.includes('application/xhtml')) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function downloadImage(
  imageUrl: string,
  referer: string
): Promise<{ buffer: Buffer; mime: string } | null> {
  try {
    const res = await fetch(imageUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        Referer: referer,
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const mime = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!mime.startsWith('image/') || mime.includes('svg') || mime.includes('icon')) return null;

    const ab = await res.arrayBuffer();
    const buffer = Buffer.from(ab);
    if (buffer.length < 2000 || buffer.length > 10 * 1024 * 1024) return null;
    return { buffer, mime };
  } catch {
    return null;
  }
}

async function main() {
  const payload = await getPayload({ config });

  const pressRes = await payload.find({
    collection: 'press-items',
    where: {
      and: [
        { format: { equals: 'nota' } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 200,
    depth: 1,
    overrideAccess: true,
  });

  const allNotes = pressRes.docs || [];
  console.log(`🔍 Revisando ${allNotes.length} notas de prensa en Payload CMS...`);

  const stats = {
    total: allNotes.length,
    alreadyHadMedia: 0,
    linkedNew: 0,
    fallback: [] as Array<{ id: number | string; title: string; outlet: string; url: string; reason: string }>,
  };

  // Procesar con concurrencia acotada (6 en paralelo para velocidad sin saturar)
  const pending = allNotes.filter((doc: any) => {
    const hasCoverMedia = Boolean(doc.coverImage);
    const hasApiUrl =
      typeof doc.coverImageUrl === 'string' && doc.coverImageUrl.startsWith('/api/media/file/');
    if (hasCoverMedia && hasApiUrl) {
      stats.alreadyHadMedia++;
      return false;
    }
    return true;
  });

  console.log(
    `📦 Ya vinculadas a Media: ${stats.alreadyHadMedia} | Pendientes de extracción: ${pending.length}`
  );

  const CONCURRENCY = 6;
  let cursor = 0;

  async function worker() {
    while (cursor < pending.length) {
      const idx = cursor++;
      const doc: any = pending[idx];
      const articleUrl = (doc.articleUrl || '').trim();
      const title = doc.title || `Nota ${doc.id}`;
      const outlet = doc.mediaOutlet || 'Medio';

      if (!articleUrl || !/^https?:\/\//i.test(articleUrl)) {
        stats.fallback.push({
          id: doc.id,
          title,
          outlet,
          url: articleUrl || '(sin URL)',
          reason: 'Sin URL externa válida',
        });
        continue;
      }

      const html = await fetchHtml(articleUrl);
      if (!html) {
        stats.fallback.push({
          id: doc.id,
          title,
          outlet,
          url: articleUrl,
          reason: 'Origen bloqueado / timeout al leer HTML',
        });
        console.log(`⚠️  [${idx + 1}/${pending.length}] Fallback (HTML bloqueado): ${title}`);
        continue;
      }

      const imageCandidates = extractMetaImage(html, articleUrl);
      if (imageCandidates.length === 0) {
        stats.fallback.push({
          id: doc.id,
          title,
          outlet,
          url: articleUrl,
          reason: 'Sin og:image ni imagen editorial detectada',
        });
        console.log(`⚠️  [${idx + 1}/${pending.length}] Fallback (sin imagen en HTML): ${title}`);
        continue;
      }

      let downloaded: { buffer: Buffer; mime: string } | null = null;
      for (const candidateUrl of imageCandidates.slice(0, 4)) {
        downloaded = await downloadImage(candidateUrl, articleUrl);
        if (downloaded) break;
      }

      if (!downloaded) {
        stats.fallback.push({
          id: doc.id,
          title,
          outlet,
          url: articleUrl,
          reason: 'No se pudo descargar la imagen remota',
        });
        console.log(`⚠️  [${idx + 1}/${pending.length}] Fallback (descarga bloqueada): ${title}`);
        continue;
      }

      const ext = getExtFromMime(downloaded.mime);
      const filename = `press-${doc.id}-${slugifyShort(title)}.${ext}`;

      try {
        // Reutilizar si ya existe en Media
        const existingMedia = await payload.find({
          collection: 'media',
          where: { filename: { equals: filename } },
          limit: 1,
          overrideAccess: true,
        });

        let mediaDoc: any;
        if (existingMedia.docs.length > 0) {
          mediaDoc = existingMedia.docs[0];
        } else {
          mediaDoc = await payload.create({
            collection: 'media',
            data: { alt: `${title} — ${outlet}` },
            file: {
              data: downloaded.buffer,
              mimetype: downloaded.mime,
              name: filename,
              size: downloaded.buffer.length,
            },
            overrideAccess: true,
          });
        }

        const mediaUrl =
          mediaDoc.url || `/api/media/file/${encodeURIComponent(mediaDoc.filename || filename)}`;

        await payload.update({
          collection: 'press-items',
          id: doc.id,
          data: {
            coverImage: mediaDoc.id,
            coverImageUrl: mediaUrl,
          },
          overrideAccess: true,
        });

        stats.linkedNew++;
        console.log(`✅ [${idx + 1}/${pending.length}] Vinculada: ${filename} -> "${title}"`);
      } catch (err: any) {
        stats.fallback.push({
          id: doc.id,
          title,
          outlet,
          url: articleUrl,
          reason: `Error subiendo a Media: ${err?.message || 'desconocido'}`,
        });
        console.log(`❌ [${idx + 1}/${pending.length}] Error Media en "${title}": ${err?.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  console.log('\n==================== RESUMEN IMÁGENES DE PRENSA ====================');
  console.log(`Total notas revisadas:        ${stats.total}`);
  console.log(`Ya tenían Media:              ${stats.alreadyHadMedia}`);
  console.log(`Vinculadas nuevas a Media:    ${stats.linkedNew}`);
  console.log(`Total con imagen Media OK:    ${stats.alreadyHadMedia + stats.linkedNew}`);
  console.log(`Con fallback visual seguro:   ${stats.fallback.length}`);
  if (stats.fallback.length > 0) {
    console.log('\nNotas con fallback visual:');
    for (const f of stats.fallback) {
      console.log(`  - [id:${f.id}] ${f.outlet} | ${f.title} (${f.reason})`);
    }
  }
  console.log('====================================================================\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error fatal en sync-press-images:', err);
  process.exit(1);
});
