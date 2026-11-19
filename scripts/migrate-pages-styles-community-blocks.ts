import pg from 'pg';
import crypto from 'crypto';

const { Client } = pg;

const connectionString =
  process.env.DATABASE_URI ||
  'postgresql://postgres.nfbutyeottopxphyykdh:lucasycarla2026@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

function genId() {
  return crypto.randomBytes(12).toString('hex');
}

function createBlockTableSQL(
  tableName: string,
  extraColumns: string[],
  defaults: { bg: string; theme: string; accent: string; btn: string; badge: string }
) {
  return `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      _path TEXT NOT NULL,
      id CHARACTER VARYING PRIMARY KEY,
      block_name CHARACTER VARYING,
      appearance_background_color CHARACTER VARYING DEFAULT '${defaults.bg}',
      appearance_theme CHARACTER VARYING DEFAULT '${defaults.theme}',
      appearance_overlay_opacity CHARACTER VARYING DEFAULT 'media',
      appearance_background_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      appearance_accent_color CHARACTER VARYING DEFAULT '${defaults.accent}',
      appearance_button_color CHARACTER VARYING DEFAULT '${defaults.btn}',
      appearance_badge_color CHARACTER VARYING DEFAULT '${defaults.badge}',
      ${extraColumns.join(',\n      ')}
    );

    CREATE INDEX IF NOT EXISTS ${tableName}_order_idx ON ${tableName} (_order);
    CREATE INDEX IF NOT EXISTS ${tableName}_parent_id_idx ON ${tableName} (_parent_id);
    CREATE INDEX IF NOT EXISTS ${tableName}_path_idx ON ${tableName} (_path);
    CREATE INDEX IF NOT EXISTS ${tableName}_bg_img_idx ON ${tableName} (appearance_background_image_id);
  `;
}

