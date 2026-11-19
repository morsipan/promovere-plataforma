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
  console.log('🔄 Conectando a Supabase PostgreSQL para migración Etapa 2 de Comunidad...');
  await client.connect();

  // 1. Enums para Promociones y Eventos
  console.log('📦 1. Creando enums para community_promotions y community_events...');
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_cp_type AS ENUM ('descuento', 'comision', 'incentivo', 'fam_trip', 'early_booking');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_cp_vis AS ENUM ('mayorista', 'minorista');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_cp_status AS ENUM ('active', 'draft');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_ce_modality AS ENUM ('webinar', 'presencial', 'on_demand');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_ce_vis AS ENUM ('mayorista', 'minorista');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_ce_status AS ENUM ('active', 'draft');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  // 2. Tabla community_promotions + community_promotions_visible_for
  console.log('📦 2. Creando tablas community_promotions y community_promotions_visible_for...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS community_promotions (
      id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      promo_type enum_cp_type NOT NULL DEFAULT 'descuento',
      benefit_badge VARCHAR,
      description VARCHAR NOT NULL,
      conditions VARCHAR,
      valid_from TIMESTAMPTZ(3),
      valid_until TIMESTAMPTZ(3) NOT NULL,
      cta_label VARCHAR DEFAULT 'Consultar Promoción',
      cta_url VARCHAR,
      cover_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      representation_id INTEGER REFERENCES representations(id) ON DELETE SET NULL,
      status enum_cp_status NOT NULL DEFAULT 'active',
      featured BOOLEAN DEFAULT false,
      updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
      created_at TIMESTAMPTZ(3) NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS community_promotions_cover_image_idx ON community_promotions (cover_image_id);
    CREATE INDEX IF NOT EXISTS community_promotions_representation_idx ON community_promotions (representation_id);
    CREATE INDEX IF NOT EXISTS community_promotions_updated_at_idx ON community_promotions (updated_at);
    CREATE INDEX IF NOT EXISTS community_promotions_created_at_idx ON community_promotions (created_at);

    CREATE TABLE IF NOT EXISTS community_promotions_visible_for (
      "order" INTEGER NOT NULL,
      parent_id INTEGER NOT NULL REFERENCES community_promotions(id) ON DELETE CASCADE,
      value enum_cp_vis NOT NULL,
      id SERIAL PRIMARY KEY
    );

    CREATE INDEX IF NOT EXISTS community_promotions_visible_for_order_idx ON community_promotions_visible_for ("order");
    CREATE INDEX IF NOT EXISTS community_promotions_visible_for_parent_idx ON community_promotions_visible_for (parent_id);
  `);

  // 3. Tabla community_events + community_events_visible_for
  console.log('📦 3. Creando tablas community_events y community_events_visible_for...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS community_events (
      id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      modality enum_ce_modality NOT NULL DEFAULT 'webinar',
      event_date TIMESTAMPTZ(3),
      location_or_platform VARCHAR DEFAULT 'Zoom (Online)',
      speaker VARCHAR,
      description VARCHAR NOT NULL,
      registration_url VARCHAR,
      recording_url VARCHAR,
      cover_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      material_attachment_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      representation_id INTEGER REFERENCES representations(id) ON DELETE SET NULL,
      status enum_ce_status NOT NULL DEFAULT 'active',
      updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
      created_at TIMESTAMPTZ(3) NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS community_events_cover_image_idx ON community_events (cover_image_id);
    CREATE INDEX IF NOT EXISTS community_events_material_idx ON community_events (material_attachment_id);
    CREATE INDEX IF NOT EXISTS community_events_representation_idx ON community_events (representation_id);
    CREATE INDEX IF NOT EXISTS community_events_updated_at_idx ON community_events (updated_at);
    CREATE INDEX IF NOT EXISTS community_events_created_at_idx ON community_events (created_at);

    CREATE TABLE IF NOT EXISTS community_events_visible_for (
      "order" INTEGER NOT NULL,
      parent_id INTEGER NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
      value enum_ce_vis NOT NULL,
      id SERIAL PRIMARY KEY
    );

    CREATE INDEX IF NOT EXISTS community_events_visible_for_order_idx ON community_events_visible_for ("order");
    CREATE INDEX IF NOT EXISTS community_events_visible_for_parent_idx ON community_events_visible_for (parent_id);
  `);

  // 4. Actualizar payload_locked_documents_rels
  console.log('📦 4. Actualizando payload_locked_documents_rels con community_promotions_id y community_events_id...');
  await client.query(`
    ALTER TABLE payload_locked_documents_rels
      ADD COLUMN IF NOT EXISTS community_promotions_id INTEGER REFERENCES community_promotions(id) ON DELETE CASCADE,
      ADD COLUMN IF NOT EXISTS community_events_id INTEGER REFERENCES community_events(id) ON DELETE CASCADE;

    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_cp_id_idx
      ON payload_locked_documents_rels (community_promotions_id);
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_ce_id_idx
      ON payload_locked_documents_rels (community_events_id);
  `);

  // 5. Seed inicial de ejemplo para Promociones (si está vacía)
  const promoCount = await client.query('SELECT COUNT(*)::int AS total FROM community_promotions');
  if (promoCount.rows[0].total === 0) {
    console.log('🌱 5. Sembrando 2 promociones iniciales en community_promotions...');
    const reps = await client.query('SELECT id, title FROM representations ORDER BY "order" ASC LIMIT 5');
    const mexicoRep = reps.rows.find((r) => r.title === 'México')?.id || null;
    const greciaRep = reps.rows.find((r) => r.title === 'Grecia')?.id || null;

    const p1 = await client.query(
      `INSERT INTO community_promotions (title, promo_type, benefit_badge, description, conditions, valid_from, valid_until, cta_label, cta_url, representation_id, status, featured)
       VALUES ($1, 'early_booking', 'Hasta 35% OFF + Resort Credit', $2, $3, now(), now() + interval '45 days', 'Solicitar Condiciones', 'mailto:marketing@promovere.com.ar?subject=Promo%20Atelier%20Early%20Booking', $4, 'active', true)
       RETURNING id`,
      [
        'Atelier Playa Mujeres — Preventa Temporada Alta',
        'Beneficios exclusivos para reservas anticipadas en suites Inspira y categorías seleccionadas con crédito de resort incluido para tus pasajeros.',
        'Aplica a reservas confirmadas dentro de la vigencia. Estadía mínima 4 noches.',
        mexicoRep,
      ]
    );
    await client.query(
      `INSERT INTO community_promotions_visible_for ("order", parent_id, value) VALUES (1, $1, 'mayorista'), (2, $1, 'minorista')`,
      [p1.rows[0].id]
    );

    const p2 = await client.query(
      `INSERT INTO community_promotions (title, promo_type, benefit_badge, description, conditions, valid_from, valid_until, cta_label, cta_url, representation_id, status, featured)
       VALUES ($1, 'incentivo', '+2% Incentivo Trade', $2, $3, now(), now() + interval '20 days', 'Consultar Cupos', 'mailto:marketing@promovere.com.ar?subject=Incentivo%20Hellenic%20Grecia', $4, 'active', false)
       RETURNING id`,
      [
        'Hellenic Travel Network — Circuitos Grecia & Islas en Español',
        'Incentivo comercial especial para salidas confirmadas combinando Atenas, Mykonos y Santorini con guías en español garantizados.',
        'Sujeto a disponibilidad de cupos en salidas regulares seleccionadas.',
        greciaRep,
      ]
    );
    await client.query(
      `INSERT INTO community_promotions_visible_for ("order", parent_id, value) VALUES (1, $1, 'mayorista'), (2, $1, 'minorista')`,
      [p2.rows[0].id]
    );
  }

  // 6. Seed inicial de ejemplo para Eventos (si está vacía)
  const eventCount = await client.query('SELECT COUNT(*)::int AS total FROM community_events');
  if (eventCount.rows[0].total === 0) {
    console.log('🌱 6. Sembrando 2 eventos/capacitaciones iniciales en community_events...');
    const reps = await client.query('SELECT id, title FROM representations ORDER BY "order" ASC LIMIT 5');
    const caimanRep = reps.rows.find((r) => r.title === 'Islas Caimán')?.id || null;
    const usaRep = reps.rows.find((r) => r.title === 'Estados Unidos')?.id || null;

    const e1 = await client.query(
      `INSERT INTO community_events (title, modality, event_date, location_or_platform, speaker, description, registration_url, representation_id, status)
       VALUES ($1, 'webinar', now() + interval '12 days', 'Zoom (Online en Vivo)', 'Equipo Comercial Promovêre', $2, 'mailto:marketing@promovere.com.ar?subject=Inscripcion%20Webinar%20Islas%20Caiman', $3, 'active')
       RETURNING id`,
      [
        'Webinar: Cómo vender Islas Caimán al segmento de lujo LATAM',
        'Repasaremos conectividad aérea, propiedades boutique en Seven Mile Beach, experiencias gastronómicas y herramientas comerciales para cerrar ventas de alto ticket.',
        caimanRep,
      ]
    );
    await client.query(
      `INSERT INTO community_events_visible_for ("order", parent_id, value) VALUES (1, $1, 'mayorista'), (2, $1, 'minorista')`,
      [e1.rows[0].id]
    );

    const e2 = await client.query(
      `INSERT INTO community_events (title, modality, location_or_platform, speaker, description, recording_url, representation_id, status)
       VALUES ($1, 'on_demand', 'Capacitación On-Demand', 'Xplorer USA & Promovêre', $2, 'https://www.youtube.com', $3, 'active')
       RETURNING id`,
      [
        'Capacitación On-Demand: Circuitos Costa Este y Parques Nacionales EE.UU.',
        'Sesión grabada con el detalle de los circuitos más vendidos en español, opciones a medida para familias y recomendaciones de venta.',
        usaRep,
      ]
    );
    await client.query(
      `INSERT INTO community_events_visible_for ("order", parent_id, value) VALUES (1, $1, 'mayorista'), (2, $1, 'minorista')`,
      [e2.rows[0].id]
    );
  }

  console.log('✅ Migración Etapa 2 de Comunidad completada exitosamente.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error en migración Etapa 2:', err);
  process.exit(1);
});
