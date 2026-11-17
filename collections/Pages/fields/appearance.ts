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
  defaultAccentColor?: 'azul' | 'verde' | 'grisOscuro' | 'blanco'
  defaultButtonColor?: 'azul' | 'verde' | 'blanco' | 'oscuro'
  defaultBadgeColor?: 'verde' | 'azul' | 'gris' | 'blanco'
}

/**
 * Grupo de campos estandarizado "Apariencia" para personalización no-code de bloques.
 * Permite cambiar colores de fondo, acentos de elementos (iconos, botones, badges)
 * y tema de contraste garantizando la coherencia visual con la marca Promovêre.
 */
export function createAppearanceField(options: AppearanceFieldOptions = {}): Field {
  const {
    defaultBackgroundColor = 'blancoHumo',
    defaultTheme = 'light',
    defaultOverlayOpacity = 'media',
    defaultAccentColor = 'azul',
    defaultButtonColor = 'azul',
    defaultBadgeColor = 'verde',
  } = options

  return {
    name: 'appearance',
    type: 'group',
    label: 'Personalización Visual (Apariencia & Colores)',
    admin: {
      description:
        'Seleccioná con 1 clic los colores del fondo y de cada elemento (iconos, botones, badges) manteniendo la identidad oficial.',
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'backgroundColor',
            type: 'select',
            label: 'Color de Fondo de Sección',
            defaultValue: defaultBackgroundColor,
            required: true,
            options: [
              { label: 'Blanco Humo (#f9f9f9)', value: 'blancoHumo' },
              { label: 'Blanco Puro (#ffffff)', value: 'blanco' },
              { label: 'Gris Antracita (#4d4e4f)', value: 'grisOscuro' },
              { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
              { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
              { label: 'Transparente', value: 'transparente' },
            ],
            admin: {
              width: '50%',
              components: {
                Field: '/components/admin/BrandColorPicker#BrandColorPicker',
              },
            },
          },
          {
            name: 'theme',
            type: 'select',
            label: 'Contraste de Textos',
            defaultValue: defaultTheme,
            required: true,
            options: [
              {
                label: 'Light (Textos oscuros #4d4e4f)',
                value: 'light',
              },
              {
                label: 'Dark (Textos claros #ffffff)',
                value: 'dark',
              },
            ],
            admin: {
              width: '25%',
            },
          },
          {
            name: 'overlayOpacity',
            type: 'select',
            label: 'Filtro sobre Foto',
            defaultValue: defaultOverlayOpacity,
            options: [
              { label: 'Ninguna (0%)', value: 'ninguna' },
              { label: 'Sutil (25%)', value: 'sutil' },
              { label: 'Media (50%)', value: 'media' },
              { label: 'Intensa (75%)', value: 'intensa' },
            ],
            admin: {
              width: '25%',
            },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'accentColor',
            type: 'select',
            label: 'Color de Acento & Iconos',
            defaultValue: defaultAccentColor,
            options: [
              { label: 'Azul Brillante', value: 'azul' },
              { label: 'Verde Corporativo', value: 'verde' },
              { label: 'Gris Antracita', value: 'grisOscuro' },
              { label: 'Blanco Puro', value: 'blanco' },
            ],
            admin: {
              width: '33%',
              components: {
                Field: '/components/admin/BrandColorPicker#BrandColorPicker',
              },
            },
          },
          {
            name: 'buttonColor',
            type: 'select',
            label: 'Color del Botón Principal (CTA)',
            defaultValue: defaultButtonColor,
            options: [
              { label: 'Azul Brillante', value: 'azul' },
              { label: 'Verde Corporativo', value: 'verde' },
              { label: 'Blanco Puro', value: 'blanco' },
              { label: 'Gris Antracita', value: 'oscuro' },
            ],
            admin: {
              width: '33%',
              components: {
                Field: '/components/admin/BrandColorPicker#BrandColorPicker',
              },
            },
          },
          {
            name: 'badgeColor',
            type: 'select',
            label: 'Color de la Etiqueta (Badge)',
            defaultValue: defaultBadgeColor,
            options: [
              { label: 'Verde Corporativo', value: 'verde' },
              { label: 'Azul Brillante', value: 'azul' },
              { label: 'Gris Antracita', value: 'gris' },
              { label: 'Blanco Puro', value: 'blanco' },
            ],
            admin: {
              width: '34%',
              components: {
                Field: '/components/admin/BrandColorPicker#BrandColorPicker',
              },
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
