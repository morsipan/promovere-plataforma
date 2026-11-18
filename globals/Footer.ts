import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Pie de Página (Footer)',
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
    description: 'Gestión de columnas de enlaces, avisos legales y textos de pie de página.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'logoImage',
          type: 'upload',
          relationTo: 'media',
          label: '1. Isotipo / Ícono del Footer',
          admin: {
            width: '50%',
            description: 'Ícono gráfico para el pie de página. Si se omite, se muestra el isotipo estándar.',
          },
        },
        {
          name: 'logoTypeImage',
          type: 'upload',
          relationTo: 'media',
          label: '2. Logotipo Completo del Footer',
          admin: {
            width: '50%',
            description: 'Imagen del logo completo (ej: logo en blanco/color para fondo oscuro del footer).',
          },
        },
      ],
    },
    {
      name: 'brandDescription',
      type: 'textarea',
      label: 'Descripción Institucional',
      defaultValue:
        'Conectamos marcas, cadenas hoteleras y destinos de clase mundial con el trade turístico de América Latina. Enfoque 100% B2B comercial.',
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Columnas de Enlaces del Footer',
      labels: {
        singular: 'Columna',
        plural: 'Columnas',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título de la Columna',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Enlaces',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Texto del Enlace',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'href',
                  type: 'text',
                  label: 'Destino (URL)',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          label: 'Texto de Copyright',
          defaultValue: '© 2026 Promovêre S.R.L. — Todos los derechos reservados.',
          admin: { width: '50%' },
        },
        {
          name: 'disclaimerText',
          type: 'text',
          label: 'Texto Legal / Disclaimer',
          defaultValue: 'Plataforma B2B para operadores mayoristas y agencias de viajes.',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
