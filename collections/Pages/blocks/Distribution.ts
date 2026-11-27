import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const DistributionBlock: Block = {
  slug: 'distribution',
  labels: {
    singular: 'Red de Distribución (Alcance LATAM)',
    plural: 'Red de Distribución',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'grisOscuro',
      defaultTheme: 'dark',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta',
      defaultValue: 'Red de Distribución',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      defaultValue: 'Alcance Comercial Estratégico en América Latina',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      defaultValue:
        'Diez años impulsando destinos y hoteles en los mercados emisores clave de América Latina junto a operadores mayoristas y agencias de viajes.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cta1Label',
          type: 'text',
          label: 'Texto Botón Primario (Acción)',
          defaultValue: 'Sumar mi marca a la Red',
          admin: { width: '50%' },
        },
        {
          name: 'cta1Href',
          type: 'text',
          label: 'Enlace Botón Primario',
          defaultValue: '#contacto',
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
          label: 'Texto Botón Secundario (Acción)',
          defaultValue: 'Contactar a nuestro equipo',
          admin: { width: '50%' },
        },
        {
          name: 'cta2Href',
          type: 'text',
          label: 'Enlace Botón Secundario',
          defaultValue: '#contacto',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Métricas / Estadísticas Clave',
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Valor (ej: 10 años, 100%, 360°, LATAM)',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Etiqueta (ej: Agencias Conectadas)',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Descripción complementaria',
        },
      ],
    },
    {
      name: 'channels',
      type: 'array',
      label: 'Canales de Distribución y Alcance',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Nombre del Canal / Segmento',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción operativa',
          required: true,
        },
        {
          name: 'coverage',
          type: 'text',
          label: 'Cobertura geográfica / alcance',
        },
      ],
    },
    // Carrusel Infinito Administrable de Operadores y Marcas
    {
      type: 'row',
      fields: [
        {
          name: 'carouselEnabled',
          type: 'checkbox',
          label: 'Mostrar Carrusel Infinito de Marcas / Operadores',
          defaultValue: true,
          admin: { width: '34%' },
        },
        {
          name: 'carouselSpeed',
          type: 'select',
          enumName: 'enum_dist_spd',
          label: 'Velocidad del Carrusel',
          defaultValue: 'normal',
          options: [
            { label: 'Lenta', value: 'slow' },
            { label: 'Normal (Default)', value: 'normal' },
            { label: 'Rápida', value: 'fast' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'pauseOnHover',
          type: 'checkbox',
          label: 'Pausar al pasar el cursor',
          defaultValue: true,
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'carouselTitle',
      type: 'text',
      label: 'Título del Carrusel de Marcas (Opcional)',
      defaultValue: 'Operadores y Marcas Conectados en LATAM',
    },
    {
      name: 'brandCarousel',
      type: 'array',
      label: 'Carrusel de Marcas / Operadores (Red de Distribución)',
      labels: {
        singular: 'Marca / Operador',
        plural: 'Marcas y Operadores',
      },
      admin: {
        description:
          'Agregá, editá, reordená o eliminá los logos de operadores y marcas que rotan en el carrusel infinito de Red de Distribución.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Nombre de la Marca / Operador (Alt)',
              required: true,
              admin: { width: '45%' },
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL Externa (Opcional)',
              admin: {
                width: '40%',
                description: 'Si se completa, abre en pestaña nueva.',
              },
            },
            {
              name: 'active',
              type: 'checkbox',
              label: 'Activo',
              defaultValue: true,
              admin: { width: '15%' },
            },
          ],
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo (Media)',
          required: true,
        },
      ],
    },
  ],
}
