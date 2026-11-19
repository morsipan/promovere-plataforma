import pg from 'pg';
const { Client } = pg;

const connectionString =
  process.env.DATABASE_URI ||
  'postgresql://postgres.nfbutyeottopxphyykdh:lucasycarla2026@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

function makeRichText(text: string) {
  return JSON.stringify({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  });
}

async function run() {
  console.log('🔄 Conectando a Supabase PostgreSQL para migración Etapa 3 de Comunidad...');
  await client.connect();

  // 1. Columna dashboard_order en users
  console.log('📦 1. Agregando columna dashboard_order (JSONB) en users...');
  await client.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS dashboard_order JSONB;
  `);

  // 2. Enums y columnas de designStyles en community_settings
  console.log('📦 2. Agregando enums y columnas de estilos en community_settings...');
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_cs_welcome_theme AS ENUM ('azul-oscuro', 'gradiente-marca', 'azul', 'verde', 'grisOscuro');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_cs_alert_style AS ENUM ('gradiente', 'azul', 'verde', 'grisOscuro');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_cs_wa_style AS ENUM ('verde-gradiente', 'verde', 'azul', 'grisOscuro');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_cs_card_style AS ENUM ('elevated', 'bordered', 'soft');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_cs_accent AS ENUM ('azul', 'verde');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE community_settings
      ADD COLUMN IF NOT EXISTS design_styles_welcome_theme enum_cs_welcome_theme DEFAULT 'azul-oscuro',
      ADD COLUMN IF NOT EXISTS design_styles_alert_style enum_cs_alert_style DEFAULT 'gradiente',
      ADD COLUMN IF NOT EXISTS design_styles_whatsapp_style enum_cs_wa_style DEFAULT 'verde-gradiente',
      ADD COLUMN IF NOT EXISTS design_styles_card_style enum_cs_card_style DEFAULT 'elevated',
      ADD COLUMN IF NOT EXISTS design_styles_accent_color enum_cs_accent DEFAULT 'azul';
  `);

  // 3. Tablas de bloques publicitarios para community_settings
  console.log('📦 3. Creando tablas de bloques publicitarios en community_settings...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS community_settings_blocks_full_width_image (
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES community_settings(id) ON DELETE CASCADE,
      _path TEXT NOT NULL,
      id CHARACTER VARYING PRIMARY KEY,
      block_name CHARACTER VARYING,
      image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      mobile_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      height CHARACTER VARYING DEFAULT 'medium',
      overlay CHARACTER VARYING DEFAULT 'none',
      full_bleed BOOLEAN DEFAULT true,
      title CHARACTER VARYING,
      subtitle CHARACTER VARYING,
      link_type CHARACTER VARYING DEFAULT 'cta',
      button_href CHARACTER VARYING,
      button_label CHARACTER VARYING,
      new_tab BOOLEAN DEFAULT false,
      content_alignment CHARACTER VARYING DEFAULT 'center',
      caption CHARACTER VARYING
    );

    CREATE INDEX IF NOT EXISTS cs_fwi_order_idx ON community_settings_blocks_full_width_image (_order);
    CREATE INDEX IF NOT EXISTS cs_fwi_parent_idx ON community_settings_blocks_full_width_image (_parent_id);
    CREATE INDEX IF NOT EXISTS cs_fwi_path_idx ON community_settings_blocks_full_width_image (_path);
    CREATE INDEX IF NOT EXISTS cs_fwi_img_idx ON community_settings_blocks_full_width_image (image_id);
    CREATE INDEX IF NOT EXISTS cs_fwi_mimg_idx ON community_settings_blocks_full_width_image (mobile_image_id);

    CREATE TABLE IF NOT EXISTS community_settings_blocks_impact_banner (
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES community_settings(id) ON DELETE CASCADE,
      _path TEXT NOT NULL,
      id CHARACTER VARYING PRIMARY KEY,
      block_name CHARACTER VARYING,
      appearance_background_style CHARACTER VARYING DEFAULT 'gradient',
      appearance_background_color CHARACTER VARYING DEFAULT 'azul',
      appearance_background_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      appearance_theme CHARACTER VARYING DEFAULT 'dark',
      appearance_height CHARACTER VARYING DEFAULT 'medium',
      appearance_layout CHARACTER VARYING DEFAULT 'centered',
      appearance_enable_animations BOOLEAN DEFAULT true,
      title CHARACTER VARYING,
      subtitle CHARACTER VARYING,
      secondary_graphic_id INTEGER REFERENCES media(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS cs_ib_order_idx ON community_settings_blocks_impact_banner (_order);
    CREATE INDEX IF NOT EXISTS cs_ib_parent_idx ON community_settings_blocks_impact_banner (_parent_id);
    CREATE INDEX IF NOT EXISTS cs_ib_path_idx ON community_settings_blocks_impact_banner (_path);
    CREATE INDEX IF NOT EXISTS cs_ib_bg_idx ON community_settings_blocks_impact_banner (appearance_background_image_id);
    CREATE INDEX IF NOT EXISTS cs_ib_sec_idx ON community_settings_blocks_impact_banner (secondary_graphic_id);

    CREATE TABLE IF NOT EXISTS community_settings_blocks_impact_banner_buttons (
      _order INTEGER NOT NULL,
      _parent_id CHARACTER VARYING NOT NULL REFERENCES community_settings_blocks_impact_banner(id) ON DELETE CASCADE,
      id CHARACTER VARYING PRIMARY KEY,
      label CHARACTER VARYING,
      url CHARACTER VARYING,
      style CHARACTER VARYING DEFAULT 'primary'
    );

    CREATE INDEX IF NOT EXISTS cs_ib_btn_order_idx ON community_settings_blocks_impact_banner_buttons (_order);
    CREATE INDEX IF NOT EXISTS cs_ib_btn_parent_idx ON community_settings_blocks_impact_banner_buttons (_parent_id);
  `);

  // 4. Seed inicial de Herramientas Inteligentes, Herramientas Comerciales y Notas de Blog (Herramientas Importantes)
  const repsRes = await client.query('SELECT id, title FROM representations ORDER BY "order" ASC');
  const findRep = (name: string) => repsRes.rows.find((r) => r.title === name)?.id || null;

  const smartCheck = await client.query(
    `SELECT COUNT(*)::int AS total FROM community_content WHERE category = 'herramientas_inteligentes'`
  );
  if (smartCheck.rows[0].total === 0) {
    console.log('🌱 4. Sembrando Herramientas Inteligentes y Comerciales iniciales...');
    const seedTools = [
      {
        title: 'Banco Oficial de Imágenes & Kits para Redes Sociales',
        category: 'herramientas_inteligentes',
        desc: 'Accedé a carpetas organizadas por destino y cadena hotelera con fotos en alta resolución, reels verticales y copies editables listos para publicar en Instagram y WhatsApp.',
        external_url: 'https://drive.google.com',
        cta_label: 'Abrir Banco de Fotos',
        highlight: 'Actualizado',
        rep: findRep('México'),
      },
      {
        title: 'Asistente de Cotización Rápida & Conectividad Aérea LATAM',
        category: 'herramientas_inteligentes',
        desc: 'Guía interactiva de rutas aéreas vigentes desde Argentina, Chile, Colombia y Uruguay hacia Caribe, México, Grecia y EE.UU., con frecuencias y tiempos de conexión.',
        external_url: 'https://promovere.com.ar',
        cta_label: 'Abrir Herramienta',
        highlight: 'Smart Tool',
        rep: findRep('Islas Caimán'),
      },
      {
        title: 'Kit Comercial Caribe 2026: Brochures & Fichas Técnicas',
        category: 'herramientas_comerciales',
        desc: 'Presentaciones en PDF sin marca de agua para compartir directamente con pasajeros, comparativas de resorts y argumentos clave de venta por segmento.',
        external_url: 'https://promovere.com.ar',
        cta_label: 'Ver Material Comercial',
        highlight: 'Destacado',
        rep: findRep('Cuba'),
      },
    ];

    for (const item of seedTools) {
      const inserted = await client.query(
        `INSERT INTO community_content (title, category, description, external_url, cta_label, highlight, representation_id, featured)
         VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, true) RETURNING id`,
        [item.title, item.category, makeRichText(item.desc), item.external_url, item.cta_label, item.highlight, item.rep]
      );
      await client.query(
        `INSERT INTO community_content_visible_for ("order", parent_id, value) VALUES (1, $1, 'mayorista'), (2, $1, 'minorista')`,
        [inserted.rows[0].id]
      );
    }
  }

  // 5. Seed inicial de Notas de Blog (Herramientas Importantes)
  const blogCheck = await client.query(
    `SELECT COUNT(*)::int AS total FROM community_content WHERE category = 'blog'`
  );
  if (blogCheck.rows[0].total === 0) {
    console.log('🌱 5. Sembrando Notas de Blog (Herramientas Importantes)...');
    const seedBlogs = [
      {
        title: 'Tendencias del Turismo de Lujo 2026: Qué buscan hoy los viajeros LATAM',
        desc: 'El segmento de alta gama en Latinoamérica prioriza experiencias personalizadas, gastronomía de autor y hospitalidad boutique. Repasamos las 5 claves para argumentar propuestas de valor en Caribe Mexicano e Islas Caimán y aumentar la tasa de cierre en tu agencia.',
        highlight: 'Guía Editorial',
        rep: findRep('México'),
      },
      {
        title: 'Claves para vender circuitos combinados por Grecia e Islas en temporada media',
        desc: 'Mayo, junio y septiembre ofrecen el mejor equilibrio entre clima, disponibilidad hotelera y tarifas competitivas en Atenas, Santorini y Mykonos. Descubrí cómo armar itinerarios rentables de 10 a 14 noches con operación garantizada en español.',
        highlight: 'Nota de Blog',
        rep: findRep('Grecia'),
      },
      {
        title: 'Requisitos migratorios y tips prácticos para pasajeros hacia EE.UU. y Caribe',
        desc: 'Checklist actualizado de documentación, seguros de asistencia recomendados, tiempos de escala sugeridos y buenas prácticas para evitar contratiempos en aeropuerto y fidelizar a tus clientes.',
        highlight: 'Información Clave',
        rep: findRep('Estados Unidos'),
      },
    ];

    for (const post of seedBlogs) {
      const inserted = await client.query(
        `INSERT INTO community_content (title, category, description, highlight, representation_id, featured)
         VALUES ($1, 'blog', $2::jsonb, $3, $4, true) RETURNING id`,
        [post.title, makeRichText(post.desc), post.highlight, post.rep]
      );
      await client.query(
        `INSERT INTO community_content_visible_for ("order", parent_id, value) VALUES (1, $1, 'mayorista'), (2, $1, 'minorista')`,
        [inserted.rows[0].id]
      );
    }
  }

  // 6. Asegurar al menos 4 webinars para que "Sugerencias para continuar viendo" siempre muestre 3 relacionados
  const webCheck = await client.query(
    `SELECT COUNT(*)::int AS total FROM community_events WHERE modality IN ('webinar', 'on_demand')`
  );
  if (webCheck.rows[0].total < 4) {
    console.log('🌱 6. Agregando webinars adicionales para enriquecer las sugerencias relacionadas...');
    const extraWebinars = [
      {
        title: 'Masterclass: Hotelería de Lujo Handcrafted Hospitality en Playa Mujeres',
        modality: 'on_demand',
        location: 'YouTube On-Demand',
        speaker: 'Atelier de Hoteles & Promovêre',
        desc: 'Recorrido completo por las suites Inspira, conceptos gastronómicos de autor y estrategias de upselling para lunas de miel y grupos de incentivo.',
        recording: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rep: findRep('México'),
      },
      {
        title: 'Webinar Grabado: Varadero, Cayos y La Habana con Gaviota Hoteles',
        modality: 'on_demand',
        location: 'YouTube On-Demand',
        speaker: 'Equipo Comercial Cuba',
        desc: 'Actualización de producto hotelero, novedades en Cayo Santa María y Cayo Cruz, y combinados ciudad + playa para el mercado Cono Sur.',
        recording: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rep: findRep('Cuba'),
      },
    ];

    for (const w of extraWebinars) {
      const ins = await client.query(
        `INSERT INTO community_events (title, modality, location_or_platform, speaker, description, recording_url, representation_id, status, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', false) RETURNING id`,
        [w.title, w.modality, w.location, w.speaker, w.desc, w.recording, w.rep]
      );
      await client.query(
        `INSERT INTO community_events_visible_for ("order", parent_id, value) VALUES (1, $1, 'mayorista'), (2, $1, 'minorista')`,
        [ins.rows[0].id]
      );
    }
  }

  console.log('✅ Migración Etapa 3 de Comunidad completada exitosamente.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error en migración Etapa 3:', err);
  process.exit(1);
});
