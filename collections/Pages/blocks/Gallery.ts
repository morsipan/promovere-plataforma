import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Galería de Experiencias y Destinos',
    plural: 'Galería de Experiencias',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blanco',
      defaultTheme: 'light',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta Superior',
      defaultValue: 'Galería de Experiencias',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Galería',
      required: true,
      defaultValue: 'Destinos y propiedades de clase mundial',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo descriptivo',
      defaultValue:
        'Una muestra visual de los resorts, destinos y vivencias que representamos en los mercados emisores más importantes.',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Fotos y Recursos Visuales',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'text',
          label: 'URL de Imagen (Unsplash, CDN o subida)',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Nombre del Hotel / Destino',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'location',
              type: 'text',
              label: 'Ubicación / País',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Etiqueta (ej: Lujo, All-Inclusive, Aventura, Caribe)',
          defaultValue: 'Representación Oficial',
        },
      ],
    },
  ],
}
