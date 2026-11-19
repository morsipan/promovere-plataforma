'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Building2 } from 'lucide-react';

const REMEMBERED_EMAIL_KEY = 'promovere_remembered_email';

export default function ComunidadLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // localStorage no disponible
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok || !data.user) {
        throw new Error(data.errors?.[0]?.message || 'Credenciales inválidas o cuenta no registrada.');
      }

      try {
        if (rememberMe) {
          window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
        } else {
          window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
      } catch {
        // Ignorar errores de storage
      }

      // Redirigir al dashboard protegido de la comunidad
      router.push('/comunidad/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] via-[#f0f7fc] to-[#e1f0f9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Logo Institucional */}
        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] flex items-center justify-center shadow-lg shadow-[#1b87c7]/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-black text-[#4d4e4f] tracking-tight block">
              Promovêre
            </span>
            <span className="text-xs font-semibold text-[#1b87c7] uppercase tracking-wider block">
              Comunidad Trade
            </span>
          </div>
        </Link>

        {/* Badge & Título */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b87c7]/10 border border-[#1b87c7]/20 text-[#1b87c7] text-xs font-bold mb-3 uppercase tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#3cac59]" />
          Portal Privado de Profesionales
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
          Acceso a la Comunidad
        </h2>
        <p className="mt-2 text-sm text-[#4d4e4f]/70 max-w-sm mx-auto">
          Recursos comerciales, manuales y herramientas para Operadores Mayoristas y Agencias de Viajes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@operador.com"
                  className="block w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4d4e4f] uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label
                htmlFor="remember-me"
                className="inline-flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRememberMe(checked);
                    if (!checked) {
                      try {
                        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
                      } catch {
                        // Ignorar errores de storage
                      }
                    }
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-[#1b87c7] focus:ring-2 focus:ring-[#1b87c7]/30 accent-[#1b87c7] cursor-pointer transition-colors"
                />
                <span className="text-xs font-medium text-[#4d4e4f]/85 group-hover:text-[#1b87c7] transition-colors">
                  Recordar mi cuenta
                </span>
              </label>
              <span className="text-[11px] text-slate-400">
                Sesión extendida (30 días)
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white bg-gradient-to-r from-[#1b87c7] to-[#1571a8] hover:from-[#1571a8] hover:to-[#0f5b89] font-bold text-sm shadow-lg shadow-[#1b87c7]/25 hover:shadow-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Validando credenciales...</span>
              ) : (
                <>
                  <span>Ingresar al Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Accesos de prueba rápidos */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-3 text-center uppercase tracking-wider">
              Credenciales Demo para Pruebas:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('mayorista@promovere.com.ar', 'PromovereMayorista2026!')}
                className="p-2.5 rounded-lg border border-slate-200 text-left hover:border-[#1b87c7] hover:bg-[#f0f7fc] transition-colors"
              >
                <span className="block text-xs font-bold text-[#1b87c7]">Mayorista</span>
                <span className="block text-[10px] text-slate-500 truncate">mayorista@promovere.com.ar</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('minorista@promovere.com.ar', 'PromovereMinorista2026!')}
                className="p-2.5 rounded-lg border border-slate-200 text-left hover:border-[#3cac59] hover:bg-[#f2fbf4] transition-colors"
              >
                <span className="block text-xs font-bold text-[#3cac59]">Minorista</span>
                <span className="block text-[10px] text-slate-500 truncate">minorista@promovere.com.ar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Nota de Seguridad de Arquitectura */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3cac59]" />
          <span>Acceso separado: El equipo interno gestiona contenidos en </span>
          <Link href="/admin" className="text-[#1b87c7] hover:underline font-bold">
            /admin
          </Link>
        </div>
      </div>
    </div>
  );
}
