import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { CommunityContent } from './collections/CommunityContent'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Cargar variables de entorno si aún no fueron inyectadas por Next.js
try {
  process.loadEnvFile?.(path.resolve(dirname, '.env'))
} catch {}

const databaseUri = process.env.DATABASE_URI || ''
// Se conecta nativamente a PostgreSQL (Supabase) cuando se provee la URL de conexión real,
// con respaldo a SQLite local para desarrollo si aún no se configuró Supabase.
const isPostgres =
  (databaseUri.startsWith('postgres://') || databaseUri.startsWith('postgresql://')) &&
  !databaseUri.includes('your-project-ref')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Pages, Users, CommunityContent, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'promovere-payload-secret-key-32-characters-minimum',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: isPostgres
    ? postgresAdapter({
        pool: {
          connectionString: databaseUri,
          ssl: {
            rejectUnauthorized: false,
          },
        },
      })
    : sqliteAdapter({
        client: {
          url: databaseUri.startsWith('file:') ? databaseUri : 'file:./local.db',
        },
      }),
  sharp,
})
