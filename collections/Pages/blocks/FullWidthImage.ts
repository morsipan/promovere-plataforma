import type { Block } from 'payload'

export const FullWidthImageBlock: Block = {
  slug: 'fullWidthImage',
  labels: {
    singular: 'Módulo de Imagen Full-Width (Ancho Completo)',
    plural: 'Módulos de Imagen Full-Width',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen Principal (Desktop / Alta Resolución)',
          admin: {
            width: '50%',
            description: 'Imagen horizontal de alta calidad para ocupar el ancho completo.',
          },
        },
        {
          name: 'mobileImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen Adaptativa para Móvil (Opcional / Vertical)',
          admin: {
            width: '50%',
            description: 'Si se adjunta, se mostrará en pantallas móviles en lugar de la imagen de escritorio.',
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
          label: 'Altura del Módulo',
          defaultValue: 'medium',
          options: [
            { label: 'Auto (Proporción natural de la imagen)', value: 'auto' },
            { label: 'Compacta (320px)', value: 'small' },
            { label: 'Estándar (480px)', value: 'medium' },
            { label: 'Amplia / Hero (640px)', value: 'large' },
            { label: 'Pantalla Completa (100vh)', value: 'screen' },
          ],
          admin: { width: '33.3%' },
        },
        {
          name: 'overlay',
          type: 'select',
          label: 'Capa Superpuesta (Overlay)',
          defaultValue: 'none',
          options: [
            { label: 'Ninguna (Imagen limpia)', value: 'none' },
            { label: 'Sutil (20% oscuridad)', value: 'subtle' },
            { label: 'Media (40% oscuridad)', value: 'medium' },
            { label: 'Intensa (60% contraste)', value: 'strong' },
            { label: 'Degradado Inferior Elegante', value: 'gradient' },
            { label: 'Degradado Corporativo (Azul a Verde)', value: 'brand' },
          ],
          admin: { width: '33.3%' },
        },
        {
          name: 'fullBleed',
          type: 'checkbox',
          label: 'Borde a borde (Full Bleed sin márgenes)',
          defaultValue: true,
          admin: { width: '33.3%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título Superpuesto (Opcional)',
          admin: { width: '50%' },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtítulo / Bajada Superpuesta (Opcional)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Texto del Botón CTA (Opcional)',
          admin: { width: '33.3%' },
        },
        {
          name: 'buttonHref',
          type: 'text',
          label: 'Enlace del Botón (Opcional)',
          admin: { width: '33.3%' },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Abrir enlace en nueva pestaña',
          defaultValue: false,
          admin: { width: '33.3%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'contentAlignment',
          type: 'select',
          label: 'Alineación del Contenido de Texto',
          defaultValue: 'center',
          options: [
            { label: 'Izquierda', value: 'left' },
            { label: 'Centro', value: 'center' },
            { label: 'Derecha', value: 'right' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Pie de Foto / Créditos (Opcional en la esquina inferior)',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
