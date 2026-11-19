import type { Block } from 'payload'

export const FullWidthImageBlock: Block = {
  slug: 'fullWidthImage',
  labels: {
    singular: 'Módulo de Banner / Imagen Full-Width (Ancho Completo)',
    plural: 'Módulos de Banner / Imagen Full-Width',
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
          enumName: 'enum_fwi_height',
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
          enumName: 'enum_fwi_overlay',
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
          name: 'linkType',
          type: 'select',
          enumName: 'enum_fwi_link_type',
          label: 'Comportamiento del Enlace',
          defaultValue: 'cta',
          options: [
            { label: 'Enlace en botón CTA (solo cliqueable en el botón)', value: 'cta' },
            { label: 'Enlace en elemento completo (todo el banner es cliqueable)', value: 'full' },
          ],
          admin: {
            width: '30%',
            description: 'Define si el enlace se activa únicamente en el botón CTA o en toda la superficie del banner.',
          },
        },
        {
          name: 'buttonHref',
          type: 'text',
          label: 'URL de Enlace / Destino (Opcional)',
          admin: {
            width: '30%',
            description: 'Destino al hacer clic (ej. /contacto o https://...).',
          },
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Texto del Botón CTA (Opcional)',
          admin: {
            width: '25%',
            description: 'Etiqueta del botón (opcional si es elemento completo).',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Abrir en nueva pestaña',
          defaultValue: false,
          admin: { width: '15%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'contentAlignment',
          type: 'select',
          enumName: 'enum_fwi_align',
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
