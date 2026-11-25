import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para migrar el global blog_settings.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a PostgreSQL para crear el global blog_settings...');
  await client.connect();

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_bs_hdr_bg AS ENUM ('grisOscuro', 'azul', 'verde', 'blancoHumo');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_bs_hdr_ttl AS ENUM ('blanco', 'blancoHumo', 'grisOscuro', 'azul', 'verde');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_bs_cat_clr AS ENUM ('azul', 'verde', 'grisOscuro');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_bs_tag_clr AS ENUM ('verde', 'azul', 'grisOscuro');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_bs_bdg_sty AS ENUM ('soft', 'solid', 'outline');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_bs_acc_clr AS ENUM ('azul', 'verde', 'grisOscuro');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_bs_crd_brd AS ENUM ('subtle', 'accent', 'elevated');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS blog_settings (
      id SERIAL PRIMARY KEY,
      blog_title CHARACTER VARYING DEFAULT 'Promo News',
      blog_subtitle TEXT DEFAULT 'Novedades oficiales de Promovêre, lanzamientos, destinos y cadenas hoteleras representadas en América Latina.',
      header_background enum_bs_hdr_bg DEFAULT 'grisOscuro',
      header_title_color enum_bs_hdr_ttl DEFAULT 'blanco',
      show_date BOOLEAN DEFAULT true,
      show_category BOOLEAN DEFAULT true,
      show_brand BOOLEAN DEFAULT true,
      category_color enum_bs_cat_clr DEFAULT 'azul',
      tag_color enum_bs_tag_clr DEFAULT 'verde',
      badge_style enum_bs_bdg_sty DEFAULT 'soft',
      accent_color enum_bs_acc_clr DEFAULT 'azul',
      card_border_style enum_bs_crd_brd DEFAULT 'subtle',
      updated_at TIMESTAMP(3) WITH TIME ZONE,
      created_at TIMESTAMP(3) WITH TIME ZONE
    );
  `);

  const countRes = await client.query(`SELECT COUNT(*)::int AS total FROM blog_settings`);
  if (countRes.rows[0].total === 0) {
    await client.query(`
      INSERT INTO blog_settings (
        blog_title,
        blog_subtitle,
        header_background,
        header_title_color,
        show_date,
        show_category,
        show_brand,
        category_color,
        tag_color,
        badge_style,
        accent_color,
        card_border_style,
        updated_at,
        created_at
      ) VALUES (
        'Promo News',
        'Novedades oficiales de Promovêre, lanzamientos, destinos y cadenas hoteleras representadas en América Latina.',
        'grisOscuro',
        'blanco',
        true,
        true,
        true,
        'azul',
        'verde',
        'soft',
        'azul',
        'subtle',
        now(),
        now()
      );
    `);
    console.log('✅ Registro inicial por defecto creado en blog_settings.');
  } else {
    console.log(`ℹ️ blog_settings ya contiene ${countRes.rows[0].total} registro(s).`);
  }

  console.log('✅ Migración de blog_settings completada.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando blog_settings:', err);
  process.exit(1);
});
