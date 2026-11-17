import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Módulo Hero Principal',
    plural: 'Módulos Hero Principal',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'grisOscuro',
      defaultTheme: 'dark',
      defaultOverlayOpacity: 'media',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta Superior',
      defaultValue: 'Especialistas en Promoción Turística en LATAM',
      admin: {
        description: 'Texto de la píldora informativa superior.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'preTitle',
          type: 'text',
          label: 'Texto Previo del Título',
          defaultValue: 'Somos',
          admin: {
            width: '50%',
            description: 'Texto inicial antes de la palabra destacada (ej: "Somos").',
          },
        },
        {
          name: 'highlightedWord',
          type: 'text',
          label: 'Palabra o Frase Destacada (Azul de Marca)',
          defaultValue: 'Promovêre',
          admin: {
            width: '50%',
            description: 'Se estiliza automáticamente en Azul Brillante (#1b87c7) y tipografía Baloo Da 2.',
          },
        },
      ],
    },
    {
      name: 'titleSuffix',
      type: 'text',
      label: 'Texto Posterior del Título (Opcional)',
      admin: {
        description: 'Texto adicional que acompaña después de la palabra resaltada (opcional).',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título Completo de Respaldo (Fallback)',
      defaultValue: 'Somos Promovêre',
      admin: {
        description:
          'Se utiliza como alternativa en caso de no desglosar en texto previo y palabra destacada.',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Bajada de Texto',
      required: true,
      defaultValue:
        'Impulsamos la presencia comercial, el posicionamiento y las ventas de destinos, hoteles y marcas turísticas de clase mundial en los mercados más dinámicos de América Latina.',
      admin: {
        description: 'Párrafo explicativo del hero banner (estilo Roboto limpio y legible).',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cta1Label',
          type: 'text',
          label: 'Texto Botón Primario (CTA 1)',
          defaultValue: 'Nuestras Representaciones',
          admin: { width: '50%' },
        },
        {
          name: 'cta1Href',
          type: 'text',
          label: 'Enlace Botón Primario',
          defaultValue: '#representaciones',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cta2Label',
          type: 'text',
          label: 'Texto Botón Secundario (CTA 2)',
          defaultValue: 'Comunidad Promovêre',
          admin: { width: '50%' },
        },
        {
          name: 'cta2Href',
          type: 'text',
          label: 'Enlace Botón Secundario',
          defaultValue: '/comunidad/login',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotografía de Fondo Principal (Arrastrar y soltar)',
      admin: {
        description:
          'Subí una foto panorámica de alta resolución. Si no se selecciona ninguna, se utilizará la imagen institucional por defecto.',
      },
    },
    {
      name: 'backgroundImageUrl',
      type: 'text',
      label: 'URL de Imagen Externa (Respaldo alternativo)',
      admin: {
        description: 'URL directa de respaldo en caso de no subir un archivo multimedia.',
      },
    },
  ],
}
