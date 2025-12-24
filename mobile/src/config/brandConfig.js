/**
 * 🎨 CONFIGURACIÓN OFICIAL DE MARCA HOMECARE
 * Basado en el Manual de Marca oficial
 */

export const BRAND_CONFIG = {
  name: 'Homecare',
  tagline: 'Servicios de limpieza doméstica profesional',
  
  fonts: {
    primary: {
      name: 'Poppins',
      usage: 'Logo y títulos principales',
      fallback: 'Arial, sans-serif'
    },
    secondary: {
      name: 'Poppins',
      usage: 'Textos generales, UI, banners',
      weights: { regular: 400, medium: 500, semiBold: 600, bold: 700 }
    }
  },
  
  colors: {
    // Colores principales del manual de marca
    azulMarinoProfundo: {
      hex: '#001B38',
      rgb: 'rgb(0, 27, 56)',
      name: 'Azul Marino Profundo',
      usage: 'Color secundario, textos principales'
    },
    azulPetroleo: {
      hex: '#0E4D68',
      rgb: 'rgb(14, 77, 104)', 
      name: 'Azul Petróleo',
      usage: 'Color secundario complementario'
    },
    turquesaFresco: {
      hex: '#49C0BC',
      rgb: 'rgb(73, 192, 188)',
      name: 'Turquesa Fresco',
      usage: 'Color principal, botones principales'
    },
    
    // Colores de soporte
    blanco: {
      hex: '#FFFFFF',
      rgb: 'rgb(255, 255, 255)',
      name: 'Blanco',
      usage: 'Fondos, textos sobre colores oscuros'
    },
    grisClaro: {
      hex: '#F5F5F5',
      rgb: 'rgb(245, 245, 245)',
      name: 'Gris Claro',
      usage: 'Fondos secundarios'
    },
    grisMedio: {
      hex: '#CCCCCC',
      rgb: 'rgb(204, 204, 204)',
      name: 'Gris Medio',
      usage: 'Bordes, separadores'
    },
    grisOscuro: {
      hex: '#666666',
      rgb: 'rgb(102, 102, 102)',
      name: 'Gris Oscuro',
      usage: 'Textos secundarios'
    }
  },

  // Degradados corporativos
  gradients: {
    primary: `linear-gradient(135deg, #49C0BC 0%, #0E4D68 100%)`,
    secondary: `linear-gradient(45deg, #001B38 0%, #0E4D68 100%)`,
    subtle: `linear-gradient(180deg, #F5F5F5 0%, #FFFFFF 100%)`
  },

  // Sombras y efectos
  shadows: {
    small: '0 2px 4px rgba(0, 27, 56, 0.1)',
    medium: '0 4px 12px rgba(0, 27, 56, 0.15)',
    large: '0 8px 24px rgba(0, 27, 56, 0.2)',
    button: '0 4px 8px rgba(73, 192, 188, 0.3)'
  },

  // Espaciado y dimensiones
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },

  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    round: 50
  },

  // Configuración de animaciones
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800
  },

  // Configuración de tipografía
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      title: 28,
      hero: 32
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6
    }
  },

  // URLs y recursos (simulados para evitar errores)
  assets: {
    logo: {
      light: './assets/logo-light.png',
      dark: './assets/logo-dark.png'
    },
    icons: {
      broom: 'cleaning',
      star: 'star',
      shield: 'shield-checkmark',
      time: 'time'
    }
  },

  // Configuración de servicios
  services: {
    categories: [
      {
        id: 'limpieza_basica',
        name: 'Limpieza Básica',
        icon: 'home',
        color: '#49C0BC'
      },
      {
        id: 'limpieza_profunda',
        name: 'Limpieza Profunda', 
        icon: 'star',
        color: '#0E4D68'
      },
      {
        id: 'limpieza_oficinas',
        name: 'Oficinas',
        icon: 'business',
        color: '#001B38'
      }
    ]
  }
};

// Función helper para obtener colores
export const getColor = (colorName) => {
  return BRAND_CONFIG.colors[colorName]?.hex || '#000000';
};

// Función helper para obtener fuentes
export const getFont = (fontType = 'primary') => {
  return BRAND_CONFIG.fonts[fontType]?.name || 'Arial';
};

// Función helper para obtener espaciado
export const getSpacing = (size = 'md') => {
  return BRAND_CONFIG.spacing[size] || 16;
};

// Estilos predefinidos para componentes comunes
export const COMPONENT_STYLES = {
  button: {
    primary: {
      backgroundColor: getColor('turquesaFresco'),
      color: getColor('blanco'),
      borderRadius: BRAND_CONFIG.borderRadius.medium,
      paddingHorizontal: getSpacing('lg'),
      paddingVertical: getSpacing('sm'),
      shadowColor: BRAND_CONFIG.colors.turquesaFresco.hex,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3
    },
    secondary: {
      backgroundColor: 'transparent',
      color: getColor('turquesaFresco'),
      borderColor: getColor('turquesaFresco'),
      borderWidth: 2,
      borderRadius: BRAND_CONFIG.borderRadius.medium,
      paddingHorizontal: getSpacing('lg'),
      paddingVertical: getSpacing('sm')
    }
  },
  
  card: {
    backgroundColor: getColor('blanco'),
    borderRadius: BRAND_CONFIG.borderRadius.large,
    shadowColor: BRAND_CONFIG.colors.azulMarinoProfundo.hex,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    padding: getSpacing('md')
  },

  text: {
    title: {
      fontFamily: getFont('primary'),
      fontSize: BRAND_CONFIG.typography.sizes.title,
      fontWeight: '700',
      color: getColor('azulMarinoProfundo'),
      lineHeight: BRAND_CONFIG.typography.lineHeights.tight
    },
    subtitle: {
      fontFamily: getFont('secondary'),
      fontSize: BRAND_CONFIG.typography.sizes.lg,
      fontWeight: '600',
      color: getColor('azulPetroleo'),
      lineHeight: BRAND_CONFIG.typography.lineHeights.normal
    },
    body: {
      fontFamily: getFont('secondary'),
      fontSize: BRAND_CONFIG.typography.sizes.md,
      fontWeight: '400',
      color: getColor('grisOscuro'),
      lineHeight: BRAND_CONFIG.typography.lineHeights.relaxed
    }
  }
};

export default BRAND_CONFIG;