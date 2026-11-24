import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const BlogBlock: Block = {
  slug: 'blog',
  labels: {
    singular: 'Blog Propio (Novedades de Promovêre y Marcas)',
    plural: 'Bloques de Blog Propio',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blancoHumo',
      defaultTheme: 'light',
      defaultAccentColor: 'azul',
      defaultButtonColor: 'azul',
      defaultBadgeColor: 'verde',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta Superior',
      defaultValue: 'Blog Propio',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'Novedades de Promovêre y Nuestras Marcas',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Bajada Descriptiva',
      defaultValue:
        'Artículos editoriales, lanzamientos, tendencias del turismo latinoamericano y actualizaciones directas de los destinos y cadenas que representamos.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Texto del Botón "Ver más" (Opcional)',
          defaultValue: 'Ver todas las notas del Blog',
          admin: { width: '50%' },
        },
        {
          name: 'ctaHref',
          type: 'text',
          label: 'Enlace del Botón',
          defaultValue: '/blog',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'posts',
      type: 'array',
      label: 'Artículos del Blog Propio',
      labels: {
        singular: 'Artículo de Blog',
        plural: 'Artículos de Blog',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Título de la Nota',
              required: true,
              admin: { width: '65%' },
            },
            {
              name: 'publishedDate',
              type: 'date',
              label: 'Fecha de Publicación',
              admin: {
                width: '35%',
                date: { pickerAppearance: 'dayOnly' },
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'category',
              type: 'text',
              label: 'Categoría Editorial',
              defaultValue: 'Novedades',
              admin: { width: '50%' },
            },
            {
              name: 'brand',
              type: 'text',
              label: 'Marca / Destino Asociado',
              defaultValue: 'Promovêre',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: 'Resumen / Bajada Editorial',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen de Portada (CMS)',
              admin: { width: '50%' },
            },
            {
              name: 'coverImageUrl',
              type: 'text',
              label: 'URL de Imagen Externa (Opcional)',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'externalUrl',
          type: 'text',
          label: 'Enlace completo / Artículo (Opcional)',
        },
      ],
    },
  ],
}
