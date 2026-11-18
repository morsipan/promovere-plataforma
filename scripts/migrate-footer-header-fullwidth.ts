import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URI });

async function migrate() {
  await client.connect();
  console.log('1. Conectado a PostgreSQL.');

  console.log('2. Agregando columnas de logos a la tabla footer...');
  await client.query(`
    ALTER TABLE footer 
    ADD COLUMN IF NOT EXISTS logo_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS logo_type_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL;
  `);

  console.log('3. Agregando columnas de logos para navbar transparente a la tabla header...');
  await client.query(`
    ALTER TABLE header 
    ADD COLUMN IF NOT EXISTS logo_image_transparent_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS logo_type_image_transparent_id INTEGER REFERENCES media(id) ON DELETE SET NULL;
  `);

  console.log('4. Creando tabla pages_blocks_full_width_image para el nuevo bloque de imagen full-width...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS pages_blocks_full_width_image (
      _order INTEGER NOT NULL,
      _parent_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
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
      button_label CHARACTER VARYING,
      button_href CHARACTER VARYING,
      new_tab BOOLEAN DEFAULT false,
      content_alignment CHARACTER VARYING DEFAULT 'center',
      caption CHARACTER VARYING
    );

    CREATE INDEX IF NOT EXISTS pages_blocks_full_width_image_order_idx ON pages_blocks_full_width_image (_order);
    CREATE INDEX IF NOT EXISTS pages_blocks_full_width_image_parent_id_idx ON pages_blocks_full_width_image (_parent_id);
    CREATE INDEX IF NOT EXISTS pages_blocks_full_width_image_path_idx ON pages_blocks_full_width_image (_path);
    CREATE INDEX IF NOT EXISTS pages_blocks_full_width_image_image_idx ON pages_blocks_full_width_image (image_id);
    CREATE INDEX IF NOT EXISTS pages_blocks_full_width_image_mobile_image_idx ON pages_blocks_full_width_image (mobile_image_id);
  `);

  console.log('5. Verificando columnas en footer:');
  const footerCols = await client.query(`
    SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'footer' ORDER BY ordinal_position;
  `);
  console.log(footerCols.rows.map(r => r.column_name));

  console.log('6. Verificando columnas en header:');
  const headerCols = await client.query(`
    SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'header' ORDER BY ordinal_position;
  `);
  console.log(headerCols.rows.map(r => r.column_name));

  console.log('7. Verificando tabla pages_blocks_full_width_image:');
  const fullWidthCols = await client.query(`
    SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pages_blocks_full_width_image' ORDER BY ordinal_position;
  `);
  console.log(fullWidthCols.rows.map(r => r.column_name));

  await client.end();
  console.log('Migración completada con éxito.');
}

migrate().catch((err) => {
  console.error('Error en migración:', err);
  process.exit(1);
});
