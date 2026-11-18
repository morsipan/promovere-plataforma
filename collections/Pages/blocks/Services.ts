import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

export const ServicesBlock: Block = {
  slug: 'services',
  labels: {
    singular: 'Servicios 360° (Soluciones Comerciales)',
    plural: 'Servicios 360°',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blancoHumo',
      defaultTheme: 'light',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Etiqueta',
      defaultValue: 'Nuestros Servicios',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      defaultValue: 'Solución integral para tu marca turística',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      defaultValue:
        'Ecosistema estratégico 360° para comercializar, posicionar y expandir marcas turísticas internacionales en el trade y público final de América Latina.',
    },
    {
      name: 'servicesList',
      type: 'array',
      label: 'Listado de Servicios',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Título del Servicio',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtítulo / Tagline',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción detallada',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Ícono Representativo',
              defaultValue: 'Briefcase',
              options: [
                { label: 'Ninguno (Sin ícono)', value: 'none' },
                { label: 'Maletín / Negocios (Briefcase)', value: 'Briefcase' },
                { label: 'Megáfono / Marketing (Megaphone)', value: 'Megaphone' },
                { label: 'Usuarios / Comunidad (Users)', value: 'Users' },
                { label: 'Capacitación / Academia (GraduationCap)', value: 'GraduationCap' },
                { label: 'Brújula / Producto Turístico (Compass)', value: 'Compass' },
                { label: 'Calendario / Eventos (Calendar)', value: 'Calendar' },
                { label: 'Crecimiento / Ventas (TrendingUp)', value: 'TrendingUp' },
                { label: 'Globo / Red Internacional (Globe)', value: 'Globe' },
                { label: 'Estrella / Calidad (Star)', value: 'Star' },
                { label: 'Edificio / Hotelería (Building2)', value: 'Building2' },
                { label: 'Avión / Viajes (Plane)', value: 'Plane' },
                { label: 'Apretón de Manos / Alianzas (Handshake)', value: 'Handshake' },
                { label: 'Escudo / Confianza (ShieldCheck)', value: 'ShieldCheck' },
                { label: 'Premio / Liderazgo (Award)', value: 'Award' },
                { label: 'Destello / Innovación (Sparkles)', value: 'Sparkles' },
                { label: 'Mapa / Destinos (MapPin)', value: 'MapPin' },
                { label: 'Corazón / Pasión (Heart)', value: 'Heart' },
                { label: 'Teléfono / Soporte (Phone)', value: 'Phone' },
                { label: 'Etiqueta / Tarifas (Tag)', value: 'Tag' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'customIcon',
              type: 'upload',
              relationTo: 'media',
              label: 'Ícono Personalizado (SVG / Imagen Opcional)',
              admin: {
                width: '50%',
                description: 'Si subes un archivo SVG o PNG aquí, se usará en lugar del ícono predefinido.',
              },
            },
          ],
        },
        {
          name: 'highlights',
          type: 'array',
          label: 'Puntos Destacados / Entregables',
          fields: [
            {
              name: 'item',
              type: 'text',
              label: 'Punto destacado',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
