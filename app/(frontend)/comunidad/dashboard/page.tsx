import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { representationsContent } from '@/data/content';
import {
  Building2,
  FileText,
  Download,
  Sparkles,
  Shield,
  FolderOpen,
  Calendar,
  Lock,
  MapPin,
  Newspaper,
  Compass,
  ArrowUpRight,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function extractPlainText(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content.root?.children) {
    try {
      const texts: string[] = [];
      const traverse = (node: any) => {
        if (!node) return;
        if (typeof node.text === 'string') texts.push(node.text);
        if (Array.isArray(node.children)) {
          node.children.forEach(traverse);
        }
      };
      traverse(content.root);
      return texts.join(' ').trim();
    } catch {
      return '';
    }
  }
  return '';
}

export default async function ComunidadDashboardPage() {
  const payload = await getPayload({ config });
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });

  // Protección de ruta: Si no está autenticado, redirige al login de la comunidad
  if (!user) {
    redirect('/comunidad/login');
  }

  // Consulta de contenidos filtrados automáticamente según el rol mediante Access Control
  let contentItems: any[] = [];
  try {
    const res = await payload.find({
      collection: 'community-content',
      user,
      depth: 1,
      sort: '-createdAt',
    });
    contentItems = res.docs || [];
  } catch (e) {
    console.warn('Error al cargar community-content:', e);
  }

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

  // Separación de Novedades y Herramientas
  const newsItems = contentItems.filter(
    (item) => item.category === 'novedades' || item.category === 'promociones'
  );
  const toolItems = contentItems.filter(
    (item) =>
      item.category !== 'novedades' &&
      item.category !== 'promociones' &&
      item.category !== 'representaciones'
  );

  return (
    <div className="space-y-12">
      {/* Banner de Bienvenida y Políticas B2B */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#113d5b] via-[#0e496d] to-[#1b87c7] text-white p-8 sm:p-10 shadow-xl shadow-[#113d5b]/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#3cac59]" />
            Portal Exclusivo para Profesionales de Turismo
          </div>
          <h1 suppressHydrationWarning className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {`Bienvenido, ${user.name?.split(' ')[0] || 'Colega'}`}
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light mb-6">
            Espacio exclusivo para Operadores Mayoristas y Agencias de Viajes. Aquí encontrarás el catálogo oficial de destinos representados, fichas técnicas, promociones vigentes y herramientas comerciales de apoyo.
          </p>

          {/* Aviso de Confidencialidad y Precios */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/20 border border-white/15 backdrop-blur-sm text-xs sm:text-sm text-slate-200">
            <Shield className="w-5 h-5 text-[#3cac59] shrink-0 mt-0.5" />
            <span>
              <strong>Política de Seguridad B2B:</strong> Por normativas de confidencialidad del trade, este portal <strong>no publica tarifas ni precios confidenciales al público</strong>. Los materiales están destinados a soporte de ventas, formación y cotización directa con operadores habilitados.
            </span>
          </div>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* ======================================================== */}
      {/* 1. CATÁLOGO DE REPRESENTACIONES OFICIALES (EXCLUSIVO) */}
      {/* ======================================================== */}
      <section id="representaciones" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3cac59] mb-1">
                <Compass className="w-4 h-4" />
                <span>Marcas y Destinos de Excelencia</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
                Catálogo de Representaciones Oficiales
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              5 Destinos Internacionales Activos en LATAM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {representationsContent.items.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl bg-[#4d4e4f] shadow-md hover:shadow-xl transition-all duration-300 min-h-[380px] flex flex-col justify-between border border-slate-200"
              >
                {/* Background Image */}
                <Image
                  src={item.image}
                  alt={`${item.title} - ${item.brand}`}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4d4e4f] via-[#4d4e4f]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="relative z-10 p-5 flex items-start justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider border border-white/20">
                    <Building2 className="w-3.5 h-3.5 text-[#3cac59]" />
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1b87c7] text-white text-xs font-bold shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-5 sm:p-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#3cac59] uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.country}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1 leading-tight group-hover:text-[#3cac59] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-white/90 mb-2">
                    {item.brand}
                  </p>

                  <p className="text-xs text-white/80 leading-relaxed line-clamp-3 mb-4">
                    {extractPlainText(item.description)}
                  </p>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 text-[#3cac59] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Representación Activa
                    </span>
                    <a
                      href={`mailto:marketing@promovere.com.ar?subject=Consulta%20Trade%20-%20${encodeURIComponent(item.title)}%20(${encodeURIComponent(item.brand)})`}
                      className="inline-flex items-center gap-1 font-bold text-white hover:text-[#1b87c7] transition-colors"
                    >
                      <span>Solicitar Material</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. NOVEDADES (PROMO NEWS & PRENSA) */}
        {/* ======================================================== */}
        <section id="novedades" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1b87c7] mb-1">
                <Newspaper className="w-4 h-4" />
                <span>Actualidad Comercial</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
                Novedades & Promo News
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fallback inicial de novedades si la colección tiene pocos ítems */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#1b87c7]/10 text-[#1b87c7] uppercase">
                    Temporada 2026
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">Q1/Q2</span>
                </div>
                <h3 className="text-base font-bold text-[#4d4e4f] mb-2 leading-snug">
                  Lanzamiento de Caravanas Comerciales y Fam Tours Cono Sur
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Promovêre anuncia el cronograma de workshops y rondas de negocios en Buenos Aires, Córdoba, Montevideo y Santiago para conectar agencias con cadenas del Caribe.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#1b87c7] font-semibold">
                <span>Prensa Oficial</span>
                <Share2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#3cac59]/10 text-[#3cac59] uppercase">
                    Hotelería
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">Caribe</span>
                </div>
                <h3 className="text-base font-bold text-[#4d4e4f] mb-2 leading-snug">
                  Atelier Playa Mujeres: Nuevas Certificaciones y Experiencias
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Actualización del programa Handcrafted Hospitality con beneficios para reservas anticipadas en suites de lujo para el mercado emisor latinoamericano.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#3cac59] font-semibold">
                <span>Producto Exclusivo</span>
                <Share2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-700 uppercase">
                    Mediterráneo
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">Grecia</span>
                </div>
                <h3 className="text-base font-bold text-[#4d4e4f] mb-2 leading-snug">
                  Hellenic Travel Network: Circuitos e Islas 2026 en Español
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Manual completo de itinerarios combinados Atenas, Mykonos, Santorini y Creta con guías de habla hispana garantizados durante toda la temporada.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-700 font-semibold">
                <span>Ficha Comercial</span>
                <Share2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. HERRAMIENTAS DE GESTIÓN & DESCARGAS COMERCIALES */}
        {/* ======================================================== */}
        <section id="herramientas" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3cac59] mb-1">
                <FolderOpen className="w-4 h-4" />
                <span>Recursos Descargables</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
                Herramientas de Gestión Comercial
              </h2>
              <p suppressHydrationWarning className="text-xs sm:text-sm text-slate-500 mt-1">
                {`Documentos y manuales filtrados estrictamente según tu nivel de acceso (${currentRole.label}).`}
              </p>
            </div>
          </div>

          {contentItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#4d4e4f] mb-1">
                No hay recursos adicionales registrados aún
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                El equipo comercial de Promovêre está subiendo nuevos manuales técnicos.
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
                      {extractPlainText(item.description)}
                    </p>
                  </div>

                  {/* Archivos Descargables */}
                  {(() => {
                    const attachments = (Array.isArray(item.attachments) ? item.attachments : []).map((att: any) => ({
                      name: typeof att === 'object' ? att.filename || att.alt || att.title || 'Archivo descargable' : 'Archivo descargable',
                      url: typeof att === 'object' ? att.url || `/api/media/file/${att.filename}` : '',
                    }));
                    const allDownloads = [...(item.downloadableFiles || []), ...attachments].filter((d: any) => Boolean(d.url));

                    return (
                      <div className="pt-4 border-t border-slate-100">
                        <span suppressHydrationWarning className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          {`Descargas Disponibles (${allDownloads.length}):`}
                        </span>
                        {allDownloads.length > 0 ? (
                          <div className="space-y-1.5">
                            {allDownloads.map((file: any, idx: number) => (
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
                    );
                  })()}
                </div>
              ))}
            </div>
          )}
        </section>
    </div>
  );
}
