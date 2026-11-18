import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export const dynamic = 'force-dynamic';

export default async function ComunidadDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getPayload({ config });
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });

  if (!user) {
    redirect('/comunidad/login');
  }

  const cleanUser = {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    role: user.role,
    avatar: user.avatar || null,
    company: user.company || null,
    phone: user.phone || null,
    country: user.country || null,
    verified: Boolean(user.verified),
  };

  return <DashboardLayout user={cleanUser}>{children}</DashboardLayout>;
}
