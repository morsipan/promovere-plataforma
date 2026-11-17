import { getMediaUrl } from './media';

export type BackgroundColorKey =
  | 'blancoHumo'
  | 'blanco'
  | 'grisOscuro'
  | 'verde'
  | 'azul'
  | 'transparente';

export type ThemeKey = 'light' | 'dark';

export type OverlayOpacityKey = 'ninguna' | 'sutil' | 'media' | 'intensa';

export interface AppearanceData {
  backgroundColor?: BackgroundColorKey;
  theme?: ThemeKey;
  backgroundImage?: unknown;
  overlayOpacity?: OverlayOpacityKey;
}

export interface SectionAppearance {
  bgClass: string;
  isDark: boolean;
  theme: ThemeKey;
  titleClass: string;
  subtitleClass: string;
  bodyClass: string;
  badgeClass: string;
  cardClass: string;
  cardTitleClass: string;
  cardSubtextClass: string;
  borderClass: string;
  backgroundImageUrl: string;
  overlayClass: string;
}

/**
 * Traduce el objeto de apariencia configurado en Payload CMS
 * a clases utilitarias de Tailwind CSS garantizando el contraste visual.
 */
export function resolveAppearance(
  appearance?: AppearanceData,
  defaults: {
    backgroundColor?: BackgroundColorKey;
    theme?: ThemeKey;
    overlayOpacity?: OverlayOpacityKey;
  } = {}
): SectionAppearance {
  const bg = appearance?.backgroundColor || defaults.backgroundColor || 'blancoHumo';
  
  // Si no se definió tema explícito, se infiere según el color de fondo elegido
  const inferredTheme: ThemeKey = ['grisOscuro', 'verde', 'azul'].includes(bg)
    ? 'dark'
    : 'light';
  const theme = appearance?.theme || defaults.theme || inferredTheme;
  const isDark = theme === 'dark';

  // 1. Mapeo de colores de fondo corporativos
  const bgClasses: Record<BackgroundColorKey, string> = {
    blancoHumo: 'bg-[#f9f9f9]',
    blanco: 'bg-white',
    grisOscuro: 'bg-[#4d4e4f]',
    verde: 'bg-[#3cac59]',
    azul: 'bg-[#1b87c7]',
    transparente: 'bg-transparent',
  };

  const bgClass = bgClasses[bg] || 'bg-[#f9f9f9]';

  // 2. Mapeo de imagen de fondo y opacidad de overlay
  const backgroundImageUrl = getMediaUrl(appearance?.backgroundImage, '');
  const opacity = appearance?.overlayOpacity || defaults.overlayOpacity || 'media';

  const overlayClasses: Record<OverlayOpacityKey, string> = {
    ninguna: 'bg-transparent',
    sutil: 'bg-black/25',
    media: 'bg-black/50 backdrop-blur-[1px]',
    intensa: 'bg-black/75 backdrop-blur-[2px]',
  };

  const overlayClass = overlayClasses[opacity] || 'bg-black/50';

  // 3. Clases de tipografía y contraste estricto
  const titleClass = isDark
    ? 'text-white font-heading'
    : 'text-[#4d4e4f] font-heading';

  const subtitleClass = isDark
    ? 'text-white/90 font-sans'
    : 'text-[#4d4e4f]/80 font-sans';

  const bodyClass = isDark
    ? 'text-white/80 font-sans'
    : 'text-[#4d4e4f]/75 font-sans';

  // Badges y píldoras
  const badgeClass = isDark
    ? 'bg-white/10 text-white border-white/20 backdrop-blur-sm'
    : 'bg-[#1b87c7]/10 text-[#1b87c7] border-[#1b87c7]/20';

  // Tarjetas internas
  const cardClass = isDark
    ? 'bg-white/10 border-white/15 text-white backdrop-blur-md hover:bg-white/15 shadow-md'
    : 'bg-white border-gray-100 text-[#4d4e4f] shadow-sm hover:shadow-xl';

  const cardTitleClass = isDark
    ? 'text-white font-heading'
    : 'text-[#4d4e4f] font-heading';

  const cardSubtextClass = isDark
    ? 'text-white/80 font-sans'
    : 'text-[#4d4e4f]/75 font-sans';

  const borderClass = isDark ? 'border-white/15' : 'border-gray-200/80';

  return {
    bgClass,
    isDark,
    theme,
    titleClass,
    subtitleClass,
    bodyClass,
    badgeClass,
    cardClass,
    cardTitleClass,
    cardSubtextClass,
    borderClass,
    backgroundImageUrl,
    overlayClass,
  };
}
