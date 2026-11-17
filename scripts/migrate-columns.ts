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
  console.log('🔄 Conectando a Supabase PostgreSQL para migrar columnas de Pages y Media...');
  await client.connect();

  // 1. Columnas para pages_blocks_hero
  console.log('📦 Actualizando tabla pages_blocks_hero...');
  await client.query(`
    ALTER TABLE pages_blocks_hero 
      ADD COLUMN IF NOT EXISTS pre_title character varying DEFAULT 'Somos',
      ADD COLUMN IF NOT EXISTS highlighted_word character varying DEFAULT 'Promovêre',
      ADD COLUMN IF NOT EXISTS title_suffix character varying DEFAULT '',
      ADD COLUMN IF NOT EXISTS background_image_id integer REFERENCES media(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS background_image_url character varying;
  `);

  await client.query(`
    UPDATE pages_blocks_hero
    SET 
      pre_title = COALESCE(pre_title, 'Somos'),
      highlighted_word = COALESCE(highlighted_word, 'Promovêre'),
      background_image_url = COALESCE(background_image_url, background_image)
    WHERE pre_title IS NULL OR background_image_url IS NULL;
  `);

  // 2. Columnas para pages_blocks_representations_items
  console.log('📦 Actualizando tabla pages_blocks_representations_items...');
  await client.query(`
    ALTER TABLE pages_blocks_representations_items
      ADD COLUMN IF NOT EXISTS image_id integer REFERENCES media(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS image_url character varying;
  `);

  await client.query(`
    UPDATE pages_blocks_representations_items
    SET image_url = COALESCE(image_url, image)
    WHERE image_url IS NULL;
  `);

  // 3. Columnas para pages_blocks_partners_partners_list
  console.log('📦 Actualizando tabla pages_blocks_partners_partners_list...');
  await client.query(`
    ALTER TABLE pages_blocks_partners_partners_list
      ADD COLUMN IF NOT EXISTS logo_id integer REFERENCES media(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS logo_url character varying;
  `);

  console.log('✅ Columnas migradas con éxito en Supabase PostgreSQL.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando columnas:', err);
  process.exit(1);
});
