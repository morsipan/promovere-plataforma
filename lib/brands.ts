/**
 * Utilidades para slugs determinísticos de marcas/representaciones en Comunidad.
 * Permite exponer landing pages libres en /comunidad/marcas/[slug] sin alterar
 * el esquema existente de la colección Representations.
 */

export function slugifyBrand(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getBrandSlug(rep: {
  id?: string | number | null;
  brand?: string | null;
  title?: string | null;
}): string {
  const base = slugifyBrand(rep.brand || rep.title || '');
  if (base) return base;
  return rep.id !== undefined && rep.id !== null ? `marca-${rep.id}` : 'marca';
}

export function matchesBrandSlug(
  rep: { id?: string | number | null; brand?: string | null; title?: string | null },
  targetSlug: string
): boolean {
  const normalizedTarget = slugifyBrand(decodeURIComponent(targetSlug));
  if (!normalizedTarget) return false;
  const primarySlug = getBrandSlug(rep);
  const titleSlug = rep.title ? slugifyBrand(rep.title) : '';
  const idSlug = rep.id !== undefined && rep.id !== null ? String(rep.id) : '';
  return (
    primarySlug === normalizedTarget ||
    (Boolean(titleSlug) && titleSlug === normalizedTarget) ||
    (Boolean(idSlug) && idSlug === normalizedTarget)
  );
}
