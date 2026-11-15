import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contact',
  labels: {
    singular: 'Módulo Contacto',
    plural: 'Módulos Contacto',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta',
      defaultValue: 'Conversemos',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      defaultValue: '¿Listo para expandir tu presencia turística en LATAM?',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      defaultValue:
        'Nuestro equipo está a disposición para diseñar la estrategia de representación o coordinar acciones comerciales específicas para tu marca.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'text',
          label: 'Correo Electrónico',
          defaultValue: 'marketing@promovere.com.ar',
          admin: { width: '50%' },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Teléfono / WhatsApp',
          defaultValue: '+54 9 11 4587 6932',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'address',
          type: 'text',
          label: 'Dirección Comercial',
          defaultValue: 'Av. Roque Sáenz Peña 720',
          admin: { width: '50%' },
        },
        {
          name: 'addressDetail',
          type: 'text',
          label: 'Detalle de Dirección (Piso / Oficina)',
          defaultValue: 'Piso 6 - Of AB, Ciudad Autónoma de Buenos Aires, Argentina',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
