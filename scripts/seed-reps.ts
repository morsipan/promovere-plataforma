import pg from 'pg';

const { Client } = pg;

interface RepSeed {
  slug: string;
  title: string;
  brand: string;
  country: string;
  category: string;
  tag: string;
  description: string;
  sourceUrl: string;
  order: number;
  existingMatchBrand?: string;
}

const CANONICAL_REPS: RepSeed[] = [
  {
    slug: 'caribe-mexicano',
    title: 'Caribe Mexicano',
    brand: 'Caribe Mexicano',
    country: 'México',
    category: 'Destino & Hotelería',
    tag: 'Destino Oficial',
    description:
      'Representación y promoción turística de los destinos del Caribe Mexicano en el mercado latinoamericano, conectando su diversidad cultural, gastronómica y hotelera con el trade regional.',
    sourceUrl: 'https://www.promovere.com.ar/reps/caribe-mexicano',
    order: 1,
  },
  {
    slug: 'atelier-de-hoteles',
    title: 'Atelier de Hoteles',
    brand: 'Atelier de Hoteles',
    country: 'México',
    category: 'Destino & Lujo All-Inclusive',
    tag: 'Hospitalidad Artesanal',
    description:
      'Cadena hotelera mexicana reconocida por su concepto de Hospitalidad Hecha a Mano, lujo contemporáneo, diseño y experiencias gastronómicas en Cancún y Playa Mujeres.',
    sourceUrl: 'https://www.promovere.com.ar/reps/atelier-de-hoteles',
    order: 2,
  },
  {
    slug: 'hoteles-solaris',
    title: 'Hoteles Solaris',
    brand: 'Hoteles Solaris',
    country: 'México',
    category: 'Cadena Hotelera',
    tag: 'Cancún & Los Cabos',
    description:
      'Resorts todo incluido en Cancún y Los Cabos con propuestas pensadas para familias, parejas y solo adultos, combinando servicio personalizado, entretenimiento y gastronomía.',
    sourceUrl: 'https://www.promovere.com.ar/reps/hoteles-solaris',
    order: 3,
  },
  {
    slug: 'enjoy-travel-group',
    title: 'Enjoy Travel Group',
    brand: 'Enjoy Travel Group',
    country: 'LATAM & Caribe',
    category: 'DMC & Circuitos',
    tag: 'Operador Receptivo',
    description:
      'Operador mayorista y DMC internacional con presencia en el Caribe, Latinoamérica y Europa, ofreciendo programas a medida, receptivo y herramientas B2B para agencias de viajes.',
    sourceUrl: 'https://www.promovere.com.ar/reps/enjoy-travel-group',
    order: 4,
  },
  {
    slug: 'mais-brasil',
    title: 'Mais Brasil',
    brand: 'Mais Brasil',
    country: 'Brasil',
    category: 'Receptivo & Circuitos',
    tag: 'Receptivo Brasil',
    description:
      'Operación receptiva especializada en Brasil con atención dedicada al trade hispanohablante, circuitos, playas y experiencias seleccionadas en los principales destinos brasileños.',
    sourceUrl: 'https://www.promovere.com.ar/reps/mais-brasil',
    order: 5,
  },
  {
    slug: 'hellenic-travel-network',
    title: 'Hellenic Travel Network',
    brand: 'Hellenic Travel Network',
    country: 'Grecia',
    category: 'DMC & Circuitos',
    tag: 'Grecia & Mediterráneo',
    description:
      'DMC especialista en Grecia y el Mediterráneo Oriental con salidas garantizadas en español, circuitos culturales, islas griegas y atención operativa dedicada para el trade.',
    sourceUrl: 'https://www.promovere.com.ar/reps/hellenic-travel-network',
    order: 6,
    existingMatchBrand: 'Hellenic Travel Network',
  },
  {
    slug: 'xplorer-dmc',
    title: 'Xplorer DMC',
    brand: 'Xplorer DMC',
    country: 'Estados Unidos',
    category: 'DMC & Circuitos',
    tag: 'Experiencias USA',
    description:
      'DMC especializado en Estados Unidos con foco en experiencias personalizadas, flexibilidad operativa y soluciones a medida para operadores mayoristas y agencias de viajes.',
    sourceUrl: 'https://www.promovere.com.ar/reps/xplorer-dmc',
    order: 7,
    existingMatchBrand: 'Xplorer USA',
  },
  {
    slug: 'islas-caiman',
    title: 'Islas Caimán',
    brand: 'Islas Caimán',
    country: 'Islas Caimán',
    category: 'Destino de Ultra-Lujo',
    tag: 'Capital Culinaria',
    description:
      'Archipiélago caribeño reconocido por sus playas de arena blanca, buceo de clase mundial, seguridad y alta gastronomía en Grand Cayman, Cayman Brac y Little Cayman.',
    sourceUrl: 'https://www.promovere.com.ar/reps/islas-caim%C3%A1n',
    order: 8,
    existingMatchBrand: 'Departamento de Turismo de Islas Caimán',
  },
];

