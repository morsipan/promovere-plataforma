import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const PartnersBlock: Block = {
  slug: 'partners',
  labels: {
    singular: 'Módulo Partners / Aliados',
    plural: 'Módulos Partners / Aliados',
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
      defaultValue: 'Nuestros Aliados',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      defaultValue: 'Empresas y Cadenas que Confían en Nosotros',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      defaultValue:
        'Trabajamos con los operadores mayoristas más prestigiosos, cadenas hoteleras internacionales y asociaciones clave del sector turístico regional.',
    },
    {
      name: 'partnersList',
      type: 'array',
      label: 'Listado de Partners',
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
