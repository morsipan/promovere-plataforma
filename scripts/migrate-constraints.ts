import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URI });

async function fixSchema() {
  await client.connect();
  console.log('Conectado a PostgreSQL.');

  // 1. Relajar NOT NULL en columna legacy 'image' de pages_blocks_representations_items
  console.log('1. Alterando pages_blocks_representations_items.image...');
  await client.query(`
    ALTER TABLE pages_blocks_representations_items 
    ALTER COLUMN image DROP NOT NULL;
  `);

  // También verificar si en pages_blocks_gallery_items hay columnas que puedan fallar o si image puede ser nullable
  console.log('2. Alterando pages_blocks_gallery_items.image...');
  await client.query(`
    ALTER TABLE pages_blocks_gallery_items 
    ALTER COLUMN image DROP NOT NULL;
  `);

  // Relajar NOT NULL en columnas de contenido de bloques para que los editores puedan guardar borradores o campos vacíos sin error 500 de base de datos
  // En Payload, la validación de campos obligatorios ya se hace a nivel de formulario/Payload. 
  // Si Postgres tiene NOT NULL en columnas que Payload o el usuario pueden dejar vacías o que son legacy, Drizzle falla con error 23502.
  const columnsToRelax = [
    { table: 'pages_blocks_distribution_channels', col: 'description' },
    { table: 'pages_blocks_distribution_channels', col: 'title' },
    { table: 'pages_blocks_distribution_stats', col: 'label' },
    { table: 'pages_blocks_distribution_stats', col: 'value' },
    { table: 'pages_blocks_faq_items', col: 'question' },
    { table: 'pages_blocks_faq_items', col: 'answer' },
    { table: 'pages_blocks_gallery_items', col: 'title' },
    { table: 'pages_blocks_gallery_items', col: 'location' },
    { table: 'pages_blocks_partners_partners_list', col: 'name' },
    { table: 'pages_blocks_representations_items', col: 'brand' },
    { table: 'pages_blocks_representations_items', col: 'country' },
    { table: 'pages_blocks_representations_items', col: 'description' },
    { table: 'pages_blocks_representations_items', col: 'title' },
    { table: 'pages_blocks_services_services_list', col: 'title' },
    { table: 'pages_blocks_services_services_list', col: 'description' },
    { table: 'pages_blocks_services_services_list_highlights', col: 'item' },
    { table: 'pages_blocks_stats_stats_list', col: 'label' },
    { table: 'pages_blocks_stats_stats_list', col: 'value' },
    { table: 'pages_blocks_testimonials_items', col: 'author' },
    { table: 'pages_blocks_testimonials_items', col: 'company' },
    { table: 'pages_blocks_testimonials_items', col: 'quote' },
    { table: 'pages_blocks_testimonials_items', col: 'role' },
    { table: 'pages_blocks_timeline_milestones', col: 'title' },
    { table: 'pages_blocks_timeline_milestones', col: 'description' },
    { table: 'pages_blocks_timeline_milestones', col: 'year' },
  ];

  for (const { table, col } of columnsToRelax) {
    try {
      await client.query(`ALTER TABLE "${table}" ALTER COLUMN "${col}" DROP NOT NULL;`);
      console.log(`✓ ${table}.${col} DROP NOT NULL`);
    } catch (e: any) {
      console.warn(`! No se pudo alterar ${table}.${col}:`, e.message);
    }
  }

  console.log('✅ Esquema actualizado correctamente.');
  await client.end();
}

fixSchema().catch(console.error);
