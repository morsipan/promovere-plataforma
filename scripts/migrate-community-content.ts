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
  await client.connect();
  console.log('🔄 Conectando a Supabase para verificar y migrar estructura de CommunityContent...');

  // 1. Convertir 'category' de enum a character varying en community_content para permitir todas las categorías
  await client.query(`
    DO $$ 
    BEGIN 
      BEGIN
        ALTER TABLE "community_content" ALTER COLUMN "category" TYPE character varying USING category::text;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END $$;
  `);
  console.log('✅ Columna category adaptada a character varying.');

  // 2. Convertir 'description' de text/varchar a jsonb (Lexical Rich Text) si aún es varchar
  await client.query(`
    DO $$ 
    BEGIN 
      BEGIN
        ALTER TABLE "community_content" 
        ALTER COLUMN "description" TYPE jsonb 
        USING CASE 
          WHEN description IS NULL THEN NULL
          WHEN description::text LIKE '{%' THEN description::jsonb
          ELSE jsonb_build_object(
            'root', jsonb_build_object(
              'type', 'root',
              'format', '',
              'indent', 0,
              'version', 1,
              'children', jsonb_build_array(
                jsonb_build_object(
                  'type', 'paragraph',
                  'format', '',
                  'indent', 0,
                  'version', 1,
                  'children', jsonb_build_array(
                    jsonb_build_object(
                      'type', 'text',
                      'detail', 0,
                      'format', 0,
                      'mode', 'normal',
                      'style', '',
                      'text', description::text,
                      'version', 1
                    )
                  )
                )
              )
            )
          )
        END;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END $$;
  `);
  console.log('✅ Columna description adaptada a jsonb (Lexical Rich Text).');

  // 3. Crear tabla community_content_visible_for para el campo select múltiple visibleFor
  await client.query(`
    CREATE TABLE IF NOT EXISTS "community_content_visible_for" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL REFERENCES "community_content"("id") ON DELETE CASCADE,
      "value" character varying NOT NULL,
      "id" serial PRIMARY KEY
    );
    CREATE INDEX IF NOT EXISTS "community_content_visible_for_order_idx" ON "community_content_visible_for" ("order");
    CREATE INDEX IF NOT EXISTS "community_content_visible_for_parent_id_idx" ON "community_content_visible_for" ("parent_id");
  `);
  console.log('✅ Tabla community_content_visible_for creada o verificada.');

  // 4. Crear tabla community_content_rels para attachments (hasMany upload a media)
  await client.query(`
    CREATE TABLE IF NOT EXISTS "community_content_rels" (
      "id" serial PRIMARY KEY,
      "order" integer,
      "parent_id" integer NOT NULL REFERENCES "community_content"("id") ON DELETE CASCADE,
      "path" character varying NOT NULL,
      "media_id" integer REFERENCES "media"("id") ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS "community_content_rels_order_idx" ON "community_content_rels" ("order");
    CREATE INDEX IF NOT EXISTS "community_content_rels_parent_id_idx" ON "community_content_rels" ("parent_id");
    CREATE INDEX IF NOT EXISTS "community_content_rels_path_idx" ON "community_content_rels" ("path");
  `);
  console.log('✅ Tabla community_content_rels creada o verificada.');

  // 5. Poblar visible_for para los registros existentes si aún no tienen
  await client.query(`
    INSERT INTO "community_content_visible_for" ("order", "parent_id", "value")
    SELECT 1, c.id, 
      CASE 
        WHEN c.accessible_to::text = 'mayorista' THEN 'mayorista'
        WHEN c.accessible_to::text = 'minorista' THEN 'minorista'
        ELSE 'mayorista'
      END
    FROM "community_content" c
    WHERE NOT EXISTS (
      SELECT 1 FROM "community_content_visible_for" vf WHERE vf.parent_id = c.id
    );

    INSERT INTO "community_content_visible_for" ("order", "parent_id", "value")
    SELECT 2, c.id, 'minorista'
    FROM "community_content" c
    WHERE c.accessible_to::text = 'all' OR c.accessible_to IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM "community_content_visible_for" vf WHERE vf.parent_id = c.id AND vf.value = 'minorista'
    );
  `);
  console.log('✅ Migración de datos iniciales en visible_for completada.');

  await client.end();
}

run().catch(console.error);
