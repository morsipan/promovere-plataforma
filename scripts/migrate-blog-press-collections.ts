import pg from 'pg';
import { blogContent, pressContent } from '../data/content';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';

if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para migrar las colecciones Blog y Prensa.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

function buildLexicalParagraph(text: string) {
  return {
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
  };
}

async function run() {
  console.log('🔄 Conectando a PostgreSQL para crear colecciones Blog (blog_posts) y Prensa (press_items)...');
  await client.connect();

  // 1. Enums
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_blog_st AS ENUM ('published', 'draft');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_press_fmt AS ENUM ('nota', 'video');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE enum_press_st AS ENUM ('published', 'draft');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // 2. Tabla blog_posts
  await client.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title CHARACTER VARYING NOT NULL,
      excerpt TEXT NOT NULL,
      content JSONB,
      cover_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      cover_image_url CHARACTER VARYING,
      external_url CHARACTER VARYING,
      status enum_blog_st NOT NULL DEFAULT 'published',
      published_date TIMESTAMP(3) WITH TIME ZONE,
      slug CHARACTER VARYING UNIQUE,
      category CHARACTER VARYING DEFAULT 'Novedades',
      brand CHARACTER VARYING DEFAULT 'Promovêre',
      updated_at TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
      created_at TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS blog_posts_cover_image_idx ON blog_posts (cover_image_id);
    CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
    CREATE INDEX IF NOT EXISTS blog_posts_updated_at_idx ON blog_posts (updated_at);
    CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts (created_at);
  `);

  // 3. Tabla press_items
  await client.query(`
    CREATE TABLE IF NOT EXISTS press_items (
      id SERIAL PRIMARY KEY,
      title CHARACTER VARYING NOT NULL,
      media_outlet CHARACTER VARYING NOT NULL,
      format enum_press_fmt NOT NULL DEFAULT 'nota',
      summary TEXT NOT NULL,
      article_url CHARACTER VARYING,
      video_url CHARACTER VARYING,
      duration CHARACTER VARYING,
      cover_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      cover_image_url CHARACTER VARYING,
      media_file_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      status enum_press_st NOT NULL DEFAULT 'published',
      published_date TIMESTAMP(3) WITH TIME ZONE,
      updated_at TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
      created_at TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS press_items_cover_image_idx ON press_items (cover_image_id);
    CREATE INDEX IF NOT EXISTS press_items_media_file_idx ON press_items (media_file_id);
    CREATE INDEX IF NOT EXISTS press_items_updated_at_idx ON press_items (updated_at);
    CREATE INDEX IF NOT EXISTS press_items_created_at_idx ON press_items (created_at);
  `);

  // 4. Columnas en payload_locked_documents_rels (requerido por Payload CMS 3.0 Admin)
  await client.query(`
    ALTER TABLE payload_locked_documents_rels
      ADD COLUMN IF NOT EXISTS blog_posts_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
      ADD COLUMN IF NOT EXISTS press_items_id INTEGER REFERENCES press_items(id) ON DELETE CASCADE;

    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_blog_posts_id_idx ON payload_locked_documents_rels (blog_posts_id);
    CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_press_items_id_idx ON payload_locked_documents_rels (press_items_id);
  `);

  // 5. Seed idempotente de artículos de muestra en blog_posts
  const blogCount = await client.query(`SELECT COUNT(*)::int AS total FROM blog_posts`);
  if (blogCount.rows[0].total === 0) {
    for (const post of blogContent.posts) {
      await client.query(
        `INSERT INTO blog_posts
          (title, excerpt, content, cover_image_url, external_url, status, published_date, slug, category, brand)
         VALUES ($1, $2, $3::jsonb, $4, $5, 'published', $6, $7, $8, $9)`,
        [
          post.title,
          post.excerpt,
          JSON.stringify(buildLexicalParagraph(post.excerpt)),
          post.image,
          post.externalUrl || null,
          post.publishedDate ? new Date(post.publishedDate).toISOString() : new Date().toISOString(),
          post.slug,
          post.category,
          post.brand,
        ]
      );
    }
    console.log(`✅ Sembrados ${blogContent.posts.length} artículos de muestra en blog_posts.`);
  } else {
    console.log(`ℹ️ blog_posts ya tiene ${blogCount.rows[0].total} registro(s).`);
  }

  // 6. Seed idempotente de coberturas de muestra en press_items
  const pressCount = await client.query(`SELECT COUNT(*)::int AS total FROM press_items`);
  if (pressCount.rows[0].total === 0) {
    for (const item of pressContent.items) {
      await client.query(
        `INSERT INTO press_items
          (title, media_outlet, format, summary, article_url, video_url, duration, cover_image_url, status, published_date)
         VALUES ($1, $2, $3::enum_press_fmt, $4, $5, $6, $7, $8, 'published', $9)`,
        [
          item.title,
          item.mediaOutlet,
          item.format,
          item.summary,
          item.articleUrl || null,
          item.videoUrl || null,
          item.duration || null,
          item.image,
          item.publishedDate ? new Date(item.publishedDate).toISOString() : new Date().toISOString(),
        ]
      );
    }
    console.log(`✅ Sembradas ${pressContent.items.length} coberturas de muestra en press_items.`);
  } else {
    console.log(`ℹ️ press_items ya tiene ${pressCount.rows[0].total} registro(s).`);
  }

  console.log('✅ Migración de colecciones Blog y Prensa completada.');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error migrando colecciones Blog y Prensa:', err);
  process.exit(1);
});