function buildLexicalContent(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
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
      })),
    },
  };
}

async function run() {
  const connectionString = process.env.DATABASE_URI || '';
  if (!connectionString) {
    console.error('❌ Falta DATABASE_URI para migrar y sembrar las Reps.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  console.log('🔄 Conectando a PostgreSQL para migrar columnas y sembrar las 8 Reps...');
  await client.connect();

  // 1. Migración idempotente de columnas nuevas en representations
  await client.query(`
    ALTER TABLE representations
      ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS slug CHARACTER VARYING,
      ADD COLUMN IF NOT EXISTS source_url CHARACTER VARYING,
      ADD COLUMN IF NOT EXISTS content JSONB;

    CREATE UNIQUE INDEX IF NOT EXISTS representations_slug_idx
      ON representations (slug)
      WHERE slug IS NOT NULL;
    CREATE INDEX IF NOT EXISTS representations_is_published_idx
      ON representations (is_published);
  `);

  // 2. Despublicar registros legacy sin slug canónico (ej. borradores o combinados) sin eliminar FKs
  const canonicalSlugs = CANONICAL_REPS.map((r) => r.slug);
  await client.query(
    `UPDATE representations
     SET is_published = false
     WHERE slug IS NULL OR NOT (slug = ANY($1::text[]))`,
    [canonicalSlugs]
  );

  let updated = 0;
  let inserted = 0;

  // 3. Upsert idempotente de las 8 Reps canónicas
  for (const rep of CANONICAL_REPS) {
    const bySlug = await client.query<{ id: number }>(
      `SELECT id FROM representations WHERE slug = $1 LIMIT 1`,
      [rep.slug]
    );

    if (bySlug.rows.length > 0) {
      await client.query(
        `UPDATE representations
         SET source_url = COALESCE(NULLIF(source_url, ''), $1),
             "order" = $2,
             updated_at = now()
         WHERE id = $3`,
        [rep.sourceUrl, rep.order, bySlug.rows[0].id]
      );
      updated++;
      continue;
    }

    // Reutilizar registro existente por brand previo si coincide (evita duplicados y preserva FKs)
    let matchedId: number | null = null;
    if (rep.existingMatchBrand) {
      const byBrand = await client.query<{ id: number }>(
        `SELECT id FROM representations WHERE brand = $1 AND slug IS NULL LIMIT 1`,
        [rep.existingMatchBrand]
      );
      if (byBrand.rows.length > 0) {
        matchedId = byBrand.rows[0].id;
      }
    }

    const defaultContent = JSON.stringify(buildLexicalContent([rep.description]));

    if (matchedId !== null) {
      await client.query(
        `UPDATE representations
         SET title = $1,
             brand = $2,
             slug = $3,
             source_url = $4,
             country = $5,
             tag = COALESCE(NULLIF(tag, ''), $6),
             description = COALESCE(NULLIF(description, ''), $7),
             content = COALESCE(content, $8::jsonb),
             is_published = true,
             status = 'active'::enum_rep_status,
             "order" = $9,
             updated_at = now()
         WHERE id = $10`,
        [
          rep.title,
          rep.brand,
          rep.slug,
          rep.sourceUrl,
          rep.country,
          rep.tag,
          rep.description,
          defaultContent,
          rep.order,
          matchedId,
        ]
      );
      updated++;
    } else {
      await client.query(
        `INSERT INTO representations
          (title, brand, slug, source_url, country, category, tag, description, content, is_published, status, featured, "order", updated_at, created_at)
         VALUES
          ($1, $2, $3, $4, $5, $6::enum_rep_category, $7, $8, $9::jsonb, true, 'active'::enum_rep_status, true, $10, now(), now())`,
        [
          rep.title,
          rep.brand,
          rep.slug,
          rep.sourceUrl,
          rep.country,
          rep.category,
          rep.tag,
          rep.description,
          defaultContent,
          rep.order,
        ]
      );
      inserted++;
    }
  }

  const finalRes = await client.query<{ id: number; slug: string; brand: string; is_published: boolean; order: number }>(
    `SELECT id, slug, brand, is_published, "order" FROM representations WHERE is_published = true ORDER BY "order" ASC`
  );

  console.log('✅ Seed idempotente de Reps finalizado:');
  console.log(`   - Insertadas nuevas: ${inserted}`);
  console.log(`   - Actualizadas/vinculadas: ${updated}`);
  console.log(`   - Total Reps publicadas (is_published = true): ${finalRes.rows.length}`);
  finalRes.rows.forEach((r) => console.log(`     ${r.order}. ${r.brand} (/reps/${r.slug})`));

  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando/sembrando Reps:', err);
  process.exit(1);
});
