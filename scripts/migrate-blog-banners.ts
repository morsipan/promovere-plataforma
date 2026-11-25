import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para migrar banners de blog_settings.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a PostgreSQL para migrar banners de blog_settings...');
  await client.connect();

  await client.query(`
    ALTER TABLE blog_settings
      ADD COLUMN IF NOT EXISTS show_banner_before_pagination BOOLEAN DEFAULT true;

    CREATE TABLE IF NOT EXISTS blog_settings_banners (
      id CHARACTER VARYING PRIMARY KEY,
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES blog_settings(id) ON DELETE CASCADE,
      enabled BOOLEAN DEFAULT true,
      "order" NUMERIC DEFAULT 0,
      title CHARACTER VARYING,
      image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      image_url CHARACTER VARYING,
      href CHARACTER VARYING
    );

    CREATE INDEX IF NOT EXISTS blog_settings_banners_order_idx ON blog_settings_banners (_order);
    CREATE INDEX IF NOT EXISTS blog_settings_banners_parent_id_idx ON blog_settings_banners (_parent_id);
    CREATE INDEX IF NOT EXISTS blog_settings_banners_image_idx ON blog_settings_banners (image_id);
  `);

  console.log('✅ Migración de blog_settings_banners completada.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando blog_settings_banners:', err);
  process.exit(1);
});
