import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Módulo Hero',
    plural: 'Módulos Hero',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta Superior',
      defaultValue: 'Especialistas en Promoción Turística en LATAM',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título Principal',
      required: true,
      defaultValue: 'Somos Promovêre',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Bajada',
      required: true,
      defaultValue:
        'Impulsamos la presencia comercial, el posicionamiento y las ventas de destinos, hoteles y marcas turísticas de clase mundial en los mercados más dinámicos de América Latina.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cta1Label',
          type: 'text',
          label: 'Texto Botón Primario (CTA 1)',
          defaultValue: 'Nuestras Representaciones',
          admin: { width: '50%' },
        },
        {
          name: 'cta1Href',
          type: 'text',
          label: 'Enlace Botón Primario',
          defaultValue: '#representaciones',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cta2Label',
          type: 'text',
          label: 'Texto Botón Secundario (CTA 2)',
          defaultValue: 'Comunidad Promovêre',
          admin: { width: '50%' },
        },
        {
          name: 'cta2Href',
          type: 'text',
          label: 'Enlace Botón Secundario',
          defaultValue: '#contacto',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'text',
      label: 'URL de Imagen de Fondo',
      defaultValue:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    },
  ],
}
