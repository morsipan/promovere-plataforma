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
  console.log('🔄 Conectando a Supabase PostgreSQL para migrar columna avatar en users...');
  await client.connect();

  console.log('📦 Verificando y agregando columna avatar_id a tabla users...');
  await client.query(`
    ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS avatar_id integer REFERENCES media(id) ON DELETE SET NULL;
  `);

  const check = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'avatar_id';
  `);

  if (check.rows.length > 0) {
    console.log('✅ Columna avatar_id agregada/verificada exitosamente en tabla users:', check.rows[0]);
  } else {
    console.warn('⚠️ No se pudo verificar la columna avatar_id.');
  }

  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando columna avatar_id en users:', err);
  process.exit(1);
});
