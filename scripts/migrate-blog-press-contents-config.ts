import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para migrar configuración de Prensa y Contenidos.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔄 Conectando a PostgreSQL para agregar press_config y contents_config en blog_settings...');
  await client.connect();

  await client.query(`
    ALTER TABLE blog_settings
      ADD COLUMN IF NOT EXISTS press_config_badge CHARACTER VARYING DEFAULT 'Prensa & Medios',
      ADD COLUMN IF NOT EXISTS press_config_title CHARACTER VARYING DEFAULT 'Promovêre en Prensa, Entrevistas y Videos',
      ADD COLUMN IF NOT EXISTS press_config_subtitle TEXT DEFAULT 'Un único espacio que reúne nuestras apariciones en medios especializados del trade turístico junto con entrevistas, participaciones en ferias y coberturas audiovisuales.',
      ADD COLUMN IF NOT EXISTS press_config_show_date BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS press_config_show_outlet_badge BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS contents_config_badge CHARACTER VARYING DEFAULT 'Entrevistas y Coberturas',
      ADD COLUMN IF NOT EXISTS contents_config_title CHARACTER VARYING DEFAULT 'Entrevistas, Ferias y Coberturas Audiovisuales',
      ADD COLUMN IF NOT EXISTS contents_config_subtitle TEXT DEFAULT 'Reviví nuestras entrevistas en medios, programas especiales de destinos y coberturas audiovisuales de la industria turística.',
      ADD COLUMN IF NOT EXISTS contents_config_show_date BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS contents_config_show_outlet_badge BOOLEAN DEFAULT true;
  `);

  console.log('✅ Migración de press_config y contents_config en blog_settings completada.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando press_config y contents_config:', err);
  process.exit(1);
});
