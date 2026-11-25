import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';
if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para migrar analytics_events.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a PostgreSQL para crear la tabla analytics_events...');
  await client.connect();

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_ae_type AS ENUM ('page_view', 'click', 'conversion');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_ae_dev AS ENUM ('desktop', 'mobile');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS analytics_events (
      id SERIAL PRIMARY KEY,
      event_type enum_ae_type NOT NULL,
      path CHARACTER VARYING NOT NULL,
      label CHARACTER VARYING NOT NULL,
      banner_id CHARACTER VARYING,
      section CHARACTER VARYING,
      device enum_ae_dev NOT NULL DEFAULT 'desktop',
      updated_at TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
      created_at TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS analytics_events_event_type_idx ON analytics_events (event_type);
    CREATE INDEX IF NOT EXISTS analytics_events_path_idx ON analytics_events (path);
    CREATE INDEX IF NOT EXISTS analytics_events_banner_id_idx ON analytics_events (banner_id);
    CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events (created_at);
    CREATE INDEX IF NOT EXISTS analytics_events_updated_at_idx ON analytics_events (updated_at);

    ALTER TABLE payload_locked_documents_rels
      ADD COLUMN IF NOT EXISTS analytics_events_id INTEGER REFERENCES analytics_events(id) ON DELETE CASCADE;

    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_analytics_events_id_idx
      ON payload_locked_documents_rels (analytics_events_id);
  `);

  console.log('✅ Migración de analytics_events completada.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando analytics_events:', err);
  process.exit(1);
});
