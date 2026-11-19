import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { FullWidthImageBlock } from '../collections/Pages/blocks/FullWidthImage'
import { ImpactBannerBlock } from '../collections/Pages/blocks/ImpactBanner'

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
      'Configurá textos, estilos visuales de los elementos, aviso urgente, canal de WhatsApp y los 3 espacios de banners publicitarios del portal privado.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // =====================================================================
        // TAB 1: Textos, Bienvenida y Canales
        // =====================================================================
        {
          label: 'Textos, Aviso y WhatsApp',
          fields: [
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
        },

        // =====================================================================
        // TAB 2: Estilos de Diseño del Portal
        // =====================================================================
        {
          label: 'Estilos de Diseño',
          fields: [
            {
              name: 'designStyles',
              type: 'group',
              label: 'Personalización Visual de los Elementos de Comunidad',
              admin: {
                description:
                  'Elegí los estilos oficiales para el Banner de Bienvenida, Aviso Superior, WhatsApp, Tarjetas y color de acento.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'welcomeTheme',
                      type: 'select',
                      enumName: 'enum_cs_welcome_theme',
                      label: 'Estilo del Banner de Bienvenida',
                      defaultValue: 'azul-oscuro',
                      options: [
                        { label: 'Azul Institucional Profundo (Default)', value: 'azul-oscuro' },
                        { label: 'Gradiente Marca (Azul a Verde)', value: 'gradiente-marca' },
                        { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
                        { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                        { label: 'Gris Antracita (#4d4e4f)', value: 'grisOscuro' },
                      ],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'alertStyle',
                      type: 'select',
                      enumName: 'enum_cs_alert_style',
                      label: 'Estilo del Cintillo de Aviso Superior',
                      defaultValue: 'gradiente',
                      options: [
                        { label: 'Gradiente Verde a Azul (Default)', value: 'gradiente' },
                        { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
                        { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                        { label: 'Gris Antracita (#4d4e4f)', value: 'grisOscuro' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'whatsappStyle',
                      type: 'select',
                      enumName: 'enum_cs_wa_style',
                      label: 'Estilo del Banner de WhatsApp',
                      defaultValue: 'verde-gradiente',
                      options: [
                        { label: 'Gradiente Verde a Azul (Default)', value: 'verde-gradiente' },
                        { label: 'Verde Corporativo Sólido (#3cac59)', value: 'verde' },
                        { label: 'Azul Brillante Sólido (#1b87c7)', value: 'azul' },
                        { label: 'Gris Antracita (#4d4e4f)', value: 'grisOscuro' },
                      ],
                      admin: { width: '33.3%' },
                    },
                    {
                      name: 'cardStyle',
                      type: 'select',
                      enumName: 'enum_cs_card_style',
                      label: 'Estilo de Tarjetas del Portal',
                      defaultValue: 'elevated',
                      options: [
                        { label: 'Elevadas con Sombra (Default)', value: 'elevated' },
                        { label: 'Borde Definido Minimalista', value: 'bordered' },
                        { label: 'Suave / Blanco Humo', value: 'soft' },
                      ],
                      admin: { width: '33.3%' },
                    },
                    {
                      name: 'accentColor',
                      type: 'select',
                      enumName: 'enum_cs_accent',
                      label: 'Color de Acento Principal (Botones y Tabs)',
                      defaultValue: 'azul',
                      options: [
                        { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
                        { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                      ],
                      admin: { width: '33.3%' },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // =====================================================================
        // TAB 3: 3 Espacios de Banners Publicitarios (Full-Width & Impact)
        // =====================================================================
        {
          label: 'Banners Publicitarios (3 Espacios)',
          fields: [
            {
              name: 'adBannerTop',
              type: 'blocks',
              label: 'Espacio Publicitario 1 (Superior — Debajo de Bienvenida)',
              maxRows: 1,
              blocks: [FullWidthImageBlock, ImpactBannerBlock],
              admin: {
                description:
                  'Cargá un Banner Full-Width o Banner de Impacto para mostrar en la zona superior del dashboard.',
              },
            },
            {
              name: 'adBannerMiddle',
              type: 'blocks',
              label: 'Espacio Publicitario 2 (Intermedio — Mitad del Dashboard)',
              maxRows: 1,
              blocks: [FullWidthImageBlock, ImpactBannerBlock],
              admin: {
                description:
                  'Cargá un Banner Full-Width o Banner de Impacto para mostrar en la zona intermedia del dashboard.',
              },
            },
            {
              name: 'adBannerBottom',
              type: 'blocks',
              label: 'Espacio Publicitario 3 (Inferior — Antes del Canal de WhatsApp)',
              maxRows: 1,
              blocks: [FullWidthImageBlock, ImpactBannerBlock],
              admin: {
                description:
                  'Cargá un Banner Full-Width o Banner de Impacto para mostrar al pie del dashboard.',
              },
            },
          ],
        },
      ],
    },
  ],
}
