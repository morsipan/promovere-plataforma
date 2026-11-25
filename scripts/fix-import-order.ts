import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URI || '';
if (!connectionString) {
  console.error('❌ Falta DATABASE_URI para normalizar el orden de importación.');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function reverseCreatedAtById(
  table: 'blog_posts' | 'press_items',
  whereClause: string,
  params: unknown[],
  label: string
) {
  const res = await client.query<{ id: number }>(
    `SELECT id FROM ${table} ${whereClause} ORDER BY id ASC`,
    params
  );

  const rows = res.rows;
  if (rows.length === 0) {
    console.log(`ℹ️ ${label}: sin registros.`);
    return;
  }

  // El primer ítem importado (menor id = más reciente en la web original)
  // recibe el created_at más reciente; el último (mayor id = más antiguo) recibe el más antiguo.
  const baseMs = Date.now() - 60 * 60 * 1000; // 1 hora atrás para que futuras altas en /admin queden arriba
  for (let i = 0; i < rows.length; i++) {
    const ts = new Date(baseMs - i * 60 * 1000).toISOString();
    await client.query(`UPDATE ${table} SET created_at = $1 WHERE id = $2`, [ts, rows[i].id]);
  }

  console.log(`✅ ${label}: orden invertido/normalizado en ${rows.length} registros (id ${rows[0].id} primero -> id ${rows[rows.length - 1].id} último).`);
}

async function run() {
  await client.connect();
  await reverseCreatedAtById('blog_posts', '', [], 'Blog (Promo News)');
  await reverseCreatedAtById('press_items', 'WHERE format = $1', ['nota'], 'Prensa (Notas en Medios)');
  await reverseCreatedAtById('press_items', 'WHERE format = $1', ['video'], 'Contenidos (Entrevistas y Videos)');
  await client.end();
}

run().catch((err) => {
  console.error('❌ Error normalizando orden:', err);
  process.exit(1);
});
