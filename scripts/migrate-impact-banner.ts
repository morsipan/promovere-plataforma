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
  console.log('🔄 Conectando a Supabase PostgreSQL para crear tabla pages_blocks_impact_banner...');
  await client.connect();

  console.log('📦 Creando tabla pages_blocks_impact_banner e índices...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS pages_blocks_impact_banner (
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      _path TEXT NOT NULL,
      id CHARACTER VARYING PRIMARY KEY,
      block_name CHARACTER VARYING,
      appearance_background_style CHARACTER VARYING DEFAULT 'gradient',
      appearance_background_color CHARACTER VARYING DEFAULT 'azul',
      appearance_background_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      appearance_theme CHARACTER VARYING DEFAULT 'dark',
      title CHARACTER VARYING,
      subtitle CHARACTER VARYING,
      cta_label CHARACTER VARYING,
      cta_url CHARACTER VARYING,
      cta_icon_only BOOLEAN DEFAULT false,
      secondary_graphic_id INTEGER REFERENCES media(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_impact_banner_order_idx ON pages_blocks_impact_banner (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_impact_banner_parent_id_idx ON pages_blocks_impact_banner (_parent_id);
    CREATE INDEX IF NOT EXISTS pages_blocks_impact_banner_path_idx ON pages_blocks_impact_banner (_path);
    CREATE INDEX IF NOT EXISTS pages_blocks_impact_banner_bg_img_idx ON pages_blocks_impact_banner (appearance_background_image_id);
    CREATE INDEX IF NOT EXISTS pages_blocks_impact_banner_sec_graph_idx ON pages_blocks_impact_banner (secondary_graphic_id);
  `);

  const check = await client.query(`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'pages_blocks_impact_banner' 
    ORDER BY ordinal_position;
  `);

  console.log('✅ Columnas en pages_blocks_impact_banner:');
  console.table(check.rows);

  await client.end();
}

run().catch((err) => {
  console.error('❌ Error creando tabla pages_blocks_impact_banner:', err);
  process.exit(1);
});
