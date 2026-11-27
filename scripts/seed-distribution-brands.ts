import fs from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import pg from 'pg';
import { getPayload } from 'payload';
import config from '../payload.config';

const { Client } = pg;

const SOURCE_GRID_IMAGE =
  process.env.DISTRIBUTION_GRID_IMAGE ||
  'C:/Users/agust/.gemini/antigravity/brain/155956bb-5377-4e69-a1ab-8b654a38d1a4/.user_uploaded/media_1795736834146_dae78d61.jpg';

interface BrandCropDef {
  index: number;
  slug: string;
  name: string;
  // Caja [left, top, width, height] normalizada para la grilla 1014 x 550 (5 filas x 4 columnas)
  box: [number, number, number, number];
}

const BRAND_CROPS: BrandCropDef[] = [
  // Fila 1 (y: 0..95)
  { index: 1, slug: 'guamatur-viajes', name: 'Guamatur Viajes', box: [10, 8, 200, 84] },
  { index: 2, slug: 'sevens-operadora-paraguay', name: "Seven's Operadora Paraguay", box: [240, 6, 220, 88] },
  { index: 3, slug: 'intertours', name: 'Intertours', box: [535, 6, 220, 88] },
  { index: 4, slug: 'dtp-travel-group', name: 'DTP Travel Group', box: [815, 6, 185, 88] },
  // Fila 2 (y: 96..202)
  { index: 5, slug: 'free-way', name: 'Free Way', box: [20, 96, 180, 102] },
  { index: 6, slug: 'costamar-travel', name: 'Costamar Travel', box: [225, 100, 245, 96] },
  { index: 7, slug: 'agente-5', name: 'Agente 5', box: [525, 100, 235, 96] },
  { index: 8, slug: 'eurovips', name: 'Eurovips', box: [795, 100, 205, 96] },
  // Fila 3 (y: 204..328)
  { index: 9, slug: 'travel-services', name: 'Travel Services', box: [15, 212, 195, 108] },
  { index: 10, slug: 'maral-turismo', name: 'Maral Turismo', box: [245, 204, 210, 120] },
  { index: 11, slug: 'delfos-tour', name: 'Delfos Tour', box: [545, 204, 195, 124] },
  { index: 12, slug: 'mvn-travel', name: 'MVN Travel', box: [805, 204, 195, 124] },
  // Fila 4 (y: 328..438)
  { index: 13, slug: 'caribetur', name: 'Caribetur', box: [20, 326, 185, 110] },
  { index: 14, slug: 'w-betheworld', name: 'W BeTheWorld', box: [220, 336, 255, 96] },
  { index: 15, slug: 'mybeds-com', name: 'mybeds.com', box: [535, 332, 220, 104] },
  { index: 16, slug: 'tower-travel', name: 'Tower Travel', box: [795, 336, 205, 96] },
  // Fila 5 (y: 440..550)
  { index: 17, slug: 'red-turistica-de-hoteles', name: 'Red Turística de Hoteles', box: [25, 444, 170, 100] },
  { index: 18, slug: 'aeromundo-com-uy', name: 'Aeromundo.com.uy', box: [215, 448, 270, 94] },
  { index: 19, slug: 'jazz-operador-mayorista', name: 'Jazz Operador Mayorista', box: [535, 444, 225, 102] },
  { index: 20, slug: 'act', name: 'ACT', box: [815, 442, 175, 104] },
];

