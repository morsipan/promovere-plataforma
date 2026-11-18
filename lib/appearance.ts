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

export type AccentColorKey = 'azul' | 'verde' | 'grisOscuro' | 'blanco';

export type ButtonColorKey = 'azul' | 'verde' | 'blanco' | 'oscuro';

export type BadgeColorKey = 'verde' | 'azul' | 'gris' | 'blanco';

export interface AppearanceData {
  backgroundColor?: BackgroundColorKey;
  theme?: ThemeKey;
  backgroundImage?: unknown;
  overlayOpacity?: OverlayOpacityKey;
  accentColor?: AccentColorKey;
  buttonColor?: ButtonColorKey;
  badgeColor?: BadgeColorKey;
}

export interface SectionAppearance {
  bgClass: string;
  isDark: boolean;
  theme: ThemeKey;
  titleClass: string;
  subtitleClass: string;
  bodyClass: string;
  badgeClass: string;
  badgeIconClass: string;
  buttonClass: string;
  secondaryButtonClass: string;
  accentTextClass: string;
  accentBgClass: string;
  accentBorderClass: string;
  accentIconBgClass: string;
  cardClass: string;
  cardTitleClass: string;
  cardSubtextClass: string;
  borderClass: string;
  backgroundImageUrl: string;
  overlayClass: string;
}

/**
 * Traduce el objeto de apariencia configurado en Payload CMS
 * a clases utilitarias de Tailwind CSS garantizando el contraste visual
 * y la personalización de elementos individuales (botones, badges, acentos).
 */
export function resolveAppearance(
  appearance?: AppearanceData,
  defaults: {
    backgroundColor?: BackgroundColorKey;
    theme?: ThemeKey;
    overlayOpacity?: OverlayOpacityKey;
    accentColor?: AccentColorKey;
    buttonColor?: ButtonColorKey;
    badgeColor?: BadgeColorKey;
  } = {}
): SectionAppearance {
  const bg = appearance?.backgroundColor || defaults.backgroundColor || 'blancoHumo';
  
  // Si no se definió tema explícito, se infiere según el color de fondo elegido
  const inferredTheme: ThemeKey = ['grisOscuro', 'verde', 'azul'].includes(bg)
    ? 'dark'
    : 'light';
  const theme = appearance?.theme || defaults.theme || inferredTheme;
  const isDark = theme === 'dark';

  const accent: AccentColorKey =
    appearance?.accentColor || defaults.accentColor || (isDark ? 'verde' : 'azul');
  const button: ButtonColorKey =
    appearance?.buttonColor || defaults.buttonColor || 'azul';
  const badge: BadgeColorKey =
    appearance?.badgeColor || defaults.badgeColor || (isDark ? 'blanco' : 'verde');

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

  // 4. Mapeo de acentos y elementos individuales
  const accentTextClasses: Record<AccentColorKey, string> = {
    azul: 'text-[#1b87c7]',
    verde: 'text-[#3cac59]',
    grisOscuro: 'text-[#4d4e4f]',
    blanco: 'text-white',
  };
  const accentTextClass = accentTextClasses[accent] || 'text-[#1b87c7]';

  const accentBgClasses: Record<AccentColorKey, string> = {
    azul: 'bg-[#1b87c7]',
    verde: 'bg-[#3cac59]',
    grisOscuro: 'bg-[#4d4e4f]',
    blanco: 'bg-white',
  };
  const accentBgClass = accentBgClasses[accent] || 'bg-[#1b87c7]';

  const accentBorderClasses: Record<AccentColorKey, string> = {
    azul: 'border-[#1b87c7]',
    verde: 'border-[#3cac59]',
    grisOscuro: 'border-[#4d4e4f]',
    blanco: 'border-white',
  };
  const accentBorderClass = accentBorderClasses[accent] || 'border-[#1b87c7]';

  // Botón Principal (CTA)
  const buttonClasses: Record<ButtonColorKey, string> = {
    azul: 'bg-[#1b87c7] text-white hover:bg-[#1571a8] shadow-lg shadow-[#1b87c7]/25',
    verde: 'bg-[#3cac59] text-white hover:bg-[#32924a] shadow-lg shadow-[#3cac59]/25',
    blanco: 'bg-white text-[#4d4e4f] hover:bg-gray-100 shadow-md',
    oscuro: 'bg-[#4d4e4f] text-white hover:bg-[#3b3c3d] shadow-md',
  };
  const buttonClass = buttonClasses[button] || buttonClasses.azul;

  // Badges y píldoras
  const badgeClasses: Record<BadgeColorKey, string> = {
    verde: isDark
      ? 'bg-[#3cac59]/20 text-[#3cac59] border-[#3cac59]/30 backdrop-blur-sm'
      : 'bg-[#3cac59]/10 text-[#3cac59] border-[#3cac59]/20',
    azul: isDark
      ? 'bg-[#1b87c7]/20 text-[#1b87c7] border-[#1b87c7]/30 backdrop-blur-sm'
      : 'bg-[#1b87c7]/10 text-[#1b87c7] border-[#1b87c7]/20',
    gris: isDark
      ? 'bg-white/10 text-white border-white/20 backdrop-blur-sm'
      : 'bg-[#4d4e4f]/10 text-[#4d4e4f] border-[#4d4e4f]/20',
    blanco: isDark
      ? 'bg-white/20 text-white border-white/30 backdrop-blur-sm'
      : 'bg-white text-[#4d4e4f] border-gray-200 shadow-sm',
  };
  const badgeClass = badgeClasses[badge] || (isDark ? badgeClasses.blanco : badgeClasses.verde);

  const badgeIconClasses: Record<BadgeColorKey, string> = {
    verde: 'text-[#3cac59]',
    azul: 'text-[#1b87c7]',
    gris: isDark ? 'text-white' : 'text-[#4d4e4f]',
    blanco: isDark ? 'text-white' : 'text-[#4d4e4f]',
  };
  const badgeIconClass = badgeIconClasses[badge] || (isDark ? 'text-white' : 'text-[#3cac59]');

  const accentIconBgClasses: Record<AccentColorKey, string> = {
    azul: 'bg-[#1b87c7]/10 text-[#1b87c7] group-hover:bg-[#1b87c7] group-hover:text-white',
    verde: 'bg-[#3cac59]/10 text-[#3cac59] group-hover:bg-[#3cac59] group-hover:text-white',
    grisOscuro: isDark
      ? 'bg-white/10 text-white group-hover:bg-white group-hover:text-[#4d4e4f]'
      : 'bg-[#4d4e4f]/10 text-[#4d4e4f] group-hover:bg-[#4d4e4f] group-hover:text-white',
    blanco: isDark
      ? 'bg-white/20 text-white group-hover:bg-white group-hover:text-[#4d4e4f]'
      : 'bg-white text-[#4d4e4f] shadow-xs group-hover:bg-[#1b87c7] group-hover:text-white',
  };
  const accentIconBgClass = accentIconBgClasses[accent] || accentIconBgClasses.azul;

  const secondaryButtonClass = isDark
    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm'
    : 'bg-[#4d4e4f]/10 hover:bg-[#4d4e4f]/15 text-[#4d4e4f] border border-[#4d4e4f]/20';

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
    badgeIconClass,
    buttonClass,
    secondaryButtonClass,
    accentTextClass,
    accentBgClass,
    accentBorderClass,
    accentIconBgClass,
    cardClass,
    cardTitleClass,
    cardSubtextClass,
    borderClass,
    backgroundImageUrl,
    overlayClass,
  };
}
