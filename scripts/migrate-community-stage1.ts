import pg from 'pg';
const { Client } = pg;

const connectionString =
  process.env.DATABASE_URI ||
  'postgresql://postgres.nfbutyeottopxphyykdh:lucasycarla2026@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const INITIAL_REPRESENTATIONS = [
  {
    title: 'Cuba',
    brand: 'Gaviota Hoteles',
    country: 'Cuba',
    category: 'Destino & Hotelería',
    tag: 'Caribe Histórico',
    description:
      'Representación comercial y posicionamiento de la mayor cadena hotelera de Cuba, con resorts de playa y hoteles históricos en Varadero, Cayos y La Habana.',
    cover_image_url: 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800&q=80',
    contact_email: 'marketing@promovere.com.ar',
    order: 1,
  },
  {
    title: 'Grecia',
    brand: 'Hellenic Travel Network',
    country: 'Grecia',
    category: 'DMC & Circuitos',
    tag: 'Mediterráneo & Islas',
    description:
      'Operador receptivo líder en Grecia y el Mediterráneo oriental, especialista en circuitos arqueológicos, cruceros por las Islas Griegas y hotelería boutique.',
    cover_image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    contact_email: 'marketing@promovere.com.ar',
    order: 2,
  },
  {
    title: 'Islas Caimán',
    brand: 'Departamento de Turismo de Islas Caimán',
    country: 'Islas Caimán',
    category: 'Destino de Ultra-Lujo',
    tag: 'Caribe Exclusivo',
    description:
      'Promoción turística y comercial del archipiélago en el trade latinoamericano: hotelería de primer nivel, gastronomía de autor y Seven Mile Beach.',
    cover_image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    contact_email: 'marketing@promovere.com.ar',
    order: 3,
  },
  {
    title: 'México',
    brand: 'Caribe Mexicano & Atelier de Hoteles',
    country: 'México',
    category: 'Destino & Lujo All-Inclusive',
    tag: 'Caribe Mexicano',
    description:
      "Promoción del Caribe Mexicano y la prestigiosa cadena hotelera ATELIER de Hoteles (Atelier Playa Mujeres), referente en hotelería de lujo 'Handcrafted Hospitality'.",
    cover_image_url: 'https://images.unsplash.com/photo-1512815779344-99b39868f763?w=800&q=80',
    contact_email: 'marketing@promovere.com.ar',
    order: 4,
  },
  {
    title: 'Estados Unidos',
    brand: 'Xplorer USA',
    country: 'EE.UU.',
    category: 'Receptivo & Circuitos',
    tag: 'Norteamérica',
    description:
      'Operador receptivo integral en los Estados Unidos, especializado en circuitos guiados en español, parques nacionales, costa este y oeste, y experiencias a medida.',
    cover_image_url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800&q=80',
    contact_email: 'marketing@promovere.com.ar',
    order: 5,
  },
];