async function cropLogoBuffer(sourcePath: string, box: [number, number, number, number]): Promise<Buffer> {
  const [left, top, width, height] = box;
  const rawCrop = await sharp(sourcePath)
    .extract({ left, top, width, height })
    .png()
    .toBuffer();

  try {
    const trimmed = await sharp(rawCrop)
      .trim({ threshold: 22 })
      .extend({
        top: 10,
        bottom: 10,
        left: 14,
        right: 14,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .webp({ quality: 92 })
      .toBuffer();
    return trimmed;
  } catch {
    return sharp(rawCrop).webp({ quality: 92 }).toBuffer();
  }
}

async function run() {
  const connectionString = process.env.DATABASE_URI || '';
  if (!connectionString) {
    console.error('❌ Falta DATABASE_URI para migrar y sembrar el carrusel de Red de Distribución.');
    process.exit(1);
  }

  if (!fs.existsSync(SOURCE_GRID_IMAGE)) {
    console.error(`❌ No se encontró la imagen fuente de la grilla: ${SOURCE_GRID_IMAGE}`);
    process.exit(1);
  }

  // 1. Migración idempotente de esquema PostgreSQL para DistributionBlock.brandCarousel
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_dist_spd AS ENUM ('slow', 'normal', 'fast');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE pages_blocks_distribution
      ADD COLUMN IF NOT EXISTS carousel_enabled BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS carousel_speed enum_dist_spd DEFAULT 'normal',
      ADD COLUMN IF NOT EXISTS pause_on_hover BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS carousel_title CHARACTER VARYING DEFAULT 'Operadores y Marcas Conectados en LATAM';

    CREATE TABLE IF NOT EXISTS pages_blocks_distribution_brand_carousel (
      id CHARACTER VARYING PRIMARY KEY,
      _order INTEGER NOT NULL,
      _parent_id CHARACTER VARYING NOT NULL REFERENCES pages_blocks_distribution(id) ON DELETE CASCADE,
      name CHARACTER VARYING NOT NULL,
      url CHARACTER VARYING,
      active BOOLEAN DEFAULT true,
      logo_id INTEGER REFERENCES media(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_dist_bc_order_idx
      ON pages_blocks_distribution_brand_carousel (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_dist_bc_parent_idx
      ON pages_blocks_distribution_brand_carousel (_parent_id);
    CREATE INDEX IF NOT EXISTS pages_blocks_dist_bc_logo_idx
      ON pages_blocks_distribution_brand_carousel (logo_id);
  `);

  console.log('✅ Esquema de pages_blocks_distribution_brand_carousel listo.');

  // 2. Recortar los 20 logos individuales y subir/reutilizar cada uno en Payload Media
  const payload = await getPayload({ config });
  const uploadedBrands: Array<{ order: number; name: string; mediaId: number | string; filename: string }> = [];

  for (const item of BRAND_CROPS) {
    const filename = `dist-brand-${String(item.index).padStart(2, '0')}-${item.slug}.webp`;

    const existingMedia = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      overrideAccess: true,
    });

    let mediaId: number | string;
    if (existingMedia.docs.length > 0) {
      mediaId = existingMedia.docs[0].id;
    } else {
      const buffer = await cropLogoBuffer(SOURCE_GRID_IMAGE, item.box);
      const created = await payload.create({
        collection: 'media',
        data: { alt: item.name },
        file: {
          data: buffer,
          mimetype: 'image/webp',
          name: filename,
          size: buffer.length,
        },
        overrideAccess: true,
      });
      mediaId = created.id;
    }

    uploadedBrands.push({
      order: item.index,
      name: item.name,
      mediaId,
      filename,
    });
  }

  console.log(`✅ 20 logos individuales listos en Media.`);

  // 3. Vincular idempotente al bloque Distribution de la Home
  const distBlockRes = await client.query<{ id: string }>(
    `SELECT d.id
     FROM pages_blocks_distribution d
     INNER JOIN pages p ON p.id = d._parent_id
     WHERE p.slug = 'home'
     ORDER BY d._order ASC
     LIMIT 1`
  );

  if (distBlockRes.rows.length === 0) {
    console.warn('⚠️ No se encontró un bloque distribution en la página home.');
    await client.end();
    return;
  }

  const distBlockId = distBlockRes.rows[0].id;

  await client.query(
    `UPDATE pages_blocks_distribution
     SET carousel_enabled = COALESCE(carousel_enabled, true),
         carousel_speed = COALESCE(carousel_speed, 'normal'::enum_dist_spd),
         pause_on_hover = COALESCE(pause_on_hover, true),
         carousel_title = COALESCE(NULLIF(carousel_title, ''), 'Operadores y Marcas Conectados en LATAM')
     WHERE id = $1`,
    [distBlockId]
  );

  const existingCarousel = await client.query<{ name: string }>(
    `SELECT name FROM pages_blocks_distribution_brand_carousel WHERE _parent_id = $1`,
    [distBlockId]
  );
  const existingNames = new Set(existingCarousel.rows.map((r) => r.name.trim().toLowerCase()));

  let linked = 0;
  let skipped = 0;

  for (const b of uploadedBrands) {
    if (existingNames.has(b.name.trim().toLowerCase())) {
      skipped++;
      continue;
    }
    const rowId = crypto.randomBytes(12).toString('hex');
    await client.query(
      `INSERT INTO pages_blocks_distribution_brand_carousel
        (id, _order, _parent_id, name, active, logo_id)
       VALUES ($1, $2, $3, $4, true, $5)`,
      [rowId, b.order, distBlockId, b.name, b.mediaId]
    );
    linked++;
  }

  console.log(
    `✅ Carrusel de Red de Distribución actualizado: ${linked} vinculados nuevos, ${skipped} ya existentes (total: ${
      linked + skipped
    } marcas).`
  );

  await client.end();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error sembrando marcas de Red de Distribución:', err);
  process.exit(1);
});
