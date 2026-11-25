import pg from 'pg';

const { Client } = pg;

interface VideoSeedItem {
  videoId: string;
  title: string;
  mediaOutlet: string;
  summary: string;
  publishedDate: string | null;
}

const PRESS_VIDEOS: VideoSeedItem[] = [
  {
    videoId: 'boIe2Tb9X0A',
    title: 'MODO DIRECTO - ANDREA TOSI - ¡TODA LA MARAVILLA DEL CARIBE MEXICANO!',
    mediaOutlet: 'Modo Directo',
    summary: 'Entrevista a Andrea Tosi en Modo Directo sobre las novedades y atractivos del Caribe Mexicano.',
    publishedDate: null,
  },
  {
    videoId: 'Uv_KvEsKSWI',
    title: '#TenesQueIr l Programa del 13 de mayo de 2026 - Islas Caiman - Parte 2',
    mediaOutlet: '#TenesQueIr',
    summary: 'Segunda parte del especial de #TenesQueIr dedicado a las Islas Caimán.',
    publishedDate: '2026-05-13T12:00:00.000Z',
  },
  {
    videoId: '14HVihijNO0',
    title: '#TenesQueIr l Programa del 28 de Marzo de 2026 - Las Islas Caimán',
    mediaOutlet: '#TenesQueIr',
    summary: 'Cobertura especial de #TenesQueIr recorriendo los principales atractivos de Las Islas Caimán.',
    publishedDate: '2026-03-28T12:00:00.000Z',
  },
  {
    videoId: 'FgAU4THbt3E',
    title: 'MODO DIRECTO - CRISTELL LOPEZ - HOTELES SOLARIS, MAS DE 30 AÑOS EN EL CARIBE MEXICANO',
    mediaOutlet: 'Modo Directo',
    summary: 'Entrevista con Cristell López sobre la trayectoria de más de 30 años de Hoteles Solaris en el Caribe Mexicano.',
    publishedDate: null,
  },
  {
    videoId: 'qiAYtQZIlSQ',
    title: 'RESTO DEL MUNDO - Programa 03/01/26 - LAS MEJORES PLAYAS DEL MUNDO',
    mediaOutlet: 'Resto del Mundo',
    summary: 'Programa completo de Resto del Mundo destacando las mejores playas del mundo.',
    publishedDate: '2026-01-03T12:00:00.000Z',
  },
  {
    videoId: 'xnFgUdr0kVY',
    title: 'La Habana, Cuba: Guagua, Malecón y charlas con locales #Pedalearg | Programa Completo (25/01/26)',
    mediaOutlet: '#Pedalearg',
    summary: 'Programa completo de #Pedalearg recorriendo La Habana, el Malecón y su cultura local en Cuba.',
    publishedDate: '2026-01-25T12:00:00.000Z',
  },
  {
    videoId: 'AG_jg9SPNS0',
    title: 'CUBA: Taxis, comidas locales y snorkel en el Caribe #Pedalearg | Programa Completo (08/11/25)',
    mediaOutlet: '#Pedalearg',
    summary: 'Programa completo de #Pedalearg explorando la gastronomía local y experiencias en el Caribe cubano.',
    publishedDate: '2025-11-08T12:00:00.000Z',
  },
  {
    videoId: 'c9DWR557beA',
    title: 'RESTO DEL MUNDO - Programa 08/11/25 - LITTLE CAYMAN',
    mediaOutlet: 'Resto del Mundo',
    summary: 'Cobertura audiovisual de Resto del Mundo dedicada a Little Cayman en las Islas Caimán.',
    publishedDate: '2025-11-08T12:00:00.000Z',
  },
  {
    videoId: 'x5kfct8MKik',
    title: 'CAYO SANTA MARIA | CUBA | DESTINOS Y SABORES | TURISMO INTERNACIONAL',
    mediaOutlet: 'Destinos y Sabores',
    summary: 'Especial de Destinos y Sabores sobre turismo internacional y experiencias en Cayo Santa María, Cuba.',
    publishedDate: null,
  },
  {
    videoId: 'pSFo5jpyvoI',
    title: 'ASÍ ES LA HABANA DESDE ADENTRO| Rumbo Producciones',
    mediaOutlet: 'Rumbo Producciones',
    summary: 'Cobertura de Rumbo Producciones mostrando La Habana desde adentro.',
    publishedDate: null,
  },
  {
    videoId: 'oG9-_fxSncQ',
    title: 'ENTREVISTA EXCLUSIVA CON ANDREA TOSI DE ISLAS CAIMÁN | CNN X Rumbo',
    mediaOutlet: 'CNN X Rumbo',
    summary: 'Entrevista exclusiva con Andrea Tosi sobre el posicionamiento y novedades de Islas Caimán.',
    publishedDate: null,
  },
  {
    videoId: 'Q2L5W5MmI84',
    title: 'EL CIERRE DE DESTINOS GAVIOTA EN TURISMO A LA CARTA | Rumbo Producciones',
    mediaOutlet: 'Rumbo Producciones',
    summary: 'Cobertura de Rumbo Producciones sobre el cierre de Destinos Gaviota en Turismo a la Carta.',
    publishedDate: null,
  },
  {
    videoId: 'HMVfwEbmNwk',
    title: 'EL CIERRE DE FIT Y TODAS SUS NOVEDADES | CNN X Rumbo',
    mediaOutlet: 'CNN X Rumbo',
    summary: 'Balance del cierre de la Feria Internacional de Turismo (FIT) y sus novedades junto a CNN X Rumbo.',
    publishedDate: null,
  },
  {
    videoId: 'P7uk3yd5Wic',
    title: 'RESTO DEL MUNDO - Programa 16/08/25 - LAS ISLAS CAIMÁN, CARIBE',
    mediaOutlet: 'Resto del Mundo',
    summary: 'Programa de Resto del Mundo dedicado a Las Islas Caimán en el Caribe.',
    publishedDate: '2025-08-16T12:00:00.000Z',
  },
  {
    videoId: 'MiiFAX14kO0',
    title: 'DESTINOS GAVIOTA DESDE ADENTRO | Rumbo Producciones',
    mediaOutlet: 'Rumbo Producciones',
    summary: 'Cobertura especial de Rumbo Producciones mostrando Destinos Gaviota desde adentro.',
    publishedDate: null,
  },
  {
    videoId: 'fqJ8OvmET-g',
    title: 'LLEGADA A CUBA PARA FIT | CNN X Rumbo Trade',
    mediaOutlet: 'CNN X Rumbo Trade',
    summary: 'Cobertura de CNN X Rumbo Trade sobre la llegada a Cuba en el marco de FIT.',
    publishedDate: null,
  },
];

