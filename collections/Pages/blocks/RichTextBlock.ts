import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Texto Enriquecido (Comunicados / Editorial)',
    plural: 'Textos Enriquecidos',
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
      defaultValue: 'Comunicado Institucional',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección / Artículo',
      required: true,
      defaultValue: 'Nuestra visión y compromiso con el trade turístico',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Cuerpo del Contenido / Texto Enriquecido',
      required: false,
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Alineación de Texto',
      defaultValue: 'left',
      options: [
        { label: 'Alineado a la Izquierda', value: 'left' },
        { label: 'Centrado', value: 'center' },
      ],
    },
  ],
}
