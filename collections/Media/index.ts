import type { CollectionConfig } from 'payload'

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
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
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
