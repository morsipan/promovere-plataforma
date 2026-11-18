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

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
