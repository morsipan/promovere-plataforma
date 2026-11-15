import type { Access, CollectionConfig } from 'payload'

export type UserRole = 'admin' | 'hotel' | 'agencia'

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return {
    id: {
      equals: user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'company', 'createdAt'],
  },
  access: {
    // Solo usuarios administradores pueden ingresar al panel /admin de Payload
    admin: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    // Administradores pueden ver todos los usuarios; miembros de la comunidad ven su propio perfil
    read: isAdminOrSelf,
    // Administradores crean usuarios; usuarios no autenticados pueden registrarse para la Comunidad
    create: ({ req: { user } }) => {
      if (user) return user.role === 'admin'
      return true
    },
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre Completo',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol de Usuario',
      required: true,
      defaultValue: 'agencia',
      options: [
        {
          label: 'Administrador (Admin)',
          value: 'admin',
        },
        {
          label: 'Comunidad Hotel (Hotel)',
          value: 'hotel',
        },
        {
          label: 'Comunidad Agencia (Agencia)',
          value: 'agencia',
        },
      ],
      access: {
        // Solo un administrador puede elevar privilegios o cambiar roles
        update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
      },
    },
    {
      name: 'company',
      type: 'text',
      label: 'Empresa / Cadena Hotelera / Agencia de Viajes',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono / WhatsApp de Contacto',
    },
    {
      name: 'country',
      type: 'text',
      label: 'País de Residencia / Operación',
    },
    {
      name: 'verified',
      type: 'checkbox',
      label: 'Usuario Verificado para la Comunidad',
      defaultValue: false,
      access: {
        update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
      },
    },
  ],
}
