import BrandedLoader from '@/components/BrandedLoader';

export default function ComunidadDashboardLoading() {
  return (
    <BrandedLoader
      fullScreen={false}
      eyebrow="Comunidad Trade"
      message="Cargando tus herramientas, promociones y agenda..."
      className="rounded-3xl bg-white/60"
    />
  );
}