async function run() {
  console.log('🔄 Conectando a Supabase PostgreSQL...');
  await client.connect();

  // 1. Agregar estilos globales de página a la tabla pages
  console.log('🎨 Agregando columnas page_styles_* a pages...');
  await client.query(`
    ALTER TABLE pages
      ADD COLUMN IF NOT EXISTS page_styles_background_color CHARACTER VARYING DEFAULT 'blancoHumo',
      ADD COLUMN IF NOT EXISTS page_styles_heading_color CHARACTER VARYING DEFAULT 'grisOscuro',
      ADD COLUMN IF NOT EXISTS page_styles_text_color CHARACTER VARYING DEFAULT 'grisOscuro',
      ADD COLUMN IF NOT EXISTS page_styles_accent_color CHARACTER VARYING DEFAULT 'azul';
  `);

  // 2. Crear las 6 tablas de bloques independientes de la Landing de Comunidad
  console.log('📦 Creando tablas para los 6 bloques independientes de Comunidad...');

  await client.query(
    createBlockTableSQL(
      'pages_blocks_community_hero',
      [
        `title CHARACTER VARYING`,
        `subtitle TEXT`,
        `cta_text CHARACTER VARYING`,
      ],
      { bg: 'verde', theme: 'dark', accent: 'blanco', btn: 'blanco', badge: 'blanco' }
    )
  );

  await client.query(
    createBlockTableSQL(
      'pages_blocks_community_commercial_tools',
      [
        `badge CHARACTER VARYING`,
        `title CHARACTER VARYING`,
        `subtitle TEXT`,
      ],
      { bg: 'blancoHumo', theme: 'light', accent: 'azul', btn: 'azul', badge: 'verde' }
    )
  );

  await client.query(
    createBlockTableSQL(
      'pages_blocks_community_promotions_preview',
      [
        `badge CHARACTER VARYING`,
        `title CHARACTER VARYING`,
        `subtitle TEXT`,
      ],
      { bg: 'blanco', theme: 'light', accent: 'verde', btn: 'azul', badge: 'azul' }
    )
  );

  await client.query(
    createBlockTableSQL(
      'pages_blocks_community_smart_tools',
      [
        `badge CHARACTER VARYING`,
        `title CHARACTER VARYING`,
        `subtitle TEXT`,
      ],
      { bg: 'blancoHumo', theme: 'light', accent: 'azul', btn: 'verde', badge: 'verde' }
    )
  );

  await client.query(
    createBlockTableSQL(
      'pages_blocks_community_featured_products',
      [
        `badge CHARACTER VARYING`,
        `title CHARACTER VARYING`,
        `subtitle TEXT`,
      ],
      { bg: 'blanco', theme: 'light', accent: 'verde', btn: 'azul', badge: 'azul' }
    )
  );

  await client.query(
    createBlockTableSQL(
      'pages_blocks_community_whats_app',
      [
        `title CHARACTER VARYING`,
        `subtitle TEXT`,
        `cta_text CHARACTER VARYING`,
        `phone CHARACTER VARYING`,
      ],
      { bg: 'verde', theme: 'dark', accent: 'blanco', btn: 'blanco', badge: 'blanco' }
    )
  );

  // 3. Asegurar que exista la página slug='comunidad' y poblar sus 6 bloques separados
  console.log('🧩 Verificando página /comunidad y migrando a 6 bloques independientes...');

  let pageRes = await client.query(`SELECT id, title, slug FROM pages WHERE slug = 'comunidad' LIMIT 1;`);
  let pageId: number;

  if (pageRes.rows.length === 0) {
    const insertPage = await client.query(
      `INSERT INTO pages (title, slug, page_styles_background_color, page_styles_heading_color, page_styles_text_color, page_styles_accent_color, updated_at, created_at)
       VALUES ($1, $2, 'blancoHumo', 'grisOscuro', 'grisOscuro', 'verde', NOW(), NOW())
       RETURNING id;`,
      ['Comunidad Promovêre — Landing', 'comunidad']
    );
    pageId = insertPage.rows[0].id;
    console.log(`✅ Página /comunidad creada con id=${pageId}`);
  } else {
    pageId = pageRes.rows[0].id;
    console.log(`ℹ️ Página /comunidad existente id=${pageId} (${pageRes.rows[0].title})`);
  }

  // Revisar si ya tiene alguno de los 6 bloques nuevos
  const existingHero = await client.query(
    `SELECT id FROM pages_blocks_community_hero WHERE _parent_id = $1 LIMIT 1;`,
    [pageId]
  );

  if (existingHero.rows.length === 0) {
    // Leer contenido previo del bloque monolítico communityLanding si existiera
    let legacy: any = null;
    try {
      const legacyRes = await client.query(
        `SELECT * FROM pages_blocks_community_landing WHERE _parent_id = $1 LIMIT 1;`,
        [pageId]
      );
      if (legacyRes.rows.length > 0) {
        legacy = legacyRes.rows[0];
        console.log('♻️ Migrando textos desde el bloque anterior communityLanding...');
      }
    } catch {
      // Tabla legacy puede no existir
    }

    await client.query(
      `INSERT INTO pages_blocks_community_hero
        (_order, _parent_id, _path, id, block_name, appearance_background_color, appearance_theme, appearance_overlay_opacity, appearance_accent_color, appearance_button_color, appearance_badge_color, title, subtitle, cta_text)
       VALUES (1, $1, 'layout', $2, 'Hero Comunidad', 'verde', 'dark', 'media', 'blanco', 'blanco', 'blanco', $3, $4, $5);`,
      [
        pageId,
        genId(),
        legacy?.hero_title || 'Bienvenido a tu espacio',
        legacy?.hero_subtitle ||
          'Tu Comunidad Promovêre es una plataforma exclusiva pensada para potenciar tu gestión turística diaria, acceder a herramientas clave en tiempo real y conectar de forma directa con las mejores marcas, cadenas y destinos de América Latina.',
        legacy?.hero_cta_text || 'Iniciá sesión para acceder a tu espacio',
      ]
    );

    await client.query(
      `INSERT INTO pages_blocks_community_commercial_tools
        (_order, _parent_id, _path, id, block_name, appearance_background_color, appearance_theme, appearance_overlay_opacity, appearance_accent_color, appearance_button_color, appearance_badge_color, badge, title, subtitle)
       VALUES (2, $1, 'layout', $2, 'Herramientas Comerciales', 'blancoHumo', 'light', 'media', 'azul', 'azul', 'verde', $3, $4, $5);`,
      [
        pageId,
        genId(),
        legacy?.tools_badge || 'Herramientas Operativas',
        legacy?.tools_title || 'Herramientas Comerciales en Tiempo Real',
        legacy?.tools_subtitle ||
          'Consultá requisitos migratorios actualizados y realizá el seguimiento de vuelos de tus pasajeros directamente desde tu panel.',
      ]
    );

    await client.query(
      `INSERT INTO pages_blocks_community_promotions_preview
        (_order, _parent_id, _path, id, block_name, appearance_background_color, appearance_theme, appearance_overlay_opacity, appearance_accent_color, appearance_button_color, appearance_badge_color, badge, title, subtitle)
       VALUES (3, $1, 'layout', $2, 'Promociones y Eventos', 'blanco', 'light', 'media', 'verde', 'azul', 'azul', $3, $4, $5);`,
      [
        pageId,
        genId(),
        legacy?.promotions_badge || 'Beneficios Exclusivos',
        legacy?.promotions_title || 'Promociones, Eventos y Fam Tours',
        legacy?.promotions_subtitle ||
          'Accedé a beneficios comerciales reservados exclusivamente para agencias minoristas y operadores mayoristas registrados.',
      ]
    );

    await client.query(
      `INSERT INTO pages_blocks_community_smart_tools
        (_order, _parent_id, _path, id, block_name, appearance_background_color, appearance_theme, appearance_overlay_opacity, appearance_accent_color, appearance_button_color, appearance_badge_color, badge, title, subtitle)
       VALUES (4, $1, 'layout', $2, 'Herramientas Inteligentes IA', 'blancoHumo', 'light', 'media', 'azul', 'verde', 'verde', $3, $4, $5);`,
      [
        pageId,
        genId(),
        legacy?.smart_tools_badge || 'Innovación para el Trade',
        legacy?.smart_tools_title || 'Herramientas Inteligentes para Vender',
        legacy?.smart_tools_subtitle ||
          'Ahorrá tiempo operativo armando itinerarios y propuestas personalizadas con nuestra suite de asistencia comercial inteligente.',
      ]
    );

    await client.query(
      `INSERT INTO pages_blocks_community_featured_products
        (_order, _parent_id, _path, id, block_name, appearance_background_color, appearance_theme, appearance_overlay_opacity, appearance_accent_color, appearance_button_color, appearance_badge_color, badge, title, subtitle)
       VALUES (5, $1, 'layout', $2, 'Productos y Destinos', 'blanco', 'light', 'media', 'verde', 'azul', 'azul', $3, $4, $5);`,
      [
        pageId,
        genId(),
        legacy?.products_badge || 'Catálogo Oficial',
        legacy?.products_title || 'Productos Destacados & Destinos Principales',
        legacy?.products_subtitle ||
          'Explorá las cadenas hoteleras, DMCs y destinos de excelencia que representamos oficialmente en toda América Latina.',
      ]
    );

    await client.query(
      `INSERT INTO pages_blocks_community_whats_app
        (_order, _parent_id, _path, id, block_name, appearance_background_color, appearance_theme, appearance_overlay_opacity, appearance_accent_color, appearance_button_color, appearance_badge_color, title, subtitle, cta_text, phone)
       VALUES (6, $1, 'layout', $2, 'Franja WhatsApp', 'verde', 'dark', 'media', 'blanco', 'blanco', 'blanco', $3, $4, $5, $6);`,
      [
        pageId,
        genId(),
        legacy?.whatsapp_title || '¡Sumate a nuestra Comunidad de WhatsApp!',
        legacy?.whatsapp_subtitle ||
          'Recibí al instante en tu celular alertas exclusivas de cupos, promociones de último momento, invitaciones a webinars y novedades de destinos de toda América Latina.',
        legacy?.whatsapp_cta_text || 'Unirme a la Comunidad de WhatsApp',
        legacy?.whatsapp_phone || '5491145876932',
      ]
    );

    // Remover el bloque monolítico anterior de la página /comunidad para evitar duplicados
    if (legacy) {
      await client.query(
        `DELETE FROM pages_blocks_community_landing WHERE _parent_id = $1;`,
        [pageId]
      );
      console.log('🧹 Bloque monolítico anterior reemplazado por los 6 bloques separados.');
    }

    console.log('✅ 6 bloques independientes insertados en la página /comunidad.');
  } else {
    console.log('ℹ️ La página /comunidad ya posee bloques independientes configurados.');
  }

  await client.end();
  console.log('🎉 Migración completada con éxito.');
}

run().catch((err) => {
  console.error('❌ Error en migración:', err);
  process.exit(1);
});
