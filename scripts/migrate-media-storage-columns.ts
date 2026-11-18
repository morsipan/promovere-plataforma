import pg from 'pg';
const { Client } = pg;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI,
  });
  await client.connect();
  console.log('Connected to Postgres.');

  // 1. Agregar _objectkey si no existe
  await client.query(`
    ALTER TABLE "media" 
    ADD COLUMN IF NOT EXISTS "_objectkey" character varying,
    ADD COLUMN IF NOT EXISTS "prefix" character varying;
  `);
  console.log('Columns _objectkey and prefix added successfully.');

  // Verificar columnas
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'media'
    ORDER BY ordinal_position;
  `);
  console.table(res.rows);

  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
