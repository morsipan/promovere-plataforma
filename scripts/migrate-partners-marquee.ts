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
  console.log('🔄 Conectando a Supabase PostgreSQL para crear tablas de partners_marquee...');
  await client.connect();

  console.log('📦 Creando tabla pages_blocks_partners_marquee e índices...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS pages_blocks_partners_marquee (
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      _path TEXT NOT NULL,
      id CHARACTER VARYING PRIMARY KEY,
      block_name CHARACTER VARYING,
      title CHARACTER VARYING,
      subtitle CHARACTER VARYING,
      animation_behavior_animation_type CHARACTER VARYING DEFAULT 'infinite-scroll',
      animation_behavior_animation_speed CHARACTER VARYING DEFAULT 'normal',
      image_styles_color_mode CHARACTER VARYING DEFAULT 'grayscale-hover'
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_partners_marquee_order_idx 
      ON pages_blocks_partners_marquee (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_partners_marquee_parent_id_idx 
      ON pages_blocks_partners_marquee (_parent_id);
    CREATE INDEX IF NOT EXISTS pages_blocks_partners_marquee_path_idx 
      ON pages_blocks_partners_marquee (_path);

    CREATE TABLE IF NOT EXISTS pages_blocks_partners_marquee_logos (
      _order INTEGER NOT NULL,
      _parent_id CHARACTER VARYING NOT NULL REFERENCES pages_blocks_partners_marquee(id) ON DELETE CASCADE,
      id CHARACTER VARYING PRIMARY KEY,
      logo_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
      link CHARACTER VARYING
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_partners_marquee_logos_order_idx 
      ON pages_blocks_partners_marquee_logos (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_partners_marquee_logos_parent_id_idx 
      ON pages_blocks_partners_marquee_logos (_parent_id);
    CREATE INDEX IF NOT EXISTS pages_blocks_partners_marquee_logos_logo_idx 
      ON pages_blocks_partners_marquee_logos (logo_id);
  `);

  const cols = await client.query(`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'pages_blocks_partners_marquee' 
    ORDER BY ordinal_position;
  `);
  console.log('✅ Columnas en pages_blocks_partners_marquee:');
  console.table(cols.rows);

  const logoCols = await client.query(`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'pages_blocks_partners_marquee_logos' 
    ORDER BY ordinal_position;
  `);
  console.log('✅ Columnas en pages_blocks_partners_marquee_logos:');
  console.table(logoCols.rows);

  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando tablas de partners_marquee:', err);
  process.exit(1);
});
