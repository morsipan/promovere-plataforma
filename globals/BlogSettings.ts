import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

const isInternalTeam = ({ req: { user } }: { req: { user?: any } }) =>
  Boolean(user?.role && ['admin', 'editor'].includes(user.role))

export const BlogSettings: GlobalConfig = {
  slug: 'blog-settings',
  dbName: 'blog_settings',
  label: 'Ajustes de blog',
  access: {
    read: () => true,
    update: isInternalTeam,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/')
          revalidatePath('/blog', 'layout')
          revalidatePath('/prensa', 'layout')
        } catch {}
        return doc
      },
    ],
  },
  admin: {
    group: 'News',
    description:
      'Configuración visual y editorial general para Promo News (listado y todos los posteos individuales del Blog).',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Encabezado y Visibilidad',
          fields: [
            {
              name: 'blogTitle',
              type: 'text',
              label: 'Título General del Blog',
              defaultValue: 'Promo News',
              admin: {
                description:
                  'Título principal mostrado en la cabecera del listado de Promo News (/blog).',
              },
            },
            {
              name: 'blogSubtitle',
              type: 'textarea',
              label: 'Bajada General del Blog',
              defaultValue:
                'Novedades oficiales de Promovêre, lanzamientos, destinos y cadenas hoteleras representadas en América Latina.',
              admin: {
                description:
                  'Descripción breve mostrada debajo del título principal en /blog.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'headerBackground',
                  type: 'select',
                  enumName: 'enum_bs_hdr_bg',
                  label: 'Fondo del Encabezado (Listado y Posteos)',
                  defaultValue: 'grisOscuro',
                  options: [
                    { label: 'Gris Antracita (#4d4e4f)', value: 'grisOscuro' },
                    { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
                    { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                    { label: 'Blanco Humo (#f9f9f9)', value: 'blancoHumo' },
                  ],
                  admin: {
                    width: '50%',
                    components: {
                      Field: '/components/admin/BrandColorPicker#BrandColorPicker',
                    },
                  },
                },
                {
                  name: 'headerTitleColor',
                  type: 'select',
                  enumName: 'enum_bs_hdr_ttl',
                  label: 'Color del Título en Encabezado',
                  defaultValue: 'blanco',
                  options: [
                    { label: 'Blanco Puro (#ffffff)', value: 'blanco' },
                    { label: 'Blanco Humo (#f9f9f9)', value: 'blancoHumo' },
                    { label: 'Gris Antracita (#4d4e4f)', value: 'grisOscuro' },
                    { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
                    { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                  ],
                  admin: {
                    width: '50%',
                    components: {
                      Field: '/components/admin/BrandColorPicker#BrandColorPicker',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'showDate',
                  type: 'checkbox',
                  label: 'Mostrar fecha de publicación en los posteos',
                  defaultValue: true,
                  admin: { width: '33.3%' },
                },
                {
                  name: 'showCategory',
                  type: 'checkbox',
                  label: 'Mostrar categoría en los posteos',
                  defaultValue: true,
                  admin: { width: '33.3%' },
                },
                {
                  name: 'showBrand',
                  type: 'checkbox',
                  label: 'Mostrar marca / tag asociado en los posteos',
                  defaultValue: true,
                  admin: { width: '33.3%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Etiquetas, Categorías y Tags',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'categoryColor',
                  type: 'select',
                  enumName: 'enum_bs_cat_clr',
                  label: 'Color de Etiquetas / Categorías',
                  defaultValue: 'azul',
                  options: [
                    { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
                    { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                    { label: 'Gris Antracita (#4d4e4f)', value: 'grisOscuro' },
                  ],
                  admin: {
                    width: '50%',
                    description:
                      'Aplica a los badges de categoría en todos los artículos y en el listado.',
                    components: {
                      Field: '/components/admin/BrandColorPicker#BrandColorPicker',
                    },
                  },
                },
                {
                  name: 'tagColor',
                  type: 'select',
                  enumName: 'enum_bs_tag_clr',
                  label: 'Color de Tags / Marca',
                  defaultValue: 'verde',
                  options: [
                    { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                    { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
                    { label: 'Gris Antracita (#4d4e4f)', value: 'grisOscuro' },
                  ],
                  admin: {
                    width: '50%',
                    description:
                      'Aplica a los tags de marca/destino en todos los posteos y tarjetas.',
                    components: {
                      Field: '/components/admin/BrandColorPicker#BrandColorPicker',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'badgeStyle',
                  type: 'select',
                  enumName: 'enum_bs_bdg_sty',
                  label: 'Estilo de Badges (Categorías y Tags)',
                  defaultValue: 'soft',
                  options: [
                    { label: 'Suave con borde (Default)', value: 'soft' },
                    { label: 'Sólido de marca', value: 'solid' },
                    { label: 'Contorno minimalista (Outline)', value: 'outline' },
                  ],
                  admin: { width: '33.3%' },
                },
                {
                  name: 'accentColor',
                  type: 'select',
                  enumName: 'enum_bs_acc_clr',
                  label: 'Color de Acento General',
                  defaultValue: 'azul',
                  options: [
                    { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
                    { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                    { label: 'Gris Antracita (#4d4e4f)', value: 'grisOscuro' },
                  ],
                  admin: {
                    width: '33.3%',
                    description: 'Enlaces, paginación activa y realces de lectura.',
                    components: {
                      Field: '/components/admin/BrandColorPicker#BrandColorPicker',
                    },
                  },
                },
                {
                  name: 'cardBorderStyle',
                  type: 'select',
                  enumName: 'enum_bs_crd_brd',
                  label: 'Estilo de Borde y Contenedor de Artículos',
                  defaultValue: 'subtle',
                  options: [
                    { label: 'Borde sutil (Default)', value: 'subtle' },
                    { label: 'Borde con acento de marca', value: 'accent' },
                    { label: 'Elevado con sombra', value: 'elevated' },
                  ],
                  admin: { width: '33.3%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Banners Publicitarios (Prensa y Contenidos)',
          fields: [
            {
              name: 'showBannerBeforePagination',
              type: 'checkbox',
              label: 'Mostrar banner antes de la paginación',
              defaultValue: true,
              admin: {
                description:
                  'En Prensa y Contenidos, además de intercalar un banner cada 4 elementos, muestra un banner limpio antes de los controles de paginación cuando corresponda.',
              },
            },
            {
              name: 'banners',
              type: 'array',
              label: 'Banners Publicitarios para Prensa y Contenidos (cada 4 elementos)',
              labels: {
                singular: 'Banner Publicitario',
                plural: 'Banners Publicitarios',
              },
              admin: {
                description:
                  'Cargá uno o más banners desde Media. Se muestran en Prensa y/o Contenidos (no en Blog propio) y rotan automáticamente cada 4 elementos según el orden configurado.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Banner activo',
                      defaultValue: true,
                      admin: { width: '25%' },
                    },
                    {
                      name: 'placement',
                      type: 'select',
                      enumName: 'enum_bs_bnr_plc',
                      label: 'Ubicación',
                      defaultValue: 'ambos',
                      options: [
                        { label: 'Prensa y Contenidos (Ambos)', value: 'ambos' },
                        { label: 'Solo Prensa (Notas en Medios)', value: 'prensa' },
                        { label: 'Solo Contenidos (Entrevistas y Coberturas)', value: 'contenidos' },
                      ],
                      admin: { width: '35%' },
                    },
                    {
                      name: 'order',
                      type: 'number',
                      label: 'Orden',
                      defaultValue: 0,
                      admin: {
                        width: '15%',
                        description: 'Menor primero.',
                      },
                    },
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Título / Alt (Opcional)',
                      admin: { width: '25%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Imagen del Banner — Escritorio (Media)',
                      admin: {
                        width: '50%',
                        description: 'Banner horizontal principal para pantallas de escritorio.',
                      },
                    },
                    {
                      name: 'mobileImage',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Banner Responsive / Mobile (opcional)',
                      admin: {
                        width: '50%',
                        description:
                          'Se usa en pantallas móviles (< 768px) para evitar recortes o mala lectura. Si no se carga, se utiliza automáticamente la imagen principal.',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'imageUrl',
                      type: 'text',
                      label: 'URL de Imagen Escritorio (Respaldo opcional)',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'mobileImageUrl',
                      type: 'text',
                      label: 'URL de Imagen Mobile (Respaldo opcional)',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'href',
                  type: 'text',
                  label: 'Enlace externo (Opcional)',
                  admin: {
                    description:
                      'Si se completa, abre en pestaña nueva (target="_blank"). Si queda vacío, se muestra solo como pieza visual.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
