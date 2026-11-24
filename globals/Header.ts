import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/', 'layout');
        } catch (e) { }
        return doc;
      },
    ],
  },
  admin: {
    group: 'Sitios',
    description:
      'Gestión centralizada del menú principal, isotipo y enlaces superiores del sitio. Nota: las Preguntas Frecuentes (FAQs) se administran y muestran exclusivamente en el Footer (AEO).',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'logoImage',
          type: 'upload',
          relationTo: 'media',
          label: '1. Isotipo / Ícono de Marca (Símbolo)',
          admin: {
            width: '50%',
            description: 'Ícono o símbolo gráfico (ej: el isotipo cuadrado de Promovêre). Si no se adjunta, se renderiza el isotipo estilizado "P".',
          },
        },
        {
          name: 'logoTypeImage',
          type: 'upload',
          relationTo: 'media',
          label: '2. Logotipo (Imagen del Logo completo)',
          admin: {
            width: '50%',
            description: 'Imagen del logo completo (ej: logo-principal.svg para fondo claro con scroll).',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'logoImageTransparent',
          type: 'upload',
          relationTo: 'media',
          label: '3. Isotipo para Navbar Transparente (Opcional)',
          admin: {
            width: '50%',
            description: 'Isotipo para fondo transparente / hero inicial. Si se omite, se usa el isotipo principal.',
          },
        },
        {
          name: 'logoTypeImageTransparent',
          type: 'upload',
          relationTo: 'media',
          label: '4. Logotipo para Navbar Transparente (Fondo Oscuro)',
          admin: {
            width: '50%',
            description: 'Versión del logotipo (ej: logo blanco/claro) que se muestra al entrar al sitio cuando el navbar es transparente.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'logoText',
          type: 'text',
          label: 'Texto del Logotipo (Respaldo / Alt Text)',
          defaultValue: 'Promovêre',
          admin: { width: '50%' },
        },
        {
          name: 'tagline',
          type: 'text',
          label: 'Bajada del Logotipo',
          defaultValue: 'Marketing Turístico',
          admin: {
            width: '50%',
            description: 'Visible cuando no se utiliza una imagen de logotipo.',
          },
        },
      ],
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
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Texto del Botón CTA',
          defaultValue: 'Comunidad Trade',
          admin: { width: '40%' },
        },
        {
          name: 'ctaHref',
          type: 'text',
          label: 'Enlace del Botón CTA',
          defaultValue: '/comunidad/login',
          admin: { width: '40%' },
        },
        {
          name: 'ctaShowIcon',
          type: 'checkbox',
          label: 'Mostrar Ícono (Destello)',
          defaultValue: true,
          admin: { width: '20%' },
        },
      ],
    },
  ],
}
