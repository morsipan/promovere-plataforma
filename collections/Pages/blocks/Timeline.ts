import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: {
    singular: 'Línea de Tiempo / Trayectoria',
    plural: 'Líneas de Tiempo',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blancoHumo',
      defaultTheme: 'light',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta Superior',
      defaultValue: 'Nuestra Trayectoria',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'Años construyendo puentes comerciales en LATAM',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo descriptivo',
      defaultValue:
        'Hitos clave de crecimiento y alianzas estratégicas que consolidaron a Promovêre como referente del trade regional.',
    },
    {
      name: 'milestones',
      type: 'array',
      label: 'Hitos / Eventos cronológicos',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'year',
              type: 'text',
              label: 'Año / Período (ej: 2020, 2024, Actualidad)',
              required: true,
              admin: { width: '30%' },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Título del Hito',
              required: true,
              admin: { width: '70%' },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción detallada del hito o logro comercial',
          required: true,
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Etiqueta destacada (Opcional)',
        },
      ],
    },
  ],
}
