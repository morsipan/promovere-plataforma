import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para ejecutar la migración.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a PostgreSQL para migración Métricas de PR y CTA de Campañas...');
  await client.connect();

  // 1. Enum y tablas para el bloque PrMetrics (pages_blocks_pr_metrics)
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_prm_key AS ENUM ('alcance', 'ad_value', 'eventos');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS pages_blocks_pr_metrics (
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      _path TEXT NOT NULL,
      id CHARACTER VARYING PRIMARY KEY,
      block_name CHARACTER VARYING,
      appearance_background_color CHARACTER VARYING DEFAULT 'blancoHumo',
      appearance_theme CHARACTER VARYING DEFAULT 'light',
      appearance_overlay_opacity CHARACTER VARYING DEFAULT 'media',
      appearance_background_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      appearance_accent_color CHARACTER VARYING DEFAULT 'azul',
      appearance_button_color CHARACTER VARYING DEFAULT 'azul',
      appearance_badge_color CHARACTER VARYING DEFAULT 'verde',
      badge CHARACTER VARYING,
      title CHARACTER VARYING,
      subtitle TEXT
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_pr_metrics_order_idx ON pages_blocks_pr_metrics (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_pr_metrics_parent_id_idx ON pages_blocks_pr_metrics (_parent_id);
    CREATE INDEX IF NOT EXISTS pages_blocks_pr_metrics_path_idx ON pages_blocks_pr_metrics (_path);

    CREATE TABLE IF NOT EXISTS pages_blocks_pr_metrics_metrics (
      _order INTEGER NOT NULL,
      _parent_id CHARACTER VARYING NOT NULL REFERENCES pages_blocks_pr_metrics(id) ON DELETE CASCADE,
      id CHARACTER VARYING PRIMARY KEY,
      metric_key enum_prm_key NOT NULL DEFAULT 'alcance',
      label CHARACTER VARYING NOT NULL,
      value CHARACTER VARYING NOT NULL,
      description TEXT
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_pr_metrics_metrics_order_idx ON pages_blocks_pr_metrics_metrics (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_pr_metrics_metrics_parent_id_idx ON pages_blocks_pr_metrics_metrics (_parent_id);
  `);

  // 2. Columnas CTA para Nuestras Campañas (pages_blocks_partners)
  await client.query(`
    ALTER TABLE pages_blocks_partners
      ADD COLUMN IF NOT EXISTS cta_label CHARACTER VARYING DEFAULT 'Quiero mi campaña anual',
      ADD COLUMN IF NOT EXISTS cta_href CHARACTER VARYING DEFAULT '#contacto';
  `);

  console.log('✅ Migración de Métricas de PR y Nuestras Campañas completada.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error en migración:', err);
  process.exit(1);
});
