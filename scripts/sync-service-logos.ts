import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { getPayload } from 'payload';
import config from '../payload.config';

const { Client } = pg;

const SERVICE_LOGOS = [
  { order: 1, filename: 'servicio-reps.svg', alt: 'Logo Vê REPS® — Representaciones Turísticas' },
  { order: 2, filename: 'servicio-mkt.svg', alt: 'Logo Vê MKT — Marketing Turístico' },
  { order: 3, filename: 'servicio-pr.svg', alt: 'Logo Vê PR — Relaciones Públicas' },
  { order: 4, filename: 'servicio-events.svg', alt: 'Logo Vê EVENTS — Eventos y Caravanas' },
  { order: 5, filename: 'servicio-trade.svg', alt: 'Logo Vê TRADE — Capacitación y Producto' },
  { order: 6, filename: 'servicio-fams.svg', alt: 'Logo Vê FAMS — Fam Tours y Fam Press' },
];

async function main() {
  const payload = await getPayload({ config });
  const connectionString = process.env.DATABASE_URI || '';
  if (!connectionString) {
    console.error('❌ Falta DATABASE_URI.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  for (const item of SERVICE_LOGOS) {
    const filePath = path.resolve(process.cwd(), 'assets', 'SVG', item.filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Archivo no encontrado: ${filePath}`);
      continue;
    }

    const buffer = fs.readFileSync(filePath);

    // Si ya existía un media con el mismo filename, reemplazarlo para asegurar la versión nueva
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: item.filename } },
      limit: 1,
      overrideAccess: true,
    });

    let mediaId: number | string;
    if (existing.docs.length > 0) {
      const updated = await payload.update({
        collection: 'media',
        id: existing.docs[0].id,
        data: { alt: item.alt },
        file: {
          data: buffer,
          mimetype: 'image/svg+xml',
          name: item.filename,
          size: buffer.length,
        },
        overrideAccess: true,
      });
      mediaId = updated.id;
    } else {
      const created = await payload.create({
        collection: 'media',
        data: { alt: item.alt },
        file: {
          data: buffer,
          mimetype: 'image/svg+xml',
          name: item.filename,
          size: buffer.length,
        },
        overrideAccess: true,
      });
      mediaId = created.id;
    }

    // Vincular en la tarjeta correspondiente del bloque Services en PostgreSQL
    await client.query(
      `UPDATE pages_blocks_services_services_list
       SET image_id = $1
       WHERE _order = $2`,
      [mediaId, item.order]
    );

    console.log(`✅ Servicio #${item.order} vinculado a Media #${mediaId} (${item.filename})`);
  }

  await client.end();
  console.log('✅ Sincronización de los 6 logos de Servicios completada.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error sincronizando logos de servicios:', err);
  process.exit(1);
});
