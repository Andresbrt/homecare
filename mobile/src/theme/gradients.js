import { colors } from './colors';

/**
 * 🎨 GRADIENTES HOMECARE
 * Basados en la paleta oficial del Manual de Marca
 * Turquesa Fresco (#49C0BC), Azul Petróleo (#0E4D68), Azul Marino Profundo (#001B38)
 */

export const gradients = {
  // Gradientes principales Homecare
  primary: [colors.primary, colors.primaryDark],           // Turquesa Fresco degradado
  secondary: [colors.secondary, colors.secondaryLight],    // Azul Marino a Petróleo
  accent: [colors.accent, colors.accentDark],              // Azul Petróleo degradado
  
  // Gradientes de servicios con colores Homecare
  deepClean: [colors.primary, colors.accent],              // Turquesa a Azul Petróleo
  express: [colors.primaryLight, colors.primary],          // Turquesa claro a normal
  ecoFriendly: [colors.primary, colors.secondary],         // Turquesa a Azul Marino
  office: [colors.accent, colors.secondary],               // Azul Petróleo a Marino
  
  // Gradientes de estado con Homecare
  success: ['#00CC66', '#00A85D'],                         // Verde éxito
  error: ['#FF3366', '#EF4444'],                           // Rojo error
  warning: ['#FFB800', '#F59E0B'],                         // Amarillo advertencia
  info: [colors.primary, colors.accent],                   // Turquesa a Azul Petróleo
  
  // Gradientes especiales Homecare
  premium: [colors.accent, colors.secondary],              // Azul Petróleo a Marino
  hero: [colors.primary, colors.accent, colors.secondary], // Turquesa → Petróleo → Marino
  ocean: [colors.primaryLight, colors.primary, colors.accent], // Degradado océano
  professional: [colors.secondary, colors.accent],         // Azul Marino a Petróleo
  
  // Gradientes de fondo
  background: [colors.background, colors.backgroundAlt],   // Blanco a gris claro
  surface: [colors.backgroundLight, colors.surface],       // Fondo claro
  
  // Gradientes glass effect con Homecare
  glassLight: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
  glassDark: ['rgba(0,27,56,0.2)', 'rgba(0,27,56,0.1)'],            // Azul Marino
  glassPrimary: ['rgba(73,192,188,0.2)', 'rgba(73,192,188,0.1)'],   // Turquesa
  glassSecondary: ['rgba(0,27,56,0.2)', 'rgba(0,27,56,0.1)'],       // Azul Marino
  glassAccent: ['rgba(14,77,104,0.2)', 'rgba(14,77,104,0.1)'],      // Azul Petróleo
  
  // Gradientes de analytics Homecare
  analytics: [colors.primary, colors.primaryLight],        // Turquesa
  earnings: [colors.primary, colors.accent],               // Turquesa a Petróleo
  rating: ['#FFB800', '#F59E0B'],                         // Dorado
  performance: [colors.accent, colors.primary],            // Petróleo a Turquesa
};

export const glowEffects = {
  primary: {
    shadowColor: colors.primary,      // Turquesa Fresco #49C0BC
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  secondary: {
    shadowColor: colors.secondary,    // Azul Marino Profundo #001B38
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  accent: {
    shadowColor: colors.accent,       // Azul Petróleo #0E4D68
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  soft: {
    shadowColor: colors.textDark,     // Azul Marino
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  turquoise: {
    shadowColor: colors.primary,      // Efecto resplandor turquesa
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
};