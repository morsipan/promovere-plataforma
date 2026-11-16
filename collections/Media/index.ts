import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Multimedia',
    plural: 'Archivos Multimedia',
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
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto Alternativo (Alt Text)',
    },
  ],
}
