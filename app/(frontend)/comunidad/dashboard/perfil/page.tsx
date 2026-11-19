import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileSettingsClient from '@/components/comunidad/ProfileSettingsClient';

export const dynamic = 'force-dynamic';

export default async function ComunidadPerfilPage() {
  const payload = await getPayload({ config });
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });

  if (!user) {
    redirect('/comunidad/login');
  }

  // Obtener perfil completo con avatar poblado
  let fullUser: any = user;
  try {
    fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 1,
      overrideAccess: true,
    });
  } catch {}

  return (
    <ProfileSettingsClient
      initialUser={{
        id: fullUser.id,
        name: fullUser.name || '',
        email: fullUser.email || '',
        role: String(fullUser.role || 'minorista'),
        company: fullUser.company || '',
        phone: fullUser.phone || '',
        country: fullUser.country || '',
        avatar: fullUser.avatar ?? null,
        dashboardOrder: Array.isArray(fullUser.dashboardOrder) ? fullUser.dashboardOrder : null,
      }}
    />
  );
}
