import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const CommunitySettings: GlobalConfig = {
  slug: 'community-settings',
  dbName: 'community_settings',
  label: 'Configuración de la Comunidad',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/comunidad', 'layout')
        } catch {}
        return doc
      },
    ],
  },
  admin: {
    group: 'Comunidad Trade',
    description:
      'Editá el aviso urgente, el mensaje de bienvenida, la política B2B y el canal de WhatsApp Trade del portal privado.',
  },
  fields: [
    // =========================================================================
    // 1. Aviso Urgente / Cintillo Superior
    // =========================================================================
    {
      name: 'alertBanner',
      type: 'group',
      label: 'Aviso Urgente / Cintillo Superior',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Mostrar cintillo de aviso en la parte superior del Dashboard',
          defaultValue: false,
        },
        {
          name: 'message',
          type: 'text',
          label: 'Mensaje del Aviso',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
            description: 'Ej: ¡Inscripciones abiertas para el Workshop Cono Sur 2026!',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaLabel',
              type: 'text',
              label: 'Texto del Botón (Opcional)',
              defaultValue: 'Ver más',
              admin: {
                width: '40%',
                condition: (_, siblingData) => Boolean(siblingData?.enabled),
              },
            },
            {
              name: 'ctaUrl',
              type: 'text',
              label: 'Enlace del Botón (Opcional)',
              admin: {
                width: '60%',
                condition: (_, siblingData) => Boolean(siblingData?.enabled),
              },
            },
          ],
        },
      ],
    },

    // =========================================================================
    // 2. Banner de Bienvenida y Política B2B
    // =========================================================================
    {
      name: 'welcomeBanner',
      type: 'group',
      label: 'Banner de Bienvenida y Política B2B',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Etiqueta Superior (Badge)',
          defaultValue: 'Portal Exclusivo para Profesionales de Turismo',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Mensaje de Bienvenida',
          defaultValue:
            'Espacio exclusivo para Operadores Mayoristas y Agencias de Viajes. Aquí encontrarás el catálogo oficial de destinos representados, fichas técnicas, promociones vigentes y herramientas comerciales de apoyo.',
        },
        {
          name: 'b2bPolicyTitle',
          type: 'text',
          label: 'Título de Política B2B',
          defaultValue: 'Política de Seguridad B2B:',
        },
        {
          name: 'b2bPolicyText',
          type: 'textarea',
          label: 'Texto de Política B2B / Confidencialidad',
          defaultValue:
            'Por normativas de confidencialidad del trade, este portal no publica tarifas ni precios confidenciales al público. Los materiales están destinados a soporte de ventas, formación y cotización directa con operadores habilitados.',
        },
      ],
    },

    // =========================================================================
    // 3. Canal de WhatsApp Trade
    // =========================================================================
    {
      name: 'whatsappChannel',
      type: 'group',
      label: 'Canal de WhatsApp Trade',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Mostrar banner del Canal de WhatsApp en el Dashboard',
          defaultValue: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Título del Banner',
              defaultValue: 'Sumate al Canal Oficial de WhatsApp Trade',
              admin: { width: '50%' },
            },
            {
              name: 'buttonLabel',
              type: 'text',
              label: 'Texto del Botón',
              defaultValue: 'Unirme por WhatsApp',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción del Canal',
          defaultValue:
            'Recibí alertas instantáneas de promociones, cupos de Fam Tours, lanzamientos hoteleros y novedades comerciales directo en tu teléfono.',
        },
        {
          name: 'whatsappUrl',
          type: 'text',
          label: 'Enlace del Grupo / Canal / Chat de WhatsApp',
          defaultValue: 'https://wa.me/5491100000000',
          admin: {
            description: 'Ej: https://whatsapp.com/channel/... o https://wa.me/54911...',
          },
        },
      ],
    },
  ],
}
