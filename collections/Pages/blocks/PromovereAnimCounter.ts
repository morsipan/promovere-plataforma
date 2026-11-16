import type { Block } from 'payload'

export const PromovereAnimCounterBlock: Block = {
  slug: 'promovereAnimCounter',
  labels: {
    singular: 'Promovere Anim Counter',
    plural: 'Promovere Anim Counters',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta Superior de la Sección',
      defaultValue: 'Métricas & Resultados',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección (Opcional)',
      defaultValue: 'Impacto Comercial en Cifras Reales',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Bajada Descriptiva (Opcional)',
      defaultValue:
        'Indicadores de rendimiento, volumen trade y alcance operativo en los mercados turísticos de América Latina.',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Contadores / Factos Animados (Hasta 5 en línea en Desktop)',
      minRows: 1,
      maxRows: 5,
      fields: [
        // 1. Textos y Valores
        {
          type: 'row',
          fields: [
            {
              name: 'topText',
              type: 'text',
              label: 'Texto Superior (ej: Logramos, Tenemos, Evitamos...)',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'prefix',
              type: 'text',
              label: 'Prefijo / Símbolo Previo (ej: +, $, Desde, ~)',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'countValue',
              type: 'number',
              label: 'Valor de Conteo (Admite decimales, ej: 500, 99.8, 15)',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'suffix',
              type: 'text',
              label: 'Sufijo / Símbolo Posterior (ej: %, M, K, x, +)',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'bottomText',
          type: 'text',
          label: 'Texto Inferior (ej: Clientes Satisfechos, Mejoras, Países...)',
          required: true,
        },

        // 2. Colores Personalizados por Elemento
        {
          type: 'collapsible',
          label: '🎨 Personalización de Colores',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'topTextColor',
                  type: 'select',
                  label: 'Color del Texto Superior',
                  defaultValue: 'azul',
                  options: [
                    { label: 'Azul Institucional (#1b87c7)', value: 'azul' },
                    { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                    { label: 'Gris Antracita (#4d4e4f)', value: 'antracita' },
                    { label: 'Gris Medio (#7b7d80)', value: 'gris' },
                    { label: 'Blanco (#ffffff)', value: 'blanco' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'counterColor',
                  type: 'select',
                  label: 'Color del Número y Símbolos',
                  defaultValue: 'antracita',
                  options: [
                    { label: 'Gris Antracita (#4d4e4f)', value: 'antracita' },
                    { label: 'Azul Institucional (#1b87c7)', value: 'azul' },
                    { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                    { label: 'Degradé Azul-Verde', value: 'degrade' },
                    { label: 'Blanco (#ffffff)', value: 'blanco' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'bottomTextColor',
                  type: 'select',
                  label: 'Color del Texto Inferior',
                  defaultValue: 'gris',
                  options: [
                    { label: 'Gris Suave (#7b7d80)', value: 'gris' },
                    { label: 'Gris Antracita (#4d4e4f)', value: 'antracita' },
                    { label: 'Azul Institucional (#1b87c7)', value: 'azul' },
                    { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                    { label: 'Blanco (#ffffff)', value: 'blanco' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'cardBg',
                  type: 'select',
                  label: 'Fondo de la Tarjeta',
                  defaultValue: 'blanco',
                  options: [
                    { label: 'Blanco Puro con Borde Sutil', value: 'blanco' },
                    { label: 'Blanco Humo (#f9f9f9)', value: 'blancoHumo' },
                    { label: 'Antracita Oscuro (#4d4e4f)', value: 'oscuro' },
                    { label: 'Translúcido Glassmorphism', value: 'glass' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'cardBorderAccent',
                  type: 'select',
                  label: 'Acento de Borde al Pasar el Mouse (Hover)',
                  defaultValue: 'azul',
                  options: [
                    { label: 'Azul Brillante (#1b87c7)', value: 'azul' },
                    { label: 'Verde Corporativo (#3cac59)', value: 'verde' },
                    { label: 'Sutil Gris', value: 'gris' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },

        // 3. Tipografía y Estilo de Fuente
        {
          type: 'collapsible',
          label: '🔤 Fuentes y Tipografía',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'topTextFont',
                  type: 'select',
                  label: 'Fuente Texto Superior',
                  defaultValue: 'sans-bold',
                  options: [
                    { label: 'Sans-Serif Bold (Moderna)', value: 'sans-bold' },
                    { label: 'Sans-Serif Medium', value: 'sans-medium' },
                    { label: 'Monospace Técnica', value: 'mono' },
                    { label: 'Serif Elegante', value: 'serif' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'counterFont',
                  type: 'select',
                  label: 'Fuente Número / Contador',
                  defaultValue: 'sans-black',
                  options: [
                    { label: 'Sans-Serif Black (Máximo Impacto)', value: 'sans-black' },
                    { label: 'Sans-Serif Bold', value: 'sans-bold' },
                    { label: 'Monospace Tech Numbers', value: 'mono' },
                    { label: 'Serif Clásica Distinguida', value: 'serif' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'bottomTextFont',
                  type: 'select',
                  label: 'Fuente Texto Inferior',
                  defaultValue: 'sans-normal',
                  options: [
                    { label: 'Sans-Serif Normal', value: 'sans-normal' },
                    { label: 'Sans-Serif Medium', value: 'sans-medium' },
                    { label: 'Sans-Serif Bold', value: 'sans-bold' },
                    { label: 'Monospace Técnica', value: 'mono' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
          ],
        },

        // 4. Animación de Entrada y Velocidad
        {
          type: 'collapsible',
          label: '⚡ Animación de Entrada y Velocidad de Conteo',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'entryAnimation',
                  type: 'select',
                  label: 'Tipo de Animación de Entrada',
                  defaultValue: 'fade-up',
                  options: [
                    { label: 'Slide Up + Fade In (Elegante)', value: 'fade-up' },
                    { label: 'Scale Pop (Impacto)', value: 'scale-up' },
                    { label: 'Fade In Suave', value: 'fade-in' },
                    { label: 'Bounce Sutil', value: 'bounce' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'counterSpeed',
                  type: 'select',
                  label: 'Velocidad de Conteo del Número',
                  defaultValue: '2000',
                  options: [
                    { label: 'Rápido (1 segundo)', value: '1000' },
                    { label: 'Normal / Dinámico (2 segundos)', value: '2000' },
                    { label: 'Suave y Pausado (3 segundos)', value: '3000' },
                    { label: 'Ultrarrápido (600 ms)', value: '600' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
