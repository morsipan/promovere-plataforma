import { getMediaUrl } from '@/lib/media';

export type BlogBrandColor = 'azul' | 'verde' | 'grisOscuro';
export type BlogHeaderBackground = 'grisOscuro' | 'azul' | 'verde' | 'blancoHumo';
export type BlogHeaderTitleColor = 'blanco' | 'blancoHumo' | 'grisOscuro' | 'azul' | 'verde';
export type BlogBadgeStyle = 'soft' | 'solid' | 'outline';
export type BlogCardBorderStyle = 'subtle' | 'accent' | 'elevated';

export type BlogBannerPlacement = 'ambos' | 'prensa' | 'contenidos';

export interface BlogBannerItem {
  id?: string | null;
  enabled?: boolean | null;
  placement?: BlogBannerPlacement | string | null;
  order?: number | null;
  title?: string | null;
  image?: unknown;
  imageUrl?: string | null;
  mobileImage?: unknown;
  mobileImageUrl?: string | null;
  href?: string | null;
}

export interface ResolvedBlogBanner {
  id: string;
  title: string;
  imageUrl: string;
  mobileImageUrl: string;
  hasDedicatedMobileImage: boolean;
  href: string | null;
  placement: BlogBannerPlacement;
}

export interface BlogSettingsData {
  blogTitle?: string | null;
  blogSubtitle?: string | null;
  headerBackground?: BlogHeaderBackground | string | null;
  headerTitleColor?: BlogHeaderTitleColor | string | null;
  showDate?: boolean | null;
  showCategory?: boolean | null;
  showBrand?: boolean | null;
  categoryColor?: BlogBrandColor | string | null;
  tagColor?: BlogBrandColor | string | null;
  badgeStyle?: BlogBadgeStyle | string | null;
  accentColor?: BlogBrandColor | string | null;
  cardBorderStyle?: BlogCardBorderStyle | string | null;
  showBannerBeforePagination?: boolean | null;
  banners?: BlogBannerItem[] | null;
}

export interface ResolvedBlogSettings {
  blogTitle: string;
  blogSubtitle: string;
  isLightHeader: boolean;
  headerBgClass: string;
  headerTitleClass: string;
  headerSubtitleClass: string;
  headerMetaTextClass: string;
  showDate: boolean;
  showCategory: boolean;
  showBrand: boolean;
  categoryHeaderBadgeClass: string;
  categoryListBadgeClass: string;
  tagHeaderBadgeClass: string;
  tagListBadgeClass: string;
  tagTextClass: string;
  accentTextClass: string;
  accentHoverTextClass: string;
  accentActivePageClass: string;
  accentPageHoverClass: string;
  accentButtonClass: string;
  articleCardClass: string;
  listCardBorderClass: string;
  showBannerBeforePagination: boolean;
  banners: ResolvedBlogBanner[];
}

const DEFAULT_TITLE = 'Promo News';
const DEFAULT_SUBTITLE =
  'Novedades oficiales de Promovêre, lanzamientos, destinos y cadenas hoteleras representadas en América Latina.';

function normalizeBrandColor(val: unknown, fallback: BlogBrandColor): BlogBrandColor {
  if (val === 'azul' || val === 'verde' || val === 'grisOscuro') return val;
  return fallback;
}

function normalizeHeaderBg(val: unknown): BlogHeaderBackground {
  if (val === 'grisOscuro' || val === 'azul' || val === 'verde' || val === 'blancoHumo') {
    return val;
  }
  return 'grisOscuro';
}

function normalizeHeaderTitleColor(
  val: unknown,
  isLightHeader: boolean
): BlogHeaderTitleColor {
  if (
    val === 'blanco' ||
    val === 'blancoHumo' ||
    val === 'grisOscuro' ||
    val === 'azul' ||
    val === 'verde'
  ) {
    // Evitar texto blanco ilegible sobre fondo blancoHumo si no se cambió explícitamente
    if (isLightHeader && (val === 'blanco' || val === 'blancoHumo')) {
      return 'grisOscuro';
    }
    return val;
  }
  return isLightHeader ? 'grisOscuro' : 'blanco';
}

function normalizeBadgeStyle(val: unknown): BlogBadgeStyle {
  if (val === 'soft' || val === 'solid' || val === 'outline') return val;
  return 'soft';
}

function normalizeCardBorderStyle(val: unknown): BlogCardBorderStyle {
  if (val === 'subtle' || val === 'accent' || val === 'elevated') return val;
  return 'subtle';
}

