import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URI });

async function checkMedia() {
  await client.connect();
  console.log('--- TABLA MEDIA ---');
  const mediaRes = await client.query('SELECT id, filename, url, mime_type, filesize, created_at FROM media ORDER BY id DESC LIMIT 10;');
  console.log('Total media rows:', mediaRes.rows.length);
  console.dir(mediaRes.rows, { depth: null });

  console.log('--- REVISAR IMAGENES EN PAGES ---');
  const pagesRes = await client.query('SELECT id, slug, title, updated_at FROM pages;');
  console.log('Pages:', pagesRes.rows);

  // Check representations items or hero blocks
  const heroBlocks = await client.query('SELECT * FROM pages_blocks_hero;');
  console.log('Hero blocks:');
  console.dir(heroBlocks.rows, { depth: null });

  const repItems = await client.query('SELECT id, _parent_id, brand, image_id, image FROM pages_blocks_representations_items LIMIT 10;');
  console.log('Representation items:');
  console.dir(repItems.rows, { depth: null });

  await client.end();
}

checkMedia().catch((err) => {
  console.error(err);
  process.exit(1);
});
