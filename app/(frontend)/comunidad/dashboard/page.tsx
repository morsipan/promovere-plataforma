import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/comunidad/LogoutButton';
import {
  Building2,
  FileText,
  Download,
  Sparkles,
  Shield,
  Layers,
  FolderOpen,
  Calendar,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ComunidadDashboardPage() {
  const payload = await getPayload({ config });
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });

  // Protección de ruta: Si no está autenticado, redirige al login de la comunidad
  if (!user) {
    redirect('/comunidad/login');
  }

  // Consulta de contenidos filtrados automáticamente según el rol mediante Access Control
  const { docs: contentItems } = await payload.find({
    collection: 'community-content',
    user,
    depth: 1,
    sort: '-createdAt',
  });

  const roleLabels: Record<string, { label: string; color: string; badge: string }> = {
    admin: {
      label: 'Administrador (Equipo Promovêre)',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'bg-purple-600 text-white',
    },
    editor: {
      label: 'Editor de Contenidos',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'bg-indigo-600 text-white',
    },
    mayorista: {
      label: 'Operador Mayorista',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'bg-[#1b87c7] text-white',
    },
    minorista: {
      label: 'Agencia Minorista',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'bg-[#3cac59] text-white',
    },
  };

  const currentRole = roleLabels[user.role as string] || {
    label: user.role,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    badge: 'bg-slate-600 text-white',
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#4d4e4f]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Identidad */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] flex items-center justify-center text-white shadow-md shadow-[#1b87c7]/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-black text-[#4d4e4f] tracking-tight block leading-none">
                    Promovêre
                  </span>
                  <span className="text-[11px] font-bold text-[#1b87c7] uppercase tracking-wider block mt-1">
                    Comunidad Trade
                  </span>
                </div>
              </Link>
            </div>

            {/* Perfil del Usuario & Logout */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-[#4d4e4f] truncate max-w-[200px]">
                  {user.name || user.email}
                </span>
                <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                  {user.company || 'Profesional de Turismo'}
                </span>
              </div>

              {/* Badge de Rol */}
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold border ${currentRole.color} shadow-xs flex items-center gap-1.5`}
              >
                <span className={`w-2 h-2 rounded-full ${currentRole.badge}`} />
                <span>{currentRole.label}</span>
              </div>

              {/* Botón Cerrar Sesión */}
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Banner de Bienvenida y Políticas B2B */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#113d5b] via-[#0e496d] to-[#1b87c7] text-white p-8 sm:p-10 mb-10 shadow-xl shadow-[#113d5b]/10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#3cac59]" />
              Herramientas de Comercialización Exclusivas
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Bienvenido, {user.name?.split(' ')[0] || 'Colega'}
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light mb-6">
              Accede a manuales de ventas, fichas técnicas de representaciones, capacitaciones y recursos promocionales para potenciar tus ventas turísticas en Latinoamérica.
            </p>

            {/* Aviso de Confidencialidad y Precios */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/20 border border-white/15 backdrop-blur-sm text-xs sm:text-sm text-slate-200">
              <Shield className="w-5 h-5 text-[#3cac59] shrink-0 mt-0.5" />
              <span>
                <strong>Política de Seguridad B2B:</strong> Por políticas institucionales de Promovêre, este portal <strong>no publica tarifas ni precios visibles</strong>. Todo el material provisto está orientado a capacitación, marketing y soporte comercial directo.
              </span>
            </div>
          </div>

          {/* Decorative Pattern */}
          <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        </div>

        {/* Resumen de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recursos Disponibles
              </span>
              <FolderOpen className="w-5 h-5 text-[#1b87c7]" />
            </div>
            <div className="text-3xl font-black text-[#4d4e4f]">{contentItems.length}</div>
            <p className="text-xs text-slate-500 mt-1">Habilitados para tu perfil {currentRole.label}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Nivel de Acceso
              </span>
              <Lock className="w-5 h-5 text-[#3cac59]" />
            </div>
            <div className="text-xl font-black text-[#4d4e4f] capitalize">{user.role}</div>
            <p className="text-xs text-slate-500 mt-1">Validado por Access Control de Payload</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Soporte Comercial
              </span>
              <Building2 className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-base font-bold text-[#4d4e4f]">marketing@promovere.com.ar</div>
            <p className="text-xs text-slate-500 mt-1">Atención personalizada para el trade</p>
          </div>
        </div>

        {/* Sección de Contenidos y Documentos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#4d4e4f] tracking-tight">
                Herramientas y Novedades Comerciales
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Material descargable filtrado estrictamente según tu perfil autorizado.
              </p>
            </div>
          </div>

          {contentItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#4d4e4f] mb-1">
                No hay contenidos publicados para tu categoría aún
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                El equipo de Promovêre está preparando nuevos manuales y promociones. Te notificaremos en cuanto estén disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentItems.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-[#1b87c7]/50 shadow-xs hover:shadow-lg transition-all duration-200 p-6 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#1b87c7]/10 text-[#1b87c7] uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.highlight && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#3cac59]/10 text-[#3cac59]">
                          {item.highlight}
                        </span>
                      )}
                    </div>

                    {/* Título y Descripción */}
                    <h3 className="text-base font-bold text-[#4d4e4f] group-hover:text-[#1b87c7] transition-colors mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Archivos Descargables */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Descargas Disponibles ({item.downloadableFiles?.length || 0}):
                    </span>
                    {item.downloadableFiles && item.downloadableFiles.length > 0 ? (
                      <div className="space-y-1.5">
                        {item.downloadableFiles.map((file: any, idx: number) => (
                          <a
                            key={idx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-[#f0f7fc] border border-slate-100 text-xs font-semibold text-[#4d4e4f] hover:text-[#1b87c7] transition-colors"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <FileText className="w-3.5 h-3.5 text-[#1b87c7] shrink-0" />
                              <span className="truncate">{file.name}</span>
                            </span>
                            <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No incluye adjuntos</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
