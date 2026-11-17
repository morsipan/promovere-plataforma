import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URI });

async function inspect() {
  await client.connect();

  console.log('=== MEDIA ROWS ===');
  const media = await client.query('SELECT * FROM media ORDER BY id ASC;');
  console.log(media.rows);

  console.log('=== PAGES HERO BLOCKS ===');
  const hero = await client.query('SELECT id, _parent_id, background_image_id, background_image_url, appearance_background_image_id FROM pages_blocks_hero;');
  console.log(hero.rows);

  console.log('=== PAGES REPRESENTATIONS ITEMS ===');
  const reps = await client.query('SELECT id, _parent_id, brand, image_id, image FROM pages_blocks_representations_items;');
  console.log(reps.rows);

  console.log('=== PAGES PARTNERS ===');
  const partners = await client.query('SELECT id, _parent_id, name, logo_id FROM pages_blocks_partners_partners_list;');
  console.log(partners.rows);

  console.log('=== PAGES GALLERY ITEMS ===');
  const gallery = await client.query('SELECT id, _parent_id, title, image FROM pages_blocks_gallery_items;');
  console.log(gallery.rows);

  console.log('=== HEADER GLOBAL ===');
  const header = await client.query('SELECT * FROM header;');
  console.log(header.rows);

  console.log('=== SITE SETTINGS GLOBAL ===');
  const settings = await client.query('SELECT * FROM site_settings;');
  console.log(settings.rows);

  await client.end();
}

inspect().catch(console.error);
