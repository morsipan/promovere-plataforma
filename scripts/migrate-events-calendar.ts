import pg from 'pg';
const { Client } = pg;

const connectionString =
  process.env.DATABASE_URI ||
  'postgresql://postgres.nfbutyeottopxphyykdh:lucasycarla2026@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a Supabase PostgreSQL para actualizar community_events...');
  await client.connect();

  console.log('📦 1. Agregando valor fam_trip a enum_ce_modality...');
  await client.query(`
    ALTER TYPE enum_ce_modality ADD VALUE IF NOT EXISTS 'fam_trip';
  `);

  console.log('📦 2. Agregando columna featured a community_events...');
  await client.query(`
    ALTER TABLE community_events
      ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
  `);

  console.log('🌱 3. Marcando el primer evento como destacado y verificando Fam Tour de ejemplo...');
  await client.query(`
    UPDATE community_events
    SET featured = true
    WHERE id = (SELECT id FROM community_events ORDER BY id ASC LIMIT 1);
  `);

  const famCheck = await client.query(
    `SELECT COUNT(*)::int AS total FROM community_events WHERE modality = 'fam_trip'`
  );
  if (famCheck.rows[0].total === 0) {
    const reps = await client.query(
      `SELECT id, title FROM representations WHERE title = 'México' LIMIT 1`
    );
    const mexicoId = reps.rows[0]?.id || null;

    const fam = await client.query(
      `INSERT INTO community_events (title, modality, event_date, location_or_platform, speaker, description, registration_url, representation_id, status, featured)
       VALUES ($1, 'fam_trip', now() + interval '25 days', 'Riviera Maya & Playa Mujeres, México', 'Equipo Comercial Promovêre', $2, 'mailto:marketing@promovere.com.ar?subject=Postulacion%20Fam%20Tour%20Caribe%20Mexicano', $3, 'active', true)
       RETURNING id`,
      [
        'Fam Tour Caribe Mexicano & Atelier Playa Mujeres',
        'Viaje de familiarización exclusivo para agentes y operadores top sellers. Incluye visitas de inspección, experiencias gastronómicas y networking directo con la cadena.',
        mexicoId,
      ]
    );
    await client.query(
      `INSERT INTO community_events_visible_for ("order", parent_id, value) VALUES (1, $1, 'mayorista'), (2, $1, 'minorista')`,
      [fam.rows[0].id]
    );
    console.log('✅ Fam Tour de ejemplo agregado y destacado.');
  }

  console.log('✅ Migración de community_events (calendario + destacados) completada.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando community_events:', err);
  process.exit(1);
});
