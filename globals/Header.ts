import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Encabezado / Navegación',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/', 'layout');
        } catch (e) {}
        return doc;
      },
    ],
  },
  admin: {
    group: 'Web Pública',
    description: 'Gestión centralizada del menú principal, isotipo y enlaces superiores del sitio.',
  },
  fields: [
    {
      name: 'logoText',
      type: 'text',
      label: 'Texto del Logotipo',
      defaultValue: 'Promovêre',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Bajada del Logotipo',
      defaultValue: 'Turismo LATAM',
    },
    {
      name: 'logoImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Isotipo / Imagen de Marca (Opcional)',
      admin: {
        description: 'Si no se adjunta, se renderiza el isotipo estilizado "P" oficial.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Enlaces del Menú Principal',
      labels: {
        singular: 'Enlace de Menú',
        plural: 'Enlaces de Menú',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Texto visible',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'href',
              type: 'text',
              label: 'Enlace / URL de Destino (ej: #servicios, /nosotros o externa)',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Abrir en nueva pestaña',
              defaultValue: false,
              admin: { width: '20%' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Botón de Acción Principal (CTA)',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Texto del Botón',
          defaultValue: 'Comunidad Trade',
        },
        {
          name: 'ctaHref',
          type: 'text',
          label: 'Enlace del Botón',
          defaultValue: '/comunidad/login',
        },
      ],
    },
  ],
}
