import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import type { Media } from '@/payload-types';

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

  // Resolver avatar asegurando objeto serializable con URL de acceso
  let avatarObj: { id?: number | string; url: string; filename?: string; alt?: string } | null = null;

  if (user.avatar) {
    if (typeof user.avatar === 'number') {
      try {
        const mediaDoc = (await payload.findByID({
          collection: 'media',
          id: user.avatar,
          depth: 0,
        })) as Media;

        if (mediaDoc) {
          avatarObj = {
            id: mediaDoc.id,
            url: mediaDoc.url || (mediaDoc.filename ? `/api/media/file/${mediaDoc.filename}` : ''),
            filename: mediaDoc.filename || undefined,
            alt: mediaDoc.alt || user.name || 'Avatar de usuario',
          };
        }
      } catch (err) {
        console.error('Error al resolver avatar media por ID:', err);
      }
    } else if (typeof user.avatar === 'object' && user.avatar !== null) {
      const m = user.avatar as any;
      avatarObj = {
        id: m.id,
        url: m.url || (m.filename ? `/api/media/file/${m.filename}` : ''),
        filename: m.filename || undefined,
        alt: m.alt || user.name || 'Avatar de usuario',
      };
    } else if (typeof (user.avatar as any) === 'string' && (user.avatar as any).trim().length > 0) {
      avatarObj = {
        url: (user.avatar as any).trim(),
        alt: user.name || 'Avatar de usuario',
      };
    }
  }

  const cleanUser = {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    role: user.role,
    avatar: avatarObj,
    company: user.company || null,
    phone: user.phone || null,
    country: user.country || null,
    verified: Boolean(user.verified),
  };

  return <DashboardLayout user={cleanUser}>{children}</DashboardLayout>;
}
