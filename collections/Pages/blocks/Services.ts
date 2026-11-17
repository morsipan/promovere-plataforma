import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const ServicesBlock: Block = {
  slug: 'services',
  labels: {
    singular: 'Módulo Servicios',
    plural: 'Módulos Servicios',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blancoHumo',
      defaultTheme: 'light',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta',
      defaultValue: 'Nuestros Servicios',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      defaultValue: 'Solución integral para tu marca turística',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      defaultValue:
        'Ecosistema estratégico 360° para comercializar, posicionar y expandir marcas turísticas internacionales en el trade y público final de América Latina.',
    },
    {
      name: 'servicesList',
      type: 'array',
      label: 'Listado de Servicios',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título del Servicio',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtítulo / Tagline',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción detallada',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Ícono Representativo',
          defaultValue: 'Briefcase',
          options: [
            { label: 'Maletín (Briefcase)', value: 'Briefcase' },
            { label: 'Megáfono (Megaphone)', value: 'Megaphone' },
            { label: 'Usuarios / Comunidad (Users)', value: 'Users' },
            { label: 'Capacitación (GraduationCap)', value: 'GraduationCap' },
            { label: 'Brújula / Producto (Compass)', value: 'Compass' },
            { label: 'Calendario / Eventos (Calendar)', value: 'Calendar' },
            { label: 'Crecimiento (TrendingUp)', value: 'TrendingUp' },
            { label: 'Globo / Red (Globe)', value: 'Globe' },
            { label: 'Estrella / Calidad (Star)', value: 'Star' },
          ],
        },
        {
          name: 'highlights',
          type: 'array',
          label: 'Puntos Destacados / Entregables',
          fields: [
            {
              name: 'item',
              type: 'text',
              label: 'Punto destacado',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
