import pg from 'pg';
const { Client } = pg;

const connectionString =
  process.env.DATABASE_URI ||
  'postgresql://postgres.nfbutyeottopxphyykdh:lucasycarla2026@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const blockTables = [
  'pages_blocks_hero',
  'pages_blocks_services',
  'pages_blocks_representations',
  'pages_blocks_distribution',
  'pages_blocks_partners',
  'pages_blocks_contact',
  'pages_blocks_faq',
  'pages_blocks_testimonials',
  'pages_blocks_cta_banner',
  'pages_blocks_stats',
  'pages_blocks_gallery',
  'pages_blocks_timeline',
  'pages_blocks_rich_text',
  'pages_blocks_anim_counter',
  'pages_blocks_promovere_anim_counter',
  'anim_counter',
];

async function run() {
  console.log('🔄 Conectando a Supabase PostgreSQL para migrar columnas de Apariencia...');
  await client.connect();

  for (const tableName of blockTables) {
    // Verificar si la tabla existe antes de alterar
    const checkRes = await client.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = '${tableName}';
    `);

    if (checkRes.rows.length === 0) {
      console.log(`⏩ Tabla ${tableName} no existe, omitiendo.`);
      continue;
    }

    console.log(`📦 Agregando columnas de apariencia en ${tableName}...`);
    await client.query(`
      ALTER TABLE "${tableName}"
        ADD COLUMN IF NOT EXISTS appearance_background_color character varying DEFAULT 'blancoHumo',
        ADD COLUMN IF NOT EXISTS appearance_theme character varying DEFAULT 'light',
        ADD COLUMN IF NOT EXISTS appearance_overlay_opacity character varying DEFAULT 'media',
        ADD COLUMN IF NOT EXISTS appearance_background_image_id integer REFERENCES media(id) ON DELETE SET NULL;
    `);
  }

  console.log('✅ Migración de columnas de apariencia completada con éxito en Supabase.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error en la migración de apariencia:', err);
  process.exit(1);
});
