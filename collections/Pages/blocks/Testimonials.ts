import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Módulo de Testimonios y Casos de Éxito',
    plural: 'Módulos de Testimonios',
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
      defaultValue: 'Testimonios & Casos de Éxito',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'La confianza de los líderes del turismo en LATAM',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo descriptivo',
      defaultValue:
        'Lo que dicen directivos hoteleros, ejecutivos de aerolíneas y turoperadores mayoristas sobre trabajar junto a Promovêre.',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Listado de Testimonios',
      minRows: 1,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Testimonio / Cita textual',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'author',
              type: 'text',
              label: 'Nombre y Apellido',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'role',
              type: 'text',
              label: 'Cargo / Puesto',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'company',
              type: 'text',
              label: 'Empresa / Destino / Cadena',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'rating',
              type: 'number',
              label: 'Puntuación (1 a 5 estrellas)',
              defaultValue: 5,
              min: 1,
              max: 5,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'avatar',
          type: 'text',
          label: 'URL de Foto / Logo de la Empresa (Opcional)',
        },
      ],
    },
  ],
}
