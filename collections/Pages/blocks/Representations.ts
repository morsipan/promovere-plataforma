import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const RepresentationsBlock: Block = {
  slug: 'representations',
  labels: {
    singular: 'Módulo Representaciones',
    plural: 'Módulos Representaciones',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blanco',
      defaultTheme: 'light',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta',
      defaultValue: 'Nuestras Representaciones',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      defaultValue: 'Marcas y Destinos de Excelencia',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      defaultValue:
        'Conocé las cadenas hoteleras, operadores receptivos y marcas internacionales que confían en Promovêre para su comercialización y crecimiento en América Latina.',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Listado de Representaciones',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título / Destino',
          required: true,
        },
        {
          name: 'brand',
          type: 'text',
          label: 'Marca / Cadena',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          label: 'País / Región',
          required: true,
        },
        {
          name: 'category',
          type: 'text',
          label: 'Categoría (ej: Hotelería All-Inclusive, Resort de Lujo)',
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Etiqueta destacada (ej: Vê REPS®, Exclusivo)',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción breve',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Fotografía del Destino / Hotel (Arrastrar y soltar)',
          admin: {
            description:
              'Subí la foto representativa directamente arrastrando el archivo o seleccionándolo de la biblioteca.',
          },
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'URL de Imagen Externa (Respaldo)',
          admin: {
            description: 'Enlace web alternativo si no se sube un archivo multimedia.',
          },
        },
      ],
    },
  ],
}
