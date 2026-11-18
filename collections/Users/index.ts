import type { Access, CollectionConfig, Where } from 'payload'

export type UserRole = 'admin' | 'editor' | 'mayorista' | 'minorista'

/**
 * Control de Acceso Estricto para el Panel de Administración (/admin):
 * Únicamente los usuarios con roles 'admin' y 'editor' están autorizados
 * a iniciar sesión y visualizar el CMS interno de Promovêre.
 */
export const canAccessAdmin = ({ req: { user } }: { req: { user?: any } }): boolean => {
  return Boolean(user?.role && ['admin', 'editor'].includes(user.role))
}

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (['admin', 'editor'].includes(user.role)) return true
  const query: Where = {
    id: {
      equals: user.id,
    },
  }
  return query
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  auth: {
    // Autenticación nativa segura con token JWT y protección contra fuerza bruta
    tokenExpiration: 7200, // 2 horas
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutos de bloqueo preventivo
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'avatar', 'company', 'createdAt'],
    group: 'Configuración & Accesos',
    description: 'Gestión centralizada de credenciales, roles y permisos de acceso para el equipo interno y la Comunidad Promovêre.',
  },
  access: {
    // Restricción de acceso estricta: Solo admin y editor pueden iniciar sesión en /admin
    admin: canAccessAdmin,
    // Lectura de perfiles: admin y editor ven todos; mayoristas/minoristas solo su propio perfil
    read: isAdminOrSelf,
    // Creación: admin y editor pueden dar de alta cualquier rol; registros de la comunidad permitidos
    create: ({ req: { user } }) => {
      if (user) return ['admin', 'editor'].includes(user.role)
      return true
    },
    // Actualización de perfil
    update: isAdminOrSelf,
    // Eliminación restringida a Administrador
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
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto de Perfil / Avatar',
      admin: {
        description: 'Foto de perfil o avatar del usuario para el portal privado de la Comunidad.',
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol de Usuario',
      required: true,
      defaultValue: 'minorista',
      options: [
        {
          label: 'Administrador (admin)',
          value: 'admin',
        },
        {
          label: 'Editor de Contenidos (editor)',
          value: 'editor',
        },
        {
          label: 'Operador Mayorista (mayorista)',
          value: 'mayorista',
        },
        {
          label: 'Agencia Minorista (minorista)',
          value: 'minorista',
        },
      ],
      access: {
        // Blindaje de Seguridad: Solo un Administrador puede modificar roles o elevar privilegios
        update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
      },
      admin: {
        description: 'Define los permisos del usuario. Roles "admin" y "editor" tienen acceso a /admin. Roles "mayorista" y "minorista" acceden exclusivamente al portal privado de la Comunidad.',
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
      admin: {
        description: 'Marca si la cuenta fue validada formalmente por el equipo comercial de Promovêre.',
      },
    },
  ],
}
