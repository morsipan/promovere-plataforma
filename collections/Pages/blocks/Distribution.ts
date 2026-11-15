import type { Block } from 'payload'

export const DistributionBlock: Block = {
  slug: 'distribution',
  labels: {
    singular: 'Módulo Red LATAM / Distribución',
    plural: 'Módulos Red LATAM / Distribución',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta',
      defaultValue: 'Red de Distribución',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      defaultValue: 'Alcance Comercial Estratégico en América Latina',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      defaultValue:
        'Conectamos marcas con más de 12.000 profesionales del turismo a través de nuestra red multicanal y presencia activa en los mercados emisores clave.',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Métricas / Estadísticas Clave',
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Valor (ej: +12K, 8, +15)',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Etiqueta (ej: Agencias Conectadas)',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Descripción complementaria',
        },
      ],
    },
    {
      name: 'channels',
      type: 'array',
      label: 'Canales de Distribución y Alcance',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Nombre del Canal / Segmento',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción operativa',
          required: true,
        },
        {
          name: 'coverage',
          type: 'text',
          label: 'Cobertura geográfica / alcance',
        },
      ],
    },
  ],
}
