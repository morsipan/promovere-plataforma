import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const PrMetricsBlock: Block = {
  slug: 'prMetrics',
  labels: {
    singular: 'Métricas de PR (Alcance, Ad Value y Eventos)',
    plural: 'Bloques de Métricas de PR',
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
      defaultValue: 'Impacto de Relaciones Públicas (PR)',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'Métricas de PR en América Latina',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Bajada Descriptiva',
      defaultValue:
        'Medimos el impacto real de cada acción de prensa, relaciones públicas y posicionamiento editorial en los mercados clave de LATAM.',
    },
    {
      name: 'metrics',
      type: 'array',
      label: 'Indicadores de PR (Alcance, Ad Value, Cantidad de Eventos)',
      labels: {
        singular: 'Métrica de PR',
        plural: 'Métricas de PR',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'metricKey',
              type: 'select',
              enumName: 'enum_prm_key',
              label: 'Tipo de Indicador',
              required: true,
              defaultValue: 'alcance',
              options: [
                { label: 'Alcance de PR', value: 'alcance' },
                { label: 'Ad Value (AVE)', value: 'ad_value' },
                { label: 'Cantidad de Eventos', value: 'eventos' },
              ],
              admin: { width: '35%' },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Nombre del Indicador',
              required: true,
              admin: { width: '35%' },
            },
            {
              name: 'value',
              type: 'text',
              label: 'Valor (cargar cifra validada en /admin)',
              required: true,
              admin: { width: '30%' },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción del Indicador',
        },
      ],
    },
  ],
}
