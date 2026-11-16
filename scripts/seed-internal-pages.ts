import { getPayload } from 'payload'
import config from '../payload.config'

async function seedPages() {
  console.log('🌱 Sembrando páginas internas en Supabase...')

  try {
    const payload = await getPayload({ config })

    const pagesToSeed = [
      {
        title: 'Nuestros Servicios',
        slug: 'servicios',
        layout: [
          {
            blockType: 'hero',
            badge: 'Solución Integral 360°',
            title: 'Servicios de Promoción y Representación',
            subtitle:
              'Ecosistema estratégico para comercializar, posicionar y expandir marcas turísticas en el mercado latinoamericano.',
            cta1Label: 'Contactar un Especialista',
            cta1Href: '#contacto',
            cta2Label: 'Portal Comunidad',
            cta2Href: '/comunidad/login',
          },
          {
            blockType: 'services',
            badge: 'Pilares Comerciales',
            title: 'Vê REPS® y Vê MKT®',
            subtitle: 'Metodología probada en el canal B2B.',
          },
          {
            blockType: 'stats',
            badge: 'Resultados Comprobados',
            title: 'Impacto medible en el trade',
          },
          {
            blockType: 'ctaBanner',
            badge: 'Comencemos Hoy',
            title: '¿Quieres que representemos tu propiedad o destino?',
          },
        ],
      },
      {
        title: 'Representaciones Turísticas',
        slug: 'representaciones',
        layout: [
          {
            blockType: 'hero',
            badge: 'Portafolio de Excelencia',
            title: 'Hoteles, Destinos y Marcas Representadas',
            subtitle:
              'Propiedades de lujo, cadenas all-inclusive y destinos de clase mundial con representación comercial activa en LATAM.',
            cta1Label: 'Ver Fichas Técnicas',
            cta1Href: '/comunidad/login',
          },
          {
            blockType: 'representations',
            badge: 'Nuestras Marcas',
            title: 'Excelencia en Hospitalidad',
          },
          {
            blockType: 'gallery',
            badge: 'Galería de Destinos',
            title: 'Experiencias Únicas para tus Pasajeros',
          },
          {
            blockType: 'ctaBanner',
            badge: 'Acceso Comercial',
            title: 'Ingresa al Portal de la Comunidad',
          },
        ],
      },
      {
        title: 'Sobre Promovêre',
        slug: 'nosotros',
        layout: [
          {
            blockType: 'hero',
            badge: 'Quiénes Somos',
            title: 'Pasión por el Turismo y el Comercio B2B',
            subtitle:
              'Especialistas en promoción turística con base en Buenos Aires y alcance activo en toda la región latinoamericana.',
          },
          {
            blockType: 'richText',
            badge: 'Manifiesto',
            title: 'Nuestra visión y compromiso con la industria turística',
            content: {
              root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'paragraph',
                    format: '',
                    indent: 0,
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        format: 0,
                        text: 'En Promovêre creemos que la promoción turística de excelencia se construye a través de relaciones genuinas, conocimiento profundo del producto y una presencia comercial constante junto a los tomadores de decisiones de la industria en Latinoamérica.',
                        version: 1,
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            blockType: 'timeline',
            badge: 'Evolución',
            title: 'Nuestra trayectoria y crecimiento regional',
          },
          {
            blockType: 'stats',
            badge: 'Cifras Clave',
            title: 'Presencia consolidada en América Latina',
          },
          {
            blockType: 'contact',
            badge: 'Contacto Institucional',
            title: 'Oficinas Centrales en Buenos Aires',
          },
        ],
      },
      {
        title: 'Preguntas Frecuentes',
        slug: 'faq',
        layout: [
          {
            blockType: 'hero',
            badge: 'Centro de Respuestas',
            title: 'Preguntas Frecuentes sobre Promovêre',
            subtitle:
              'Todo lo que necesitas saber sobre nuestras representaciones, operativa comercial y la Comunidad Trade.',
          },
          {
            blockType: 'faq',
            badge: 'FAQ Trade',
            title: 'Preguntas y Respuestas Habituales',
          },
          {
            blockType: 'ctaBanner',
            badge: 'Soporte Comercial',
            title: '¿Tienes alguna otra consulta?',
          },
        ],
      },
    ]

    for (const page of pagesToSeed) {
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'pages',
          data: page as any,
        })
        console.log(`✅ Página creada: "${page.title}" (/${page.slug})`)
      } else {
        console.log(`ℹ️ La página "${page.title}" ya existía (/${page.slug})`)
      }
    }

    console.log('✨ Siembra de páginas internas completada con éxito.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error al sembrar páginas internas:', error)
    process.exit(1)
  }
}

seedPages()
