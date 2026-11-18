import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const staticDir = process.env.VERCEL
  ? path.resolve('/tmp/media')
  : path.resolve(dirname, '../../public/media')

try {
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true })
  }
} catch {}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Multimedia',
    plural: 'Archivos Multimedia',
  },
  admin: {
    group: 'Biblioteca Digital',
    description: 'Gestión centralizada de fotografías, logos e imágenes del sitio.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
    update: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  hooks: {
    beforeOperation: [
      () => {
        try {
          if (!fs.existsSync(staticDir)) {
            fs.mkdirSync(staticDir, { recursive: true });
          }
        } catch (e) {}
      },
    ],
    afterError: [
      ({ error }) => {
        console.error('PAYLOAD MEDIA ERROR:', error);
        return {
          response: {
            errors: [
              {
                message: error?.message || 'Media upload error',
                name: error?.name,
                stack: error?.stack,
              },
            ],
          },
          status: 500,
        };
      },
    ],
  },
  upload: {
    // Si estamos en Vercel Serverless y aún no se configuró Blob/S3, usamos /tmp para evitar EROFS (read-only filesystem)
    staticDir,
    mimeTypes: [
      'image/*',
      'image/svg+xml',
      'image/webp',
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/x-icon',
      'image/vnd.microsoft.icon',
    ],
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto Alternativo (Alt Text)',
    },
  ],
}
