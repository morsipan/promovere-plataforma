import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  console.log('🌱 Iniciando seed de datos para Promovêre...')

  try {
    const payload = await getPayload({ config })

    const defaultUsers = [
      {
        email: 'admin@promovere.com.ar',
        password: 'PromovereAdmin2026!',
        name: 'Administrador Promovêre',
        role: 'admin' as const,
        company: 'Promovêre S.R.L.',
        phone: '+54 9 11 4587 6932',
        country: 'Argentina',
        verified: true,
      },
      {
        email: 'hotel@promovere.com.ar',
        password: 'PromovereHotel2026!',
        name: 'Cadena Hotelera Demo',
        role: 'hotel' as const,
        company: 'Luxury Resorts & Hotels',
        phone: '+52 998 123 4567',
        country: 'México',
        verified: true,
      },
      {
        email: 'agencia@promovere.com.ar',
        password: 'PromovereAgencia2026!',
        name: 'Agencia de Viajes Demo',
        role: 'agencia' as const,
        company: 'Operador Mayorista LATAM',
        phone: '+54 9 11 5555 4321',
        country: 'Argentina',
        verified: true,
      },
    ]

    for (const userData of defaultUsers) {
      const existing = await payload.find({
        collection: 'users',
        where: {
          email: { equals: userData.email },
        },
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'users',
          data: userData,
        })
        console.log(`✅ Usuario creado: ${userData.email} (${userData.role})`)
      } else {
        console.log(`ℹ️ El usuario ${userData.email} ya existe.`)
      }
    }

    console.log('\n✨ Seed completado con éxito.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error al ejecutar el seed:', error)
    process.exit(1)
  }
}

seed()
