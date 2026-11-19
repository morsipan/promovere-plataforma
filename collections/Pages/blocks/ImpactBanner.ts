import type { Block } from 'payload'

export const ImpactBannerBlock: Block = {
  slug: 'impactBanner',
  labels: {
    singular: 'Banner de Impacto',
    plural: 'Banners de Impacto',
  },
  fields: [
    // =========================================================================
    // 1. Grupo Apariencia y Layout
    // =========================================================================
    {
      name: 'appearance',
      type: 'group',
      label: 'Apariencia y Layout (Fondo, Alto y Disposición)',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundStyle',
              type: 'select',
              enumName: 'enum_ib_bg_style',
              label: 'Estilo de Fondo',
              defaultValue: 'gradient',
              required: true,
              options: [
                { label: 'Gradiente Corporativo (Azul a Verde)', value: 'gradient' },
                { label: 'Color Sólido', value: 'solid' },
                { label: 'Imagen Fotográfica', value: 'image' },
              ],
              admin: {
                width: '50%',
                description: 'Elegí entre un gradiente de marca, un color corporativo plano o una foto de fondo.',
              },
            },
            {
              name: 'theme',
              type: 'select',
              enumName: 'enum_ib_theme',
              label: 'Contraste de Textos (Tema)',
              defaultValue: 'dark',
              required: true,
              options: [
                { label: 'Dark (Textos Blancos / Alto Contraste)', value: 'dark' },
                { label: 'Light (Textos Oscuros / Gris Antracita)', value: 'light' },
              ],
              admin: {
                width: '50%',
                description: 'Garantiza la legibilidad según la oscuridad del fondo elegido.',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'height',
              type: 'select',
              enumName: 'enum_ib_height',
              label: 'Altura del Banner',
              defaultValue: 'medium',
              required: true,
              options: [
                { label: '100% Altura Real de la Imagen (Proporción exacta, ej: 1200x150)', value: 'natural' },
                { label: 'Compacto / Small (py-12)', value: 'small' },
                { label: 'Estándar / Medium (py-24)', value: 'medium' },
                { label: 'Amplio / Large (py-32 / Hero)', value: 'large' },
              ],
              admin: {
                width: '33.3%',
                description: 'Define la separación vertical o respeta el 100% de la proporción de la imagen.',
              },
            },
            {
              name: 'layout',
              type: 'select',
              enumName: 'enum_ib_layout',
              label: 'Disposición del Contenido (Layout)',
              defaultValue: 'centered',
              required: true,
              options: [
                { label: 'Centrado (Todo el contenido al centro)', value: 'centered' },
                { label: 'Split (Textos a la izquierda, botones/elementos a la derecha)', value: 'split' },
              ],
              admin: {
                width: '33.3%',
                description: 'Distribución espacial de los textos y botones.',
              },
            },
            {
              name: 'enableAnimations',
              type: 'checkbox',
              label: 'Animaciones de entrada',
              defaultValue: true,
              admin: {
                width: '16.6%',
                description: 'Efecto Framer Motion al entrar.',
              },
            },
            {
              name: 'enableHoverEffect',
              type: 'checkbox',
              label: 'Efecto hover',
              defaultValue: true,
              admin: {
                width: '16.7%',
                description: 'Desmarcar para quitar zoom/hover.',
              },
            },
          ],
        },
        {
          name: 'backgroundColor',
          type: 'select',
          enumName: 'enum_ib_bg_color',
          label: 'Color de Fondo Sólido',
          defaultValue: 'azul',
          options: [
            { label: 'Blanco Humo (#f9f9f9)', value: 'blancoHumo' },
            { label: 'Gris Oscuro (#4d4e4f)', value: 'grisOscuro' },
            { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
            { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.backgroundStyle === 'solid',
            components: {
              Field: '/components/admin/BrandColorPicker#BrandColorPicker',
            },
            description: 'Seleccioná uno de los 4 colores oficiales del sistema de diseño Promovêre.',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Fotografía de Fondo',
          admin: {
            condition: (_, siblingData) => siblingData?.backgroundStyle === 'image',
            description:
              'Imagen horizontal en alta resolución. Se aplicará con cobertura total y un overlay oscuro para proteger el contraste.',
          },
        },
      ],
    },

    // =========================================================================
    // 2. Grupo Contenido Principal y CTAs
    // =========================================================================
    {
      name: 'title',
      type: 'text',
      label: 'Título de Impacto',
      required: true,
      defaultValue: 'Impulsa tu presencia turística en toda América Latina',
      admin: {
        description: 'Texto principal en tipografía Baloo Da 2 (H2).',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Bajada o Descripción (Opcional)',
      defaultValue:
        'Conectamos hoteles, destinos y operadores con la mayor red del trade turístico en la región.',
      admin: {
        description: 'Texto secundario en tipografía Roboto.',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Botones CTA (Primario y Secundario Opcional — Máx. 2)',
      maxRows: 2,
      labels: {
        singular: 'Botón CTA',
        plural: 'Botones CTA',
      },
      admin: {
        description:
          'Agregá 1 botón principal o un segundo botón CTA secundario (estilo Outline) si necesitás dos acciones.',
      },
      defaultValue: [
        {
          label: 'Conocer Más',
          url: '#contacto',
          style: 'primary',
        },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Texto del Botón',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'url',
              type: 'text',
              label: 'Enlace / URL de Destino',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'style',
              type: 'select',
              enumName: 'enum_ib_btn_style',
              label: 'Estilo Visual',
              defaultValue: 'primary',
              required: true,
              options: [
                { label: 'Primario (Relleno Sólido)', value: 'primary' },
                { label: 'Secundario (Outline / Borde)', value: 'secondary' },
              ],
              admin: { width: '20%' },
            },
          ],
        },
      ],
    },

    // =========================================================================
    // 3. Grupo Elemento Visual Secundario (Opcional a la derecha)
    // =========================================================================
    {
      name: 'secondaryGraphic',
      type: 'upload',
      relationTo: 'media',
      label: 'Elemento Visual Secundario (Opcional)',
      admin: {
        description:
          'Subí una tarjeta flotante, un logotipo (ej: Comunidad Promovêre) o un gráfico decorativo.',
      },
    },
  ],
}
