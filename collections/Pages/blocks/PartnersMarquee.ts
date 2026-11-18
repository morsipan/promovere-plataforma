import type { Block } from 'payload'

export const PartnersMarqueeBlock: Block = {
  slug: 'partnersMarquee',
  labels: {
    singular: 'Marquesina de Logos (Partners)',
    plural: 'Marquesinas de Logos',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título de la Marquesina (Opcional)',
          defaultValue: 'Empresas y Cadenas que Confían en Promovêre',
          admin: { width: '50%' },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtítulo / Bajada (Opcional)',
          admin: { width: '50%' },
        },
      ],
    },
    // =========================================================================
    // 1. Grupo Comportamiento de Animación
    // =========================================================================
    {
      name: 'animationBehavior',
      type: 'group',
      label: 'Comportamiento de Animación',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'animationType',
              type: 'select',
              label: 'Tipo de Animación',
              defaultValue: 'infinite-scroll',
              required: true,
              options: [
                {
                  label: 'Desplazamiento Infinito Continuo (Infinite Scroll)',
                  value: 'infinite-scroll',
                },
                {
                  label: 'Transición por Lotes (Batch Fade)',
                  value: 'batch-fade',
                },
              ],
              admin: {
                width: '50%',
                description:
                  'Elegí entre un carrusel que corre continuamente o una rotación periódica de grupos de logos con fade.',
              },
            },
            {
              name: 'animationSpeed',
              type: 'select',
              label: 'Velocidad de Animación',
              defaultValue: 'normal',
              required: true,
              options: [
                { label: 'Lenta (Slow)', value: 'slow' },
                { label: 'Normal (Medium)', value: 'normal' },
                { label: 'Rápida (Fast)', value: 'fast' },
              ],
              admin: {
                width: '50%',
                description: 'Ajusta la velocidad del carrusel o el intervalo entre lotes.',
              },
            },
          ],
        },
      ],
    },
    // =========================================================================
    // 2. Grupo Estilos de Imagen
    // =========================================================================
    {
      name: 'imageStyles',
      type: 'group',
      label: 'Estilos de Imagen',
      fields: [
        {
          name: 'colorMode',
          type: 'select',
          label: 'Modo de Color de los Logos',
          defaultValue: 'grayscale-hover',
          required: true,
          options: [
            {
              label: 'Escala de Grises por Defecto (Coloreado al Hover)',
              value: 'grayscale-hover',
            },
            {
              label: 'Siempre a Color (Full Color)',
              value: 'always-color',
            },
          ],
          admin: {
            description:
              'En escala de grises brinda una estética uniforme y elegante, mostrando el color original al pasar el cursor.',
          },
        },
      ],
    },
    // =========================================================================
    // 3. Grupo Logos de Partners
    // =========================================================================
    {
      name: 'logos',
      type: 'array',
      label: 'Logos de Partners',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Logo de Partner',
        plural: 'Logos de Partners',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Archivo del Logo (PNG, SVG, WebP)',
              admin: {
                width: '50%',
                description: 'Se recomienda logo horizontal con fondo transparente.',
              },
            },
            {
              name: 'link',
              type: 'text',
              label: 'Enlace Web (Opcional)',
              admin: {
                width: '50%',
                description: 'URL a la que se redirigirá al hacer clic (ej: https://ejemplo.com).',
              },
            },
          ],
        },
      ],
    },
  ],
}
