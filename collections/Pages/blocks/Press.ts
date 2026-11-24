import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const PressBlock: Block = {
  slug: 'press',
  labels: {
    singular: 'Prensa Unificada (Medios + Videos)',
    plural: 'Bloques de Prensa Unificada',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blanco',
      defaultTheme: 'light',
      defaultAccentColor: 'verde',
      defaultButtonColor: 'azul',
      defaultBadgeColor: 'azul',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta Superior',
      defaultValue: 'Prensa & Medios',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'Promovêre en Prensa, Entrevistas y Videos',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Bajada Descriptiva',
      defaultValue:
        'Un único espacio que reúne nuestras apariciones en medios especializados del trade turístico junto con entrevistas, participaciones en ferias y coberturas audiovisuales.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'allPressLabel',
          type: 'text',
          label: 'Texto del Enlace a Prensa Completa',
          defaultValue: 'Ver sección completa de Prensa',
          admin: { width: '50%' },
        },
        {
          name: 'allPressHref',
          type: 'text',
          label: 'URL de Prensa Completa',
          defaultValue: '/prensa',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'showCommunityBanner',
      type: 'checkbox',
      label: 'Mostrar Franja de Acceso a Comunidad Promovêre',
      defaultValue: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'communityCtaLabel',
          type: 'text',
          label: 'Botón de Acceso a Comunidad',
          defaultValue: 'Ir a Comunidad Promovêre',
          admin: { width: '50%' },
        },
        {
          name: 'communityCtaHref',
          type: 'text',
          label: 'Enlace a Comunidad',
          defaultValue: '/comunidad',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Coberturas de Prensa (Notas en Medios y Videos)',
      labels: {
        singular: 'Cobertura de Prensa',
        plural: 'Coberturas de Prensa',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'format',
              type: 'select',
              enumName: 'enum_pr_fmt',
              label: 'Formato',
              required: true,
              defaultValue: 'nota',
              options: [
                { label: 'Nota en Medio Externo', value: 'nota' },
                { label: 'Entrevista / Cobertura en Video', value: 'video' },
              ],
              admin: { width: '35%' },
            },
            {
              name: 'mediaOutlet',
              type: 'text',
              label: 'Medio / Canal',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'publishedDate',
              type: 'date',
              label: 'Fecha',
              admin: {
                width: '25%',
                date: { pickerAppearance: 'dayOnly' },
              },
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titular de la Nota o Entrevista',
          required: true,
        },
        {
          name: 'summary',
          type: 'textarea',
          label: 'Resumen de la Cobertura',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen / Miniatura (CMS)',
              admin: { width: '50%' },
            },
            {
              name: 'coverImageUrl',
              type: 'text',
              label: 'URL de Imagen / Miniatura (Opcional)',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'articleUrl',
              type: 'text',
              label: 'Enlace a Nota Externa (si es Nota)',
              admin: { width: '45%' },
            },
            {
              name: 'videoUrl',
              type: 'text',
              label: 'URL de Video YouTube / Vimeo (si es Video)',
              admin: { width: '40%' },
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Duración (ej: 08:30)',
              admin: { width: '15%' },
            },
          ],
        },
      ],
    },
  ],
}