function extractYouTubeId(urlStr?: string | null): string | null {
  if (!urlStr) return null;
  const embedMatch = /\/embed\/([A-Za-z0-9_-]{11})/.exec(urlStr);
  if (embedMatch) return embedMatch[1];
  const watchMatch = /[?&]v=([A-Za-z0-9_-]{11})/.exec(urlStr);
  if (watchMatch) return watchMatch[1];
  const shortMatch = /youtu\.be\/([A-Za-z0-9_-]{11})/.exec(urlStr);
  if (shortMatch) return shortMatch[1];
  return null;
}

async function run() {
  const connectionString = process.env.DATABASE_URI || '';
  if (!connectionString) {
    console.error('❌ Falta DATABASE_URI para importar videos de entrevistas y coberturas.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const existingRes = await client.query<{ video_url: string | null }>(
    `SELECT video_url FROM press_items WHERE format = 'video' AND video_url IS NOT NULL`
  );

  const existingIds = new Set<string>();
  for (const row of existingRes.rows) {
    const id = extractYouTubeId(row.video_url);
    if (id) existingIds.add(id);
  }

  let inserted = 0;
  let skipped = 0;

  for (const v of PRESS_VIDEOS) {
    if (existingIds.has(v.videoId)) {
      skipped++;
      continue;
    }

    const embedUrl = `https://www.youtube.com/embed/${v.videoId}`;
    const thumbUrl = `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`;

    await client.query(
      `INSERT INTO press_items
        (title, media_outlet, format, summary, video_url, cover_image_url, status, published_date, updated_at, created_at)
       VALUES ($1, $2, 'video'::enum_press_fmt, $3, $4, $5, 'published'::enum_press_st, $6, now(), now())`,
      [v.title, v.mediaOutlet, v.summary, embedUrl, thumbUrl, v.publishedDate]
    );
    existingIds.add(v.videoId);
    inserted++;
  }

  const totalRes = await client.query<{ total: number }>(
    `SELECT COUNT(*)::int AS total FROM press_items WHERE format = 'video'`
  );

  console.log('✅ Importación de Entrevistas y Coberturas (Videos) finalizada:');
  console.log(`   - Videos en catálogo: ${PRESS_VIDEOS.length}`);
  console.log(`   - Insertados nuevos:  ${inserted}`);
  console.log(`   - Omitidos duplicados: ${skipped}`);
  console.log(`   - Total videos en BD: ${totalRes.rows[0].total}`);

  await client.end();
}

run().catch((err) => {
  console.error('❌ Error importando videos de Prensa:', err);
  process.exit(1);
});
