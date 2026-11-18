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
  console.log('🔄 Conectando a Supabase PostgreSQL para migrar columna link_type en pages_blocks_full_width_image...');
  await client.connect();

  console.log('📦 Verificando y agregando columna link_type...');
  await client.query(`
    ALTER TABLE pages_blocks_full_width_image 
      ADD COLUMN IF NOT EXISTS link_type VARCHAR DEFAULT 'cta';
  `);

  const check = await client.query(`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'pages_blocks_full_width_image' 
    ORDER BY ordinal_position;
  `);

  console.log('✅ Columnas actuales en pages_blocks_full_width_image:');
  console.table(check.rows);

  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando columna link_type:', err);
  process.exit(1);
});
