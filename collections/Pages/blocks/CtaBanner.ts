import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const CtaBannerBlock: Block = {
  slug: 'ctaBanner',
  labels: {
    singular: 'Módulo de Banner de Acción (CTA Destacado)',
    plural: 'Módulos de Banner de Acción',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'azul',
      defaultTheme: 'dark',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta Superior',
      defaultValue: 'Expande tu Presencia en LATAM',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título del Banner',
      required: true,
      defaultValue: '¿Listo para acelerar tus ventas turísticas en la región?',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción / Argumento',
      defaultValue:
        'Conectamos tu marca hotelera o destino con más de 500 operadores mayoristas y miles de agencias minoristas en Argentina, Brasil, Chile, Colombia, México y toda la región.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'primaryButtonLabel',
          type: 'text',
          label: 'Texto Botón Primario',
          defaultValue: 'Agendar Reunión Comercial',
          admin: { width: '50%' },
        },
        {
          name: 'primaryButtonHref',
          type: 'text',
          label: 'Enlace Botón Primario',
          defaultValue: '#contacto',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'secondaryButtonLabel',
          type: 'text',
          label: 'Texto Botón Secundario (Opcional)',
          defaultValue: 'Ingresar a la Comunidad',
          admin: { width: '50%' },
        },
        {
          name: 'secondaryButtonHref',
          type: 'text',
          label: 'Enlace Botón Secundario',
          defaultValue: '/comunidad/login',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'text',
      label: 'URL de Imagen de Fondo (Opcional)',
    },
  ],
}
