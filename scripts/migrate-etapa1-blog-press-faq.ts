import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta la variable de entorno DATABASE_URI para ejecutar la migración en PostgreSQL.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a PostgreSQL para migración Etapa 1 (Footer FAQs AEO + Blog + Prensa Unificada)...');
  await client.connect();

  // 1. Footer FAQ Section (AEO)
  await client.query(`
    ALTER TABLE footer
      ADD COLUMN IF NOT EXISTS faq_section_enabled BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS faq_section_title CHARACTER VARYING DEFAULT 'Preguntas Frecuentes',
      ADD COLUMN IF NOT EXISTS faq_section_subtitle CHARACTER VARYING DEFAULT 'Respuestas claras sobre nuestra representación comercial B2B, alcance en LATAM y acceso a Comunidad.';

    CREATE TABLE IF NOT EXISTS footer_faq_section_items (
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES footer(id) ON DELETE CASCADE,
      id CHARACTER VARYING PRIMARY KEY,
      question CHARACTER VARYING NOT NULL,
      answer TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS footer_faq_section_items_order_idx ON footer_faq_section_items (_order);
    CREATE INDEX IF NOT EXISTS footer_faq_section_items_parent_id_idx ON footer_faq_section_items (_parent_id);
  `);

  // 2. Bloque de Blog Propio (pages_blocks_blog + pages_blocks_blog_posts)
  await client.query(`
    CREATE TABLE IF NOT EXISTS pages_blocks_blog (
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
      subtitle TEXT,
      cta_label CHARACTER VARYING,
      cta_href CHARACTER VARYING
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_blog_order_idx ON pages_blocks_blog (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_blog_parent_id_idx ON pages_blocks_blog (_parent_id);
    CREATE INDEX IF NOT EXISTS pages_blocks_blog_path_idx ON pages_blocks_blog (_path);

    CREATE TABLE IF NOT EXISTS pages_blocks_blog_posts (
      _order INTEGER NOT NULL,
      _parent_id CHARACTER VARYING NOT NULL REFERENCES pages_blocks_blog(id) ON DELETE CASCADE,
      id CHARACTER VARYING PRIMARY KEY,
      title CHARACTER VARYING NOT NULL,
      published_date TIMESTAMP(3) WITH TIME ZONE,
      category CHARACTER VARYING,
      brand CHARACTER VARYING,
      excerpt TEXT NOT NULL,
      cover_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      cover_image_url CHARACTER VARYING,
      external_url CHARACTER VARYING
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_blog_posts_order_idx ON pages_blocks_blog_posts (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_blog_posts_parent_id_idx ON pages_blocks_blog_posts (_parent_id);
  `);

  // 3. Bloque de Prensa Unificada (pages_blocks_press + pages_blocks_press_items)
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_pr_fmt AS ENUM ('nota', 'video');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS pages_blocks_press (
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      _path TEXT NOT NULL,
      id CHARACTER VARYING PRIMARY KEY,
      block_name CHARACTER VARYING,
      appearance_background_color CHARACTER VARYING DEFAULT 'blanco',
      appearance_theme CHARACTER VARYING DEFAULT 'light',
      appearance_overlay_opacity CHARACTER VARYING DEFAULT 'media',
      appearance_background_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      appearance_accent_color CHARACTER VARYING DEFAULT 'verde',
      appearance_button_color CHARACTER VARYING DEFAULT 'azul',
      appearance_badge_color CHARACTER VARYING DEFAULT 'azul',
      badge CHARACTER VARYING,
      title CHARACTER VARYING,
      subtitle TEXT,
      all_press_label CHARACTER VARYING,
      all_press_href CHARACTER VARYING,
      show_community_banner BOOLEAN DEFAULT true,
      community_cta_label CHARACTER VARYING,
      community_cta_href CHARACTER VARYING
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_press_order_idx ON pages_blocks_press (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_press_parent_id_idx ON pages_blocks_press (_parent_id);
    CREATE INDEX IF NOT EXISTS pages_blocks_press_path_idx ON pages_blocks_press (_path);

    CREATE TABLE IF NOT EXISTS pages_blocks_press_items (
      _order INTEGER NOT NULL,
      _parent_id CHARACTER VARYING NOT NULL REFERENCES pages_blocks_press(id) ON DELETE CASCADE,
      id CHARACTER VARYING PRIMARY KEY,
      format enum_pr_fmt NOT NULL DEFAULT 'nota',
      media_outlet CHARACTER VARYING NOT NULL,
      published_date TIMESTAMP(3) WITH TIME ZONE,
      title CHARACTER VARYING NOT NULL,
      summary TEXT NOT NULL,
      cover_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      cover_image_url CHARACTER VARYING,
      article_url CHARACTER VARYING,
      video_url CHARACTER VARYING,
      duration CHARACTER VARYING
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_press_items_order_idx ON pages_blocks_press_items (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_press_items_parent_id_idx ON pages_blocks_press_items (_parent_id);
  `);

  // 4. Agregar categoría 'prensa' al enum de community_content si existe
  await client.query(`
    DO $$ BEGIN
      ALTER TYPE enum_community_content_category ADD VALUE IF NOT EXISTS 'prensa';
    EXCEPTION
      WHEN undefined_object THEN null;
    END $$;
  `);

  console.log('✅ Migración Etapa 1 completada correctamente.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error en migración Etapa 1:', err);
  process.exit(1);
});
