import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'Preguntas Frecuentes (FAQ Acordeón)',
    plural: 'Preguntas Frecuentes',
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
      defaultValue: 'Preguntas Frecuentes',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'Resolvemos tus dudas sobre nuestra operativa',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Bajada descriptiva',
      defaultValue:
        'Respuestas claras para cadenas hoteleras, destinos, operadores mayoristas y agencias de viajes.',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Listado de Preguntas y Respuestas',
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Pregunta',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Respuesta',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          label: 'Categoría',
          defaultValue: 'general',
          options: [
            { label: 'General / Institucional', value: 'general' },
            { label: 'Representaciones & Hoteles', value: 'representaciones' },
            { label: 'Trade (Operadores & Agencias)', value: 'trade' },
            { label: 'Comunidad Promovêre', value: 'comunidad' },
          ],
        },
      ],
    },
  ],
}
