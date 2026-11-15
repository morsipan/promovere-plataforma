import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isPostgresConfigured = Boolean(
  process.env.DATABASE_URI &&
  process.env.DATABASE_URI.startsWith('postgres') &&
  !process.env.DATABASE_URI.includes('your-project-ref')
)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Pages, Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'promovere-payload-secret-key-32-characters-minimum',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: isPostgresConfigured
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI!,
        },
      })
    : sqliteAdapter({
        client: {
          url: process.env.SQLITE_URL || 'file:./local.db',
        },
      }),
  sharp,
})
