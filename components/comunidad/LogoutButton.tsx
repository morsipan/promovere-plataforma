'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/users/logout', { method: 'POST' });
    } catch (e) {
      console.error('Error logging out', e);
    } finally {
      router.push('/comunidad/login');
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      suppressHydrationWarning
      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors active:scale-95 disabled:opacity-50"
      title="Cerrar sesión segura"
    >
      <LogOut className="w-4 h-4" />
      <span suppressHydrationWarning>{loading ? 'Saliendo...' : 'Cerrar Sesión'}</span>
    </button>
  );
}
