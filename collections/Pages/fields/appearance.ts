import type { Field } from 'payload'

export interface AppearanceFieldOptions {
  defaultBackgroundColor?:
    | 'blancoHumo'
    | 'blanco'
    | 'grisOscuro'
    | 'verde'
    | 'azul'
    | 'transparente'
  defaultTheme?: 'light' | 'dark'
  defaultOverlayOpacity?: 'ninguna' | 'sutil' | 'media' | 'intensa'
}

/**
 * Grupo de campos estandarizado "Apariencia" para personalización no-code de bloques.
 * Permite cambiar colores de fondo, tema de contraste (light/dark) e imagen de fondo
 * garantizando la coherencia con el manual de marca de Promovêre.
 */
export function createAppearanceField(options: AppearanceFieldOptions = {}): Field {
  const {
    defaultBackgroundColor = 'blancoHumo',
    defaultTheme = 'light',
    defaultOverlayOpacity = 'media',
  } = options

  return {
    name: 'appearance',
    type: 'group',
    label: 'Personalización Visual (Apariencia)',
    admin: {
      description:
        'Personalizá el color de fondo, imagen y contraste de esta sección respetando el manual de marca y asegurando legibilidad.',
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'backgroundColor',
            type: 'select',
            label: 'Color de Fondo',
            defaultValue: defaultBackgroundColor,
            required: true,
            options: [
              { label: 'Blanco Humo (#f9f9f9)', value: 'blancoHumo' },
              { label: 'Blanco Puro (#ffffff)', value: 'blanco' },
              { label: 'Gris Oscuro Antracita (#4d4e4f)', value: 'grisOscuro' },
              { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
              { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
              { label: 'Transparente', value: 'transparente' },
            ],
            admin: {
              width: '33%',
              description: 'Paleta oficial de Promovêre.',
            },
          },
          {
            name: 'theme',
            type: 'select',
            label: 'Tema de Contraste (Texto)',
            defaultValue: defaultTheme,
            required: true,
            options: [
              {
                label: 'Claro / Light (Títulos y textos oscuros en Gris Antracita #4d4e4f)',
                value: 'light',
              },
              {
                label: 'Oscuro / Dark (Títulos y textos claros en Blanco #ffffff)',
                value: 'dark',
              },
            ],
            admin: {
              width: '33%',
              description: 'Define el color de los textos para garantizar legibilidad.',
            },
          },
          {
            name: 'overlayOpacity',
            type: 'select',
            label: 'Superposición sobre Imagen',
            defaultValue: defaultOverlayOpacity,
            options: [
              { label: 'Ninguna (0%)', value: 'ninguna' },
              { label: 'Sutil (25%)', value: 'sutil' },
              { label: 'Media (50%)', value: 'media' },
              { label: 'Intensa (75%)', value: 'intensa' },
            ],
            admin: {
              width: '34%',
              description: 'Capa oscura para garantizar contraste si hay foto de fondo.',
            },
          },
        ],
      },
      {
        name: 'backgroundImage',
        type: 'upload',
        relationTo: 'media',
        label: 'Fotografía de Fondo (Arrastrar y soltar)',
        admin: {
          description:
            'Subí una foto de fondo opcional para esta sección. Se aplicará con cobertura total (cover) y capa de contraste.',
        },
      },
    ],
  }
}