function buildBadgeClasses(
  color: BlogBrandColor,
  style: BlogBadgeStyle,
  onDarkHeader: boolean
): string {
  if (style === 'solid') {
    if (color === 'verde') return 'bg-[#3cac59] border-[#3cac59] text-white';
    if (color === 'grisOscuro') return 'bg-[#4d4e4f] border-[#4d4e4f] text-white';
    return 'bg-[#1b87c7] border-[#1b87c7] text-white';
  }

  if (style === 'outline') {
    if (onDarkHeader) {
      if (color === 'verde') return 'bg-transparent border-[#3cac59] text-[#f9f9f9]';
      if (color === 'grisOscuro') return 'bg-transparent border-white/50 text-[#f9f9f9]';
      return 'bg-transparent border-[#1b87c7] text-[#f9f9f9]';
    }
    if (color === 'verde') return 'bg-white/95 border-[#3cac59] text-[#3cac59]';
    if (color === 'grisOscuro') return 'bg-white/95 border-[#4d4e4f] text-[#4d4e4f]';
    return 'bg-white/95 border-[#1b87c7] text-[#1b87c7]';
  }

  // soft (default)
  if (onDarkHeader) {
    if (color === 'verde') return 'bg-[#3cac59]/25 border-[#3cac59]/50 text-[#f9f9f9]';
    if (color === 'grisOscuro') return 'bg-white/15 border-white/30 text-[#f9f9f9]';
    return 'bg-[#1b87c7]/25 border-[#1b87c7]/50 text-[#f9f9f9]';
  }

  if (color === 'verde') return 'bg-[#3cac59]/12 border-[#3cac59]/30 text-[#3cac59]';
  if (color === 'grisOscuro') return 'bg-[#4d4e4f]/10 border-[#4d4e4f]/25 text-[#4d4e4f]';
  return 'bg-[#1b87c7]/12 border-[#1b87c7]/30 text-[#1b87c7]';
}

function buildListOverlayBadgeClasses(color: BlogBrandColor, style: BlogBadgeStyle): string {
  if (style === 'solid') {
    if (color === 'verde') return 'bg-[#3cac59] border-[#3cac59] text-white';
    if (color === 'grisOscuro') return 'bg-[#4d4e4f] border-[#4d4e4f] text-white';
    return 'bg-[#1b87c7] border-[#1b87c7] text-white';
  }
  if (style === 'outline') {
    if (color === 'verde') return 'bg-white/95 border-[#3cac59] text-[#3cac59]';
    if (color === 'grisOscuro') return 'bg-white/95 border-[#4d4e4f] text-[#4d4e4f]';
    return 'bg-white/95 border-[#1b87c7] text-[#1b87c7]';
  }
  // soft on image overlay: legible white surface + brand text
  if (color === 'verde') return 'bg-white/95 border-[#3cac59]/30 text-[#3cac59]';
  if (color === 'grisOscuro') return 'bg-white/95 border-[#4d4e4f]/25 text-[#4d4e4f]';
  return 'bg-white/95 border-[#1b87c7]/30 text-[#1b87c7]';
}

