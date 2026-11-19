import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  dbName: 'site_settings',
  label: 'Ajustes generales',
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
    group: 'Sitios',
    description: 'Datos de contacto oficiales, enlaces a redes sociales y códigos de analítica.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identidad & Contacto',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'companyName',
                  type: 'text',
                  label: 'Nombre Comercial',
                  defaultValue: 'Promovêre',
                  admin: { width: '50%' },
                },
                {
                  name: 'legalName',
                  type: 'text',
                  label: 'Razón Social',
                  defaultValue: 'Promovere S.R.L.',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Teléfono Principal',
                  defaultValue: '+54 11 5238-0000',
                  admin: { width: '50%' },
                },
                {
                  name: 'whatsapp',
                  type: 'text',
                  label: 'WhatsApp Comercial (ej: +5491152380000)',
                  defaultValue: '+5491152380000',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email General',
                  defaultValue: 'info@promovere.com.ar',
                  admin: { width: '50%' },
                },
                {
                  name: 'commercialEmail',
                  type: 'email',
                  label: 'Email Comercial',
                  defaultValue: 'comercial@promovere.com.ar',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'address',
              type: 'text',
              label: 'Dirección Física / Oficina',
              defaultValue: 'Av. Corrientes 1234, Piso 8, CABA, Argentina',
            },
          ],
        },
        {
          label: 'Redes Sociales',
          fields: [
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram URL',
              defaultValue: 'https://instagram.com/promovere_ok',
            },
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn URL',
              defaultValue: 'https://linkedin.com/company/promovere',
            },
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook URL',
              defaultValue: 'https://facebook.com/promovere.turismo',
            },
            {
              name: 'youtube',
              type: 'text',
              label: 'YouTube URL',
            },
          ],
        },
        {
          label: 'Analítica & Métricas',
          fields: [
            {
              name: 'googleAnalyticsId',
              type: 'text',
              label: 'Google Analytics 4 ID (G-XXXXXXXXXX)',
            },
            {
              name: 'metaPixelId',
              type: 'text',
              label: 'Meta Pixel ID',
            },
          ],
        },
      ],
    },
  ],
}
