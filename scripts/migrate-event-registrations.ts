import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para migrar event_registrations.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a PostgreSQL para crear tabla event_registrations...');
  await client.connect();

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_er_status AS ENUM ('registered', 'cancelled');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS event_registrations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_id INTEGER NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
      representation_id INTEGER REFERENCES representations(id) ON DELETE SET NULL,
      event_title CHARACTER VARYING NOT NULL,
      event_modality CHARACTER VARYING,
      brand_name CHARACTER VARYING,
      user_name CHARACTER VARYING,
      user_email CHARACTER VARYING,
      user_company CHARACTER VARYING,
      user_role CHARACTER VARYING,
      status enum_er_status NOT NULL DEFAULT 'registered',
      updated_at TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
      created_at TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now()
    );

    CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_user_event_uidx
      ON event_registrations (user_id, event_id);
    CREATE INDEX IF NOT EXISTS event_registrations_user_idx ON event_registrations (user_id);
    CREATE INDEX IF NOT EXISTS event_registrations_event_idx ON event_registrations (event_id);
    CREATE INDEX IF NOT EXISTS event_registrations_rep_idx ON event_registrations (representation_id);
    CREATE INDEX IF NOT EXISTS event_registrations_updated_at_idx ON event_registrations (updated_at);
    CREATE INDEX IF NOT EXISTS event_registrations_created_at_idx ON event_registrations (created_at);

    ALTER TABLE payload_locked_documents_rels
      ADD COLUMN IF NOT EXISTS event_registrations_id INTEGER REFERENCES event_registrations(id) ON DELETE CASCADE;

    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_event_reg_idx
      ON payload_locked_documents_rels (event_registrations_id);
  `);

  console.log('✅ Tabla event_registrations migrada correctamente.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando event_registrations:', err);
  process.exit(1);
});
