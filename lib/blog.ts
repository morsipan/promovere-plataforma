/**
 * Utilidades de normalización de slugs y formateo determinístico de fechas para Promo News (Blog).
 */

const SLUG_TYPO_FIXES: Record<string, string> = {
  'paraguay-y-bolviia': 'paraguay-y-bolivia',
  'lomas-hospitaluty-nota': 'lomas-hospitality-nota',
};

const MONTHS_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

export function normalizeBlogSlug(raw: string): string {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  const ascii = decoded
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return SLUG_TYPO_FIXES[ascii] || ascii;
}

export function getBlogPostSlug(post: {
  id?: string | number | null;
  slug?: string | null;
  title?: string | null;
}): string {
  if (post.slug && post.slug.trim().length > 0) {
    return normalizeBlogSlug(post.slug);
  }
  if (post.title && post.title.trim().length > 0) {
    return normalizeBlogSlug(post.title);
  }
  return post.id !== undefined && post.id !== null ? `nota-${post.id}` : 'nota';
}

export function formatBlogDateUtc(dateStr?: string | null): string {
  if (!dateStr) return '';
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
  if (isoMatch) {
    const [, year, monthStr, day] = isoMatch;
    const monthIdx = Number(monthStr) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${MONTHS_ES[monthIdx]} ${year}`;
    }
  }
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return '';
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  const month = MONTHS_ES[parsed.getUTCMonth()];
  const year = parsed.getUTCFullYear();
  return `${day} ${month} ${year}`;
}
