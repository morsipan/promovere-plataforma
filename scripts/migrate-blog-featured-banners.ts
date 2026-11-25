import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para migrar banners destacados de Promo News.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a PostgreSQL para agregar promo_news_banner1 y promo_news_banner2 en blog_settings...');
  await client.connect();

  await client.query(`
    ALTER TABLE blog_settings
      ADD COLUMN IF NOT EXISTS promo_news_banner1_enabled BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS promo_news_banner1_title CHARACTER VARYING,
      ADD COLUMN IF NOT EXISTS promo_news_banner1_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS promo_news_banner1_mobile_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS promo_news_banner1_image_url CHARACTER VARYING,
      ADD COLUMN IF NOT EXISTS promo_news_banner1_mobile_image_url CHARACTER VARYING,
      ADD COLUMN IF NOT EXISTS promo_news_banner1_href CHARACTER VARYING,
      ADD COLUMN IF NOT EXISTS promo_news_banner2_enabled BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS promo_news_banner2_title CHARACTER VARYING,
      ADD COLUMN IF NOT EXISTS promo_news_banner2_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS promo_news_banner2_mobile_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS promo_news_banner2_image_url CHARACTER VARYING,
      ADD COLUMN IF NOT EXISTS promo_news_banner2_mobile_image_url CHARACTER VARYING,
      ADD COLUMN IF NOT EXISTS promo_news_banner2_href CHARACTER VARYING;

    CREATE INDEX IF NOT EXISTS blog_settings_pnb1_image_idx ON blog_settings (promo_news_banner1_image_id);
    CREATE INDEX IF NOT EXISTS blog_settings_pnb1_mobile_image_idx ON blog_settings (promo_news_banner1_mobile_image_id);
    CREATE INDEX IF NOT EXISTS blog_settings_pnb2_image_idx ON blog_settings (promo_news_banner2_image_id);
    CREATE INDEX IF NOT EXISTS blog_settings_pnb2_mobile_image_idx ON blog_settings (promo_news_banner2_mobile_image_id);
  `);

  console.log('✅ Migración de banners destacados de Promo News completada.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando banners destacados de Promo News:', err);
  process.exit(1);
});