export function resolveBlogSettings(raw?: BlogSettingsData | null): ResolvedBlogSettings {
  const headerBg = normalizeHeaderBg(raw?.headerBackground);
  const isLightHeader = headerBg === 'blancoHumo';
  const headerTitleColor = normalizeHeaderTitleColor(raw?.headerTitleColor, isLightHeader);
  const categoryColor = normalizeBrandColor(raw?.categoryColor, 'azul');
  const tagColor = normalizeBrandColor(raw?.tagColor, 'verde');
  const badgeStyle = normalizeBadgeStyle(raw?.badgeStyle);
  const accentColor = normalizeBrandColor(raw?.accentColor, 'azul');
  const cardBorderStyle = normalizeCardBorderStyle(raw?.cardBorderStyle);

  const headerBgMap: Record<BlogHeaderBackground, string> = {
    grisOscuro: 'bg-[#4d4e4f] text-white',
    azul: 'bg-[#1b87c7] text-white',
    verde: 'bg-[#3cac59] text-white',
    blancoHumo: 'bg-[#f9f9f9] text-[#4d4e4f] border-b border-gray-200',
  };

  const headerTitleMap: Record<BlogHeaderTitleColor, string> = {
    blanco: 'text-white',
    blancoHumo: 'text-[#f9f9f9]',
    grisOscuro: 'text-[#4d4e4f]',
    azul: 'text-[#1b87c7]',
    verde: 'text-[#3cac59]',
  };

  const tagTextMap: Record<BlogBrandColor, string> = {
    verde: 'text-[#3cac59]',
    azul: 'text-[#1b87c7]',
    grisOscuro: 'text-[#4d4e4f]',
  };

  const accentTextMap: Record<BlogBrandColor, string> = {
    azul: 'text-[#1b87c7]',
    verde: 'text-[#3cac59]',
    grisOscuro: 'text-[#4d4e4f]',
  };

  const accentHoverTextMap: Record<BlogBrandColor, string> = {
    azul: 'hover:text-[#1b87c7]',
    verde: 'hover:text-[#3cac59]',
    grisOscuro: 'hover:text-[#4d4e4f]',
  };

  const accentActivePageMap: Record<BlogBrandColor, string> = {
    azul: 'bg-[#1b87c7] text-white shadow-md shadow-[#1b87c7]/25',
    verde: 'bg-[#3cac59] text-white shadow-md shadow-[#3cac59]/25',
    grisOscuro: 'bg-[#4d4e4f] text-white shadow-md shadow-[#4d4e4f]/25',
  };

  const accentPageHoverMap: Record<BlogBrandColor, string> = {
    azul: 'hover:border-[#1b87c7] hover:text-[#1b87c7]',
    verde: 'hover:border-[#3cac59] hover:text-[#3cac59]',
    grisOscuro: 'hover:border-[#4d4e4f] hover:text-[#4d4e4f]',
  };

  const accentButtonMap: Record<BlogBrandColor, string> = {
    azul: 'bg-[#1b87c7] hover:bg-[#156d9f] text-white',
    verde: 'bg-[#3cac59] hover:bg-[#31904a] text-white',
    grisOscuro: 'bg-[#4d4e4f] hover:bg-[#38393a] text-white',
  };

  const accentBorderMap: Record<BlogBrandColor, string> = {
    azul: 'border-[#1b87c7]/45',
    verde: 'border-[#3cac59]/45',
    grisOscuro: 'border-[#4d4e4f]/40',
  };

  const articleCardClass =
    cardBorderStyle === 'accent'
      ? `bg-white rounded-3xl border-2 ${accentBorderMap[accentColor]} shadow-sm overflow-hidden`
      : cardBorderStyle === 'elevated'
      ? 'bg-white rounded-3xl border border-gray-200/70 shadow-xl shadow-[#4d4e4f]/10 overflow-hidden'
      : 'bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden';

  const listCardBorderClass =
    cardBorderStyle === 'accent'
      ? `border-2 ${accentBorderMap[accentColor]}`
      : cardBorderStyle === 'elevated'
      ? 'shadow-lg shadow-[#4d4e4f]/10'
      : '';

  const resolvedBanners: ResolvedBlogBanner[] = (Array.isArray(raw?.banners) ? raw.banners : [])
    .map((b, idx) => {
      const imgUrl = getMediaUrl(b?.image, (b?.imageUrl || '').trim());
      const dedicatedMobileUrl = getMediaUrl(b?.mobileImage, (b?.mobileImageUrl || '').trim());
      const effectiveDesktopUrl = imgUrl || dedicatedMobileUrl;
      const effectiveMobileUrl = dedicatedMobileUrl || imgUrl;
      const rawHref = (b?.href || '').trim();
      const href =
        rawHref.length > 0
          ? /^https?:\/\//i.test(rawHref) || rawHref.startsWith('/')
            ? rawHref
            : `https://${rawHref}`
          : null;
      const placement: BlogBannerPlacement =
        b?.placement === 'prensa' || b?.placement === 'contenidos' ? b.placement : 'ambos';
      return {
        id: b?.id || `blog-banner-${idx}`,
        enabled: b?.enabled !== false,
        placement,
        order: typeof b?.order === 'number' && !Number.isNaN(b.order) ? b.order : idx,
        origIndex: idx,
        title: (b?.title || '').trim() || 'Banner Promovêre',
        imageUrl: effectiveDesktopUrl,
        mobileImageUrl: effectiveMobileUrl,
        hasDedicatedMobileImage: Boolean(dedicatedMobileUrl),
        href,
      };
    })
    .filter((b) => b.enabled && b.imageUrl.length > 0)
    .sort((a, b) => (a.order !== b.order ? a.order - b.order : a.origIndex - b.origIndex))
    .map(({ id, title, imageUrl, mobileImageUrl, hasDedicatedMobileImage, href, placement }) => ({
      id,
      title,
      imageUrl,
      mobileImageUrl,
      hasDedicatedMobileImage,
      href,
      placement,
    }));

  return {
    blogTitle: (raw?.blogTitle || '').trim() || DEFAULT_TITLE,
    blogSubtitle: (raw?.blogSubtitle || '').trim() || DEFAULT_SUBTITLE,
    isLightHeader,
    headerBgClass: headerBgMap[headerBg],
    headerTitleClass: headerTitleMap[headerTitleColor],
    headerSubtitleClass: isLightHeader ? 'text-[#4d4e4f]/80' : 'text-[#f9f9f9]/85',
    headerMetaTextClass: isLightHeader ? 'text-[#4d4e4f]/75' : 'text-[#f9f9f9]/80',
    showDate: raw?.showDate !== false,
    showCategory: raw?.showCategory !== false,
    showBrand: raw?.showBrand !== false,
    categoryHeaderBadgeClass: buildBadgeClasses(categoryColor, badgeStyle, !isLightHeader),
    categoryListBadgeClass: buildListOverlayBadgeClasses(categoryColor, badgeStyle),
    tagHeaderBadgeClass: buildBadgeClasses(tagColor, badgeStyle, !isLightHeader),
    tagListBadgeClass: buildBadgeClasses(tagColor, badgeStyle, false),
    tagTextClass: tagTextMap[tagColor],
    accentTextClass: accentTextMap[accentColor],
    accentHoverTextClass: accentHoverTextMap[accentColor],
    accentActivePageClass: accentActivePageMap[accentColor],
    accentPageHoverClass: accentPageHoverMap[accentColor],
    accentButtonClass: accentButtonMap[accentColor],
    articleCardClass,
    listCardBorderClass,
    showBannerBeforePagination: raw?.showBannerBeforePagination !== false,
    banners: resolvedBanners,
  };
}
