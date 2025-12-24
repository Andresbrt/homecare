/**
 * 🎨 HOMECARE APP THEME - MANUAL DE MARCA OFICIAL
 * Integra colores, tipografía y estilos del Manual de Marca Homecare
 */

import { colors } from './colors';
import { typography, textStyles } from './typography';

export const COLORS = {
  // Colores oficiales del Manual de Marca Homecare
  primary: colors.primary,           // Turquesa Fresco #49C0BC
  secondary: colors.secondary,       // Azul Marino Profundo #001B38
  accent: colors.accent,             // Azul Petróleo #0E4D68
  background: colors.background,     // Blanco Puro #FFFFFF
  
  // Texto según manual Homecare
  text: colors.textPrimary,          // Azul Marino para texto principal
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  
  // Colores básicos
  white: colors.white,
  black: colors.black,
  
  // Grises neutrals
  gray: colors.gray[300],
  lightGray: colors.gray[100],
  darkGray: colors.gray[600],
  
  // Estados
  red: colors.error,
  green: colors.success,
  emergency: '#FEE2E2',
  emergencyText: colors.error,
};

export const FONTS = {
  // Tipografía del Manual de Marca Homecare mejorada
  regular: typography.fonts.regular,        // Poppins Regular
  medium: typography.fonts.medium,          // Poppins Medium
  semibold: typography.fonts.bold,          // Poppins SemiBold
  bold: typography.fonts.bold,              // Poppins Bold
  logo: typography.fonts.logo,              // Poppins SemiBold para logos
  
  // Mantener compatibilidad
  primary: typography.fonts.primary,        // Poppins Medium
  
  // Mantener Poppins específicos
  poppins_regular: 'Poppins_400Regular',
  poppins_medium: 'Poppins_500Medium', 
  poppins_semibold: 'Poppins_600SemiBold',
};

export const SIZES = {
  // Tamaños basados en la tipografía del Manual Homecare
  base: typography.sizes.base,         // 14px - Base del manual
  small: typography.sizes.sm,          // 12px - Texto pequeño
  font: typography.sizes.base,         // 14px - Texto estándar
  medium: typography.sizes.md,         // 16px - Texto mediano
  large: typography.sizes.lg,          // 18px - Texto grande
  xlarge: typography.sizes['2xl'],     // 24px - Títulos
  
  // Jerarquía de títulos del manual
  h1: typography.sizes['4xl'],         // 36px - Títulos principales
  h2: typography.sizes['3xl'],         // 30px - Títulos de sección
  h3: typography.sizes['2xl'],         // 24px - Subtítulos
  h4: typography.sizes.xl,             // 20px - Subtítulos menores
  
  // Cuerpo de texto
  body1: typography.sizes.lg,          // 18px
  body2: typography.sizes.md,          // 16px
  body3: typography.sizes.base,        // 14px
  body4: typography.sizes.sm,          // 12px
};

export const SHADOWS = {
  light: {
    shadowColor: colors.shadow,        // Sombra con color Homecare
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  dark: {
    shadowColor: colors.shadow,        // Sombra fuerte Homecare
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Exportar theme completo integrado con Homecare
const appTheme = { COLORS, SIZES, FONTS, SHADOWS };

// 🚀 UTILIDADES AVANZADAS HOMECARE
export const getThemeColor = (colorName, opacity = 1) => {
  const color = COLORS[colorName] || colorName;
  if (opacity === 1) return color;
  
  // Convertir hex a rgba si se especifica opacidad
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const createGradient = (colorStart, colorEnd, direction = '45deg') => ({
  background: `linear-gradient(${direction}, ${colorStart}, ${colorEnd})`,
});

export default appTheme;
