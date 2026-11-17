import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const StatsBlock: Block = {
  slug: 'stats',
  labels: {
    singular: 'Métricas de Impacto (Estadísticas)',
    plural: 'Métricas de Impacto',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'grisOscuro',
      defaultTheme: 'dark',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta Superior',
      defaultValue: 'Métricas de Impacto',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'El alcance real de Promovêre en números',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo descriptivo',
      defaultValue:
        'Cifras consolidadas que respaldan nuestra trayectoria y presencia comercial en América Latina.',
    },
    {
      name: 'statsList',
      type: 'array',
      label: 'Listado de Métricas',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Cifra / Número destacado (ej: +500, 10+, 98%)',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Etiqueta Principal',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'description',
          type: 'text',
          label: 'Descripción breve de la métrica',
        },
      ],
    },
  ],
}
