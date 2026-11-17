import type { Access, CollectionConfig } from 'payload'

export type UserRole = 'admin' | 'editor' | 'mayorista' | 'minorista'

// Solo admin y editor pueden ingresar a /admin (retorna boolean estricto)
export const canAccessAdmin = ({ req: { user } }: { req: { user?: any } }): boolean => {
  return Boolean(user?.role && ['admin', 'editor'].includes(user.role))
}

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (['admin', 'editor'].includes(user.role)) return true
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
    group: 'Configuración & Accesos',
  },
  access: {
    // Restricción de acceso estricta: Solo admin y editor pueden ingresar a /admin
    admin: canAccessAdmin,
    // Admin y editor ven todos; usuarios de la comunidad solo ven su propio perfil
    read: isAdminOrSelf,
    // Solo admin puede crear usuarios en el CMS; o registro libre en el portal
    create: ({ req: { user } }) => {
      if (user) return ['admin', 'editor'].includes(user.role)
      return true
    },
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre y Apellido',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol de Usuario',
      required: true,
      defaultValue: 'minorista',
      options: [
        {
          label: 'Administrador (Equipo Promovêre)',
          value: 'admin',
        },
        {
          label: 'Editor de Contenidos (Equipo Promovêre)',
          value: 'editor',
        },
        {
          label: 'Operador Mayorista (Comunidad)',
          value: 'mayorista',
        },
        {
          label: 'Agencia Minorista (Comunidad)',
          value: 'minorista',
        },
      ],
      access: {
        // Solo un administrador puede cambiar roles o elevar privilegios
        update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
      },
    },
    {
      name: 'company',
      type: 'text',
      label: 'Razón Social / Agencia u Operador',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono / WhatsApp Comercial',
    },
    {
      name: 'country',
      type: 'text',
      label: 'País de Operación',
    },
    {
      name: 'verified',
      type: 'checkbox',
      label: 'Cuenta Verificada de Comunidad',
      defaultValue: false,
      access: {
        update: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
      },
    },
  ],
}