async function run() {
  console.log('🔄 Conectando a Supabase PostgreSQL para migración Etapa 1 de Comunidad...');
  await client.connect();

  // 1. Enums para Representations
  console.log('📦 1. Creando enums enum_rep_category y enum_rep_status...');
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_rep_category AS ENUM (
        'Destino & Hotelería',
        'DMC & Circuitos',
        'Destino de Ultra-Lujo',
        'Destino & Lujo All-Inclusive',
        'Receptivo & Circuitos',
        'Cadena Hotelera',
        'Cruceros & Navieras',
        'Otro'
      );
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_rep_status AS ENUM ('active', 'draft');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  // 2. Tabla representations
  console.log('📦 2. Creando tabla representations...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS representations (
      id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      brand VARCHAR NOT NULL,
      country VARCHAR NOT NULL,
      category enum_rep_category NOT NULL DEFAULT 'Destino & Hotelería',
      tag VARCHAR,
      description VARCHAR NOT NULL,
      cover_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      logo_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      cover_image_url VARCHAR,
      website_url VARCHAR,
      media_kit_url VARCHAR,
      contact_email VARCHAR DEFAULT 'marketing@promovere.com.ar',
      contact_whatsapp VARCHAR,
      status enum_rep_status NOT NULL DEFAULT 'active',
      featured BOOLEAN DEFAULT true,
      "order" NUMERIC DEFAULT 0,
      updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
      created_at TIMESTAMPTZ(3) NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS representations_cover_image_idx ON representations (cover_image_id);
    CREATE INDEX IF NOT EXISTS representations_logo_idx ON representations (logo_id);
    CREATE INDEX IF NOT EXISTS representations_updated_at_idx ON representations (updated_at);
    CREATE INDEX IF NOT EXISTS representations_created_at_idx ON representations (created_at);
  `);

  // 3. Registrar representations_id en payload_locked_documents_rels
  console.log('📦 3. Actualizando payload_locked_documents_rels con representations_id...');
  await client.query(`
    ALTER TABLE payload_locked_documents_rels
      ADD COLUMN IF NOT EXISTS representations_id INTEGER REFERENCES representations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_representations_id_idx
      ON payload_locked_documents_rels (representations_id);
  `);

  // 4. Enriquecer tabla community_content
  console.log('📦 4. Agregando columnas nuevas a community_content...');
  await client.query(`
    ALTER TABLE community_content
      ADD COLUMN IF NOT EXISTS representation_id INTEGER REFERENCES representations(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS cover_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS external_url VARCHAR,
      ADD COLUMN IF NOT EXISTS cta_label VARCHAR DEFAULT 'Abrir Recurso',
      ADD COLUMN IF NOT EXISTS video_url VARCHAR;

    CREATE INDEX IF NOT EXISTS community_content_representation_idx ON community_content (representation_id);
    CREATE INDEX IF NOT EXISTS community_content_cover_image_idx ON community_content (cover_image_id);
  `);

  // 5. Crear tabla global community_settings
  console.log('📦 5. Creando tabla global community_settings...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS community_settings (
      id SERIAL PRIMARY KEY,
      alert_banner_enabled BOOLEAN DEFAULT false,
      alert_banner_message VARCHAR,
      alert_banner_cta_label VARCHAR DEFAULT 'Ver más',
      alert_banner_cta_url VARCHAR,
      welcome_banner_badge VARCHAR DEFAULT 'Portal Exclusivo para Profesionales de Turismo',
      welcome_banner_subtitle VARCHAR DEFAULT 'Espacio exclusivo para Operadores Mayoristas y Agencias de Viajes. Aquí encontrarás el catálogo oficial de destinos representados, fichas técnicas, promociones vigentes y herramientas comerciales de apoyo.',
      welcome_banner_b2b_policy_title VARCHAR DEFAULT 'Política de Seguridad B2B:',
      welcome_banner_b2b_policy_text VARCHAR DEFAULT 'Por normativas de confidencialidad del trade, este portal no publica tarifas ni precios confidenciales al público. Los materiales están destinados a soporte de ventas, formación y cotización directa con operadores habilitados.',
      whatsapp_channel_enabled BOOLEAN DEFAULT true,
      whatsapp_channel_title VARCHAR DEFAULT 'Sumate al Canal Oficial de WhatsApp Trade',
      whatsapp_channel_button_label VARCHAR DEFAULT 'Unirme por WhatsApp',
      whatsapp_channel_description VARCHAR DEFAULT 'Recibí alertas instantáneas de promociones, cupos de Fam Tours, lanzamientos hoteleros y novedades comerciales directo en tu teléfono.',
      whatsapp_channel_whatsapp_url VARCHAR DEFAULT 'https://wa.me/5491100000000',
      updated_at TIMESTAMPTZ(3) DEFAULT now(),
      created_at TIMESTAMPTZ(3) DEFAULT now()
    );
  `);

  // 6. Seed inicial de las 5 representaciones si la tabla está vacía
  const countRes = await client.query('SELECT COUNT(*)::int AS total FROM representations');
  if (countRes.rows[0].total === 0) {
    console.log('🌱 6. Sembrando las 5 representaciones oficiales en representations...');
    for (const rep of INITIAL_REPRESENTATIONS) {
      await client.query(
        `INSERT INTO representations (title, brand, country, category, tag, description, cover_image_url, contact_email, status, featured, "order")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', true, $9)`,
        [
          rep.title,
          rep.brand,
          rep.country,
          rep.category,
          rep.tag,
          rep.description,
          rep.cover_image_url,
          rep.contact_email,
          rep.order,
        ]
      );
    }
    console.log('✅ 5 representaciones sembradas con éxito.');
  } else {
    console.log(`ℹ️ representations ya contiene ${countRes.rows[0].total} registros. Se omite seed.`);
  }

  // 7. Seed inicial de community_settings si está vacía
  const settingsCount = await client.query('SELECT COUNT(*)::int AS total FROM community_settings');
  if (settingsCount.rows[0].total === 0) {
    console.log('🌱 7. Inicializando registro default en community_settings...');
    await client.query(`INSERT INTO community_settings DEFAULT VALUES;`);
  }

  console.log('✅ Migración Etapa 1 de Comunidad completada exitosamente.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error en migración Etapa 1:', err);
  process.exit(1);
});
