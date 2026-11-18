import type { Block } from 'payload'

export const ImpactBannerBlock: Block = {
  slug: 'impactBanner',
  labels: {
    singular: 'Banner de Impacto',
    plural: 'Banners de Impacto',
  },
  fields: [
    // =========================================================================
    // 1. Grupo Apariencia (Fondo y Estilo)
    // =========================================================================
    {
      name: 'appearance',
      type: 'group',
      label: 'Apariencia (Fondo y Estilo)',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'backgroundStyle',
              type: 'select',
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
          name: 'backgroundColor',
          type: 'select',
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
    // 2. Grupo Contenido Principal
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
      name: 'cta',
      type: 'group',
      label: 'Llamado a la Acción (Botón CTA)',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Texto del Botón',
              defaultValue: 'Conocer Más',
              admin: {
                width: '40%',
                condition: (_, siblingData) => !siblingData?.iconOnly,
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'Enlace de Destino (URL o #seccion)',
              defaultValue: '#contacto',
              admin: { width: '40%' },
            },
            {
              name: 'iconOnly',
              type: 'checkbox',
              label: 'Solo Icono de Flecha (Newsletter/Compacto)',
              defaultValue: false,
              admin: {
                width: '20%',
                description: 'Si se activa, muestra un botón circular únicamente con la flecha.',
              },
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
      label: 'Elemento Visual Secundario (Opcional a la derecha)',
      admin: {
        description:
          'Subí una tarjeta flotante, un logotipo (ej: Comunidad Promovêre) o un gráfico decorativo. Si está presente, el layout se dividirá en 2 columnas; de lo contrario, el texto se centrará.',
      },
    },
  ],
}
