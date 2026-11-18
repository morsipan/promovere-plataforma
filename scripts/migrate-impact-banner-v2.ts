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
  console.log('🔄 Conectando a Supabase PostgreSQL para actualizar esquema de impact_banner...');
  await client.connect();

  console.log('📦 1. Agregando columnas height, layout y enable_animations a pages_blocks_impact_banner...');
  await client.query(`
    ALTER TABLE pages_blocks_impact_banner 
      ADD COLUMN IF NOT EXISTS appearance_height VARCHAR DEFAULT 'medium',
      ADD COLUMN IF NOT EXISTS appearance_layout VARCHAR DEFAULT 'centered',
      ADD COLUMN IF NOT EXISTS appearance_enable_animations BOOLEAN DEFAULT true;
  `);

  console.log('📦 2. Creando tabla pages_blocks_impact_banner_buttons para el array de botones...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS pages_blocks_impact_banner_buttons (
      _order INTEGER NOT NULL,
      _parent_id CHARACTER VARYING NOT NULL REFERENCES pages_blocks_impact_banner(id) ON DELETE CASCADE,
      id CHARACTER VARYING PRIMARY KEY,
      label CHARACTER VARYING,
      url CHARACTER VARYING,
      style CHARACTER VARYING DEFAULT 'primary'
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_impact_banner_buttons_order_idx 
      ON pages_blocks_impact_banner_buttons (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_impact_banner_buttons_parent_id_idx 
      ON pages_blocks_impact_banner_buttons (_parent_id);
  `);

  const cols = await client.query(`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'pages_blocks_impact_banner' 
    ORDER BY ordinal_position;
  `);
  console.log('✅ Columnas actuales en pages_blocks_impact_banner:');
  console.table(cols.rows);

  const buttonCols = await client.query(`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'pages_blocks_impact_banner_buttons' 
    ORDER BY ordinal_position;
  `);
  console.log('✅ Columnas en pages_blocks_impact_banner_buttons:');
  console.table(buttonCols.rows);

  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando esquema v2 de impact_banner:', err);
  process.exit(1);
});
