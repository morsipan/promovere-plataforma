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
  console.log('🔄 Conectando a Supabase PostgreSQL para migrar colores de texto y opciones de banners...');
  await client.connect();

  // 1. Enums y columnas de colores de texto en community_settings
  console.log('📦 1. Agregando enums y columnas de colores de texto en community_settings...');
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_cs_wel_txt AS ENUM ('blanco', 'blancoHumo', 'grisOscuro', 'azul', 'verde');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_cs_alr_txt AS ENUM ('blanco', 'blancoHumo', 'grisOscuro', 'azul', 'verde');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_cs_wa_txt AS ENUM ('blanco', 'blancoHumo', 'grisOscuro', 'azul', 'verde');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_cs_hdg_txt AS ENUM ('grisOscuro', 'azul', 'verde');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE community_settings
      ADD COLUMN IF NOT EXISTS design_styles_welcome_text_color enum_cs_wel_txt DEFAULT 'blanco',
      ADD COLUMN IF NOT EXISTS design_styles_alert_text_color enum_cs_alr_txt DEFAULT 'blanco',
      ADD COLUMN IF NOT EXISTS design_styles_whatsapp_text_color enum_cs_wa_txt DEFAULT 'blanco',
      ADD COLUMN IF NOT EXISTS design_styles_heading_text_color enum_cs_hdg_txt DEFAULT 'grisOscuro';
  `);

  // 2. Columnas enable_hover_effect en bloques FullWidthImage e ImpactBanner (Pages + CommunitySettings)
  console.log('📦 2. Agregando columnas enable_hover_effect en tablas de banners...');
  await client.query(`
    ALTER TABLE pages_blocks_full_width_image
      ADD COLUMN IF NOT EXISTS enable_hover_effect BOOLEAN DEFAULT true;

    ALTER TABLE community_settings_blocks_full_width_image
      ADD COLUMN IF NOT EXISTS enable_hover_effect BOOLEAN DEFAULT true;

    ALTER TABLE pages_blocks_impact_banner
      ADD COLUMN IF NOT EXISTS appearance_enable_hover_effect BOOLEAN DEFAULT true;

    ALTER TABLE community_settings_blocks_impact_banner
      ADD COLUMN IF NOT EXISTS appearance_enable_hover_effect BOOLEAN DEFAULT true;
  `);

  console.log('✅ Migración completada exitosamente.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error en migración:', err);
  process.exit(1);
});
