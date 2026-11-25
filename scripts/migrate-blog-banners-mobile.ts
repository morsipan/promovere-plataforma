import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para migrar mobile_image en blog_settings_banners.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a PostgreSQL para agregar mobile_image en blog_settings_banners...');
  await client.connect();

  await client.query(`
    ALTER TABLE blog_settings_banners
      ADD COLUMN IF NOT EXISTS mobile_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS mobile_image_url CHARACTER VARYING;

    CREATE INDEX IF NOT EXISTS blog_settings_banners_mobile_image_idx
      ON blog_settings_banners (mobile_image_id);
  `);

  console.log('✅ Migración de mobile_image en blog_settings_banners completada.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando mobile_image en blog_settings_banners:', err);
  process.exit(1);
});
