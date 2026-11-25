import pg from 'pg';
import {
  heroContent,
  servicesContent,
  representationsContent,
  distributionContent,
  partnersContent,
} from '../data/content';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para sincronizar el copy de la Home.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Sincronizando copy y proporciones de Home en Supabase (sin tocar logos ni media)...');
  await client.connect();

  const homeRes = await client.query(`SELECT id FROM pages WHERE slug = 'home' LIMIT 1`);
  if (homeRes.rows.length === 0) {
    console.log('ℹ️ No existe página home en pages.');
    await client.end();
    return;
  }
  const homeId = homeRes.rows[0].id;

  // 1. Hero Banner subtitle (no toca imagen de fondo ni navbar)
  await client.query(
    `UPDATE pages_blocks_hero SET subtitle = $1 WHERE _parent_id = $2`,
    [heroContent.subtitle, homeId]
  );

  // 2. Banner de Comunidad (FullWidthImage) -> altura natural y contenido en max-w-7xl
  await client.query(
    `UPDATE pages_blocks_full_width_image SET height = 'natural', full_bleed = false WHERE _parent_id = $1`,
    [homeId]
  );

  // 3. Servicios 4, 5 y 6 (Events, Trade, FAMS) — SIN tocar image_id / custom_icon_id
  const svcBlockRes = await client.query(
    `SELECT id FROM pages_blocks_services WHERE _parent_id = $1 LIMIT 1`,
    [homeId]
  );
  if (svcBlockRes.rows.length > 0) {
    const svcBlockId = svcBlockRes.rows[0].id;
    const svcItemsRes = await client.query(
      `SELECT id, _order FROM pages_blocks_services_services_list WHERE _parent_id = $1 ORDER BY _order`,
      [svcBlockId]
    );

    // Actualizar solo los textos y highlights de los ítems 4 (Events), 5 (Trade) y 6 (FAMS) preservando logos
    for (let idx = 3; idx < Math.min(svcItemsRes.rows.length, servicesContent.services.length); idx++) {
      const row = svcItemsRes.rows[idx];
      const target = servicesContent.services[idx];
      await client.query(
        `UPDATE pages_blocks_services_services_list
         SET title = $1, subtitle = $2, description = $3
         WHERE id = $4`,
        [target.title, target.subtitle, target.description, row.id]
      );

      // Actualizar sus 4 highlights
      const hlRes = await client.query(
        `SELECT id, _order FROM pages_blocks_services_services_list_highlights WHERE _parent_id = $1 ORDER BY _order`,
        [row.id]
      );
      for (let h = 0; h < Math.min(hlRes.rows.length, target.highlights.length); h++) {
        await client.query(
          `UPDATE pages_blocks_services_services_list_highlights SET item = $1 WHERE id = $2`,
          [target.highlights[h], hlRes.rows[h].id]
        );
      }
    }
  }

  // 4. Nuestras Representaciones (título y bajada)
  await client.query(
    `UPDATE pages_blocks_representations
     SET badge = $1, title = $2, subtitle = $3
     WHERE _parent_id = $4`,
    [
      representationsContent.badge,
      representationsContent.title,
      representationsContent.subtitle,
      homeId,
    ]
  );

  // 5. Red de Distribución LATAM (4 indicadores exactos)
  const distBlockRes = await client.query(
    `SELECT id FROM pages_blocks_distribution WHERE _parent_id = $1 LIMIT 1`,
    [homeId]
  );
  if (distBlockRes.rows.length > 0) {
    const distBlockId = distBlockRes.rows[0].id;
    const statsRes = await client.query(
      `SELECT id, _order FROM pages_blocks_distribution_stats WHERE _parent_id = $1 ORDER BY _order`,
      [distBlockId]
    );
    for (let i = 0; i < Math.min(statsRes.rows.length, distributionContent.stats.length); i++) {
      const st = distributionContent.stats[i];
      await client.query(
        `UPDATE pages_blocks_distribution_stats SET value = $1, label = $2 WHERE id = $3`,
        [st.value, st.label, statsRes.rows[i].id]
      );
    }
  }

  // 6. Nuestras Campañas (antes Alianzas Estratégicas)
  await client.query(
    `UPDATE pages_blocks_partners
     SET badge = $1, title = $2, subtitle = $3, cta_label = $4, cta_href = $5
     WHERE _parent_id = $6`,
    [
      partnersContent.badge,
      partnersContent.title,
      partnersContent.subtitle,
      partnersContent.ctaLabel,
      partnersContent.ctaHref,
      homeId,
    ]
  );

  console.log('✅ Copy de Home y escala de Banners sincronizados en Supabase sin alterar logos ni media.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error sincronizando Home:', err);
  process.exit(1);
});
