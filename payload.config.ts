import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { CommunityContent } from './collections/CommunityContent'
import { Media } from './collections/Media'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Cargar variables de entorno si aún no fueron inyectadas por Next.js
try {
  process.loadEnvFile?.(path.resolve(dirname, '.env'))
} catch {}

const databaseUri = process.env.DATABASE_URI || ''
// Configuración de base de datos híbrida:
// Utiliza SQLite (@payloadcms/db-sqlite) con almacenamiento local en local.db para entorno de desarrollo,
// y PostgreSQL (Supabase Connection Pooler) para producción en Vercel.
const preferSqlite =
  process.env.USE_SQLITE === 'true' ||
  process.env.PAYLOAD_DB === 'sqlite' ||
  databaseUri.startsWith('file:')
const isPostgres =
  !preferSqlite &&
  (databaseUri.startsWith('postgres://') || databaseUri.startsWith('postgresql://')) &&
  !databaseUri.includes('your-project-ref')

export default buildConfig({
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  admin: {
    user: Users.slug,
    dateFormat: 'dd/MM/yyyy',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Promovêre CMS',
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
    },
  },
  collections: [Pages, Users, CommunityContent, Media],
  globals: [Header, Footer, SiteSettings],
  plugins: [
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) =>
        doc?.title ? `${doc.title} — Promovêre` : 'Promovêre — Turismo LATAM',
      generateDescription: ({ doc }) => {
        const layout = doc?.layout || []
        const hero = layout.find((b: any) => b.blockType === 'hero')
        return (
          hero?.subtitle ||
          'Conectamos marcas, cadenas hoteleras y destinos de clase mundial con el trade turístico de América Latina.'
        )
      },
      generateURL: ({ doc }) => {
        const serverUrl =
          process.env.NEXT_PUBLIC_SERVER_URL &&
          !process.env.NEXT_PUBLIC_SERVER_URL.includes('localhost')
            ? process.env.NEXT_PUBLIC_SERVER_URL
            : process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : 'https://promovere.com.ar';
        return doc?.slug === 'home' ? serverUrl : `${serverUrl}/${doc?.slug || ''}`;
      },
    }),
  ],
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
        push: false,
      })
    : sqliteAdapter({
        client: {
          url: databaseUri.startsWith('file:') ? databaseUri : 'file:./local.db',
        },
      }),
  sharp,
})
