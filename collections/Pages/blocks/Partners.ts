import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const PartnersBlock: Block = {
  slug: 'partners',
  labels: {
    singular: 'Nuestras Campañas (PR y Marketing)',
    plural: 'Nuestras Campañas',
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
      defaultValue: 'Nuestras Campañas',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      defaultValue: 'Nuestras Campañas de PR y Marketing',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      defaultValue:
        'Campañas activas de relaciones públicas, marketing turístico y posicionamiento anual diseñadas a medida para destinos y marcas en LATAM.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Texto del Botón CTA',
          defaultValue: 'Quiero mi campaña anual',
          admin: { width: '50%' },
        },
        {
          name: 'ctaHref',
          type: 'text',
          label: 'Enlace del Botón CTA',
          defaultValue: '#contacto',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'partnersList',
      type: 'array',
      label: 'Listado de Campañas y Logos',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nombre de la Empresa / Partner',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo Oficial (Arrastrar y soltar)',
          admin: {
            description:
              'Subí el logo en formato PNG, SVG o WebP con fondo transparente o blanco.',
          },
        },
        {
          name: 'logoUrl',
          type: 'text',
          label: 'URL de Logo Externa (Respaldo)',
          admin: {
            description: 'Enlace web directo si no se sube un archivo multimedia.',
          },
        },
        {
          name: 'initials',
          type: 'text',
          label: 'Iniciales / Acrónimo (para avatar/logo alternativo)',
        },
        {
          name: 'category',
          type: 'text',
          label: 'Categoría (ej: Operador Mayorista, Cadena Hotelera, DMC)',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción de la alianza o servicios compartidos',
        },
      ],
    },
  ],
}
