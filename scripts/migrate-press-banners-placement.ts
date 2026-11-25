import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para migrar placement de banners.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a PostgreSQL para agregar placement en blog_settings_banners...');
  await client.connect();

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_bs_bnr_plc AS ENUM ('ambos', 'prensa', 'contenidos');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE blog_settings_banners
      ADD COLUMN IF NOT EXISTS placement enum_bs_bnr_plc DEFAULT 'ambos';
  `);

  console.log('✅ Migración de placement en blog_settings_banners completada.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando placement en blog_settings_banners:', err);
  process.exit(1);
});
