'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Globe2,
  BookOpen,
  Award,
  ArrowLeft,
} from 'lucide-react';

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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0e5a8a] via-[#1b87c7] to-[#3cac59] flex items-center">
      {/* Iluminación ambiental y formas sutiles de marca */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 w-[36rem] h-[36rem] rounded-full bg-[#3cac59]/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-[#1b87c7]/20 blur-3xl"
      />

      {/* Marca de agua sutil del logo oficial en blanco */}
      <img
        src="/assets/SVG/logo-footer.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none hidden lg:block absolute bottom-8 right-10 w-56 opacity-15"
      />

      {/* Contenedor principal centrado verticalmente: Caja blanca a la izquierda + Branding a la derecha */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* =================================================================
              LATERAL IZQUIERDO: Caja blanca centrada verticalmente para acceder
             ================================================================= */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white rounded-3xl shadow-2xl shadow-black/25 p-7 sm:p-9 border border-white/80">
              {/* Encabezado con Logo Oficial de Promovêre */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-5">
                  <Link href="/" className="inline-block group" aria-label="Volver al inicio de Promovêre">
                    <img
                      src="/assets/SVG/logo-principal.svg"
                      alt="Promovêre"
                      className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-[#1b87c7] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Inicio</span>
                  </Link>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#1b87c7]/10 to-[#3cac59]/10 border border-[#1b87c7]/20 text-[#1b87c7] text-[11px] font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3 h-3 text-[#3cac59]" />
                  <span>Comunidad Trade B2B</span>
                </div>

                <h1 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight leading-tight">
                  Acceso a la Comunidad
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-[#4d4e4f]/70 leading-relaxed">
                  Ingresá con tus credenciales de Operador Mayorista o Agencia Minorista.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="comunidad-email"
                    className="block text-[11px] font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5"
                  >
                    Correo Electrónico
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="comunidad-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@operador.com"
                      className="block w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-[#f9f9f9]/60 focus:bg-white focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-[#4d4e4f]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="comunidad-password"
                    className="block text-[11px] font-bold text-[#4d4e4f] uppercase tracking-wider mb-1.5"
                  >
                    Contraseña
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="comunidad-password"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="block w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-[#f9f9f9]/60 focus:bg-white focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-[#4d4e4f]"
                    />
                  </div>
                </div>

                {/* Recordar cuenta */}
                <div className="flex items-center justify-between pt-0.5">
                  <label
                    htmlFor="remember-me"
                    className="inline-flex items-center gap-2 cursor-pointer select-none group"
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
                      className="w-4 h-4 rounded border-slate-300 text-[#1b87c7] focus:ring-2 focus:ring-[#1b87c7]/30 accent-[#1b87c7] cursor-pointer"
                    />
                    <span className="text-xs font-medium text-[#4d4e4f]/85 group-hover:text-[#1b87c7] transition-colors">
                      Recordar mi cuenta
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-400">Sesión de 30 días</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-white bg-gradient-to-r from-[#1b87c7] to-[#3cac59] hover:from-[#1674ad] hover:to-[#32964c] font-bold text-sm shadow-lg shadow-[#1b87c7]/25 hover:shadow-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-2"
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

              {/* Accesos Demo Rápidos */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 mb-2.5 text-center uppercase tracking-wider">
                  Credenciales Demo
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemo('mayorista@promovere.com.ar', 'PromovereMayorista2026!')}
                    className="p-2.5 rounded-xl border border-slate-200/90 text-left hover:border-[#1b87c7] hover:bg-[#f0f7fc] transition-colors"
                  >
                    <span className="block text-xs font-bold text-[#1b87c7]">Mayorista</span>
                    <span className="block text-[10px] text-slate-500 truncate">
                      mayorista@promovere.com.ar
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('minorista@promovere.com.ar', 'PromovereMinorista2026!')}
                    className="p-2.5 rounded-xl border border-slate-200/90 text-left hover:border-[#3cac59] hover:bg-[#f2fbf4] transition-colors"
                  >
                    <span className="block text-xs font-bold text-[#3cac59]">Minorista</span>
                    <span className="block text-[10px] text-slate-500 truncate">
                      minorista@promovere.com.ar
                    </span>
                  </button>
                </div>
              </div>

              {/* Acceso interno */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3cac59] shrink-0" />
                <span>¿Equipo interno?</span>
                <Link href="/admin" className="text-[#1b87c7] hover:underline font-bold">
                  Ingresar al Admin
                </Link>
              </div>
            </div>
          </div>

          {/* =================================================================
              LATERAL DERECHO: Presencia de marca sobre el degradé corporativo
             ================================================================= */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center text-white pl-4 xl:pl-10">
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold uppercase tracking-wider mb-6">
              <Globe2 className="w-4 h-4 text-white" />
              <span>Red Comercial Turística LATAM</span>
            </div>

            <h2 className="font-baloo text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-sm mb-5 max-w-2xl">
              Impulsamos el negocio de agencias y operadores en toda la región.
            </h2>

            <p className="font-sans text-base xl:text-lg text-white/90 leading-relaxed max-w-xl mb-10">
              Accedé en un solo lugar a fichas técnicas actualizadas, kits comerciales, capacitaciones y
              novedades exclusivas de las marcas y destinos que representamos.
            </p>

            {/* Tarjetas glassmórficas de valor */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 max-w-2xl">
              <div className="rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 p-4">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-baloo text-base font-bold text-white mb-1">
                  Material Comercial
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Brochures, presentaciones y guías listas para compartir con tus clientes.
                </p>
              </div>

              <div className="rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 p-4">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-baloo text-base font-bold text-white mb-1">
                  Capacitaciones
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Webinars on-demand y actualizaciones directas de hoteles y destinos.
                </p>
              </div>

              <div className="rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 p-4">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-baloo text-base font-bold text-white mb-1">
                  Beneficios Trade
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Promociones exclusivas, incentivos y contacto directo con nuestro equipo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
