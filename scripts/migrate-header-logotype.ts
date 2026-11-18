import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URI });

async function migrateHeader() {
  await client.connect();
  console.log('1. Conectado a PostgreSQL.');

  console.log('2. Agregando columna logo_type_image_id a la tabla header...');
  await client.query(`
    ALTER TABLE header 
    ADD COLUMN IF NOT EXISTS logo_type_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL;
  `);

  console.log('3. Verificando columnas de header...');
  const res = await client.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'header'
    ORDER BY ordinal_position;
  `);
  console.log(res.rows);

  await client.end();
  console.log('Migración completada con éxito.');
}

migrateHeader().catch((err) => {
  console.error('Error en migración:', err);
  process.exit(1);
});
