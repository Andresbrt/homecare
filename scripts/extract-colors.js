const fs = require('fs');
const path = require('path');

// Colores comunes a buscar en logos (primario, secundario, acentos)
// Basados en el manual de marca típico
const COMMON_BRAND_COLORS = {
  // Azules profesionales
  '#0066FF': 'Azul vibrante',
  '#0052CC': 'Azul oscuro',
  '#3385FF': 'Azul claro',
  '#0047B3': 'Azul alternativo',
  
  // Verdes
  '#00CC66': 'Verde éxito',
  '#34C759': 'Verde manzana',
  '#00B34D': 'Verde oscuro',
  
  // Naranjas
  '#FF6B00': 'Naranja vibrante',
  '#E55D00': 'Naranja oscuro',
  '#FF8533': 'Naranja claro',
  
  // Púrpuras
  '#6B5CE7': 'Púrpura premium',
  '#7C3AED': 'Púrpura vibrante',
  
  // Neutros
  '#FFFFFF': 'Blanco',
  '#000000': 'Negro',
  '#F5F5F5': 'Gris claro',
  '#333333': 'Gris oscuro',
};

console.log(`
╔════════════════════════════════════════════╗
║   EXTRACTOR DE COLORES DE LOGO             ║
║   Analizando: assets/Isotipo-principal.png ║
╚════════════════════════════════════════════╝
`);

console.log(`
📍 Colores típicos en logos de marca:

PRIMARIO: #HEX_COLOR
SECUNDARIO: #HEX_COLOR
ACENTO: #HEX_COLOR
FONDO: #FFFFFF (blanco) o #F5F5F5 (gris claro)

Visualmente:
1. Abre: mobile/assets/Isotipo-principal.png
2. Identifica los colores principales:
   - Color dominante (primario)
   - Segundo color (secundario)
   - Detalles/acentos
3. Extrae hex usando:
   - Herramienta online: https://imagecolorpicker.com
   - Adobe Color Picker
   - VS Code: extension "Color Picker"

Una vez tengas los HEX, puedo:
✅ Aplicarlos en app.config.js
✅ Sincronizar con src/theme/colors.js
✅ Usar en gradientes y componentes
✅ Probar en Expo inmediatamente
`);

console.log('\n📋 ESTRUCTURA RECOMENDADA EN .env:\n');
console.log('APP_PRIMARY_COLOR=#XXXXXX');
console.log('APP_ACCENT_COLOR=#XXXXXX');
console.log('APP_SECONDARY_COLOR=#XXXXXX');
console.log('APP_BACKGROUND_COLOR=#FFFFFF');
console.log('SPLASH_BACKGROUND_COLOR=#FFFFFF\n');

console.log('💡 GUÍA RÁPIDA PARA EXTRAER COLORES:\n');
console.log('1. Abre el PNG en un editor (VS Code, Photoshop, GIMP)');
console.log('2. Usa la herramienta de selector de color/eyedropper');
console.log('3. Copia el valor HEX de cada color diferente');
console.log('4. Envíame los valores como:\n');
console.log('   Primario: #XXXXXX (color dominante)');
console.log('   Secundario: #XXXXXX (segundo color)');
console.log('   Acento: #XXXXXX (detalles)');
console.log('   Fondo: #FFFFFF (si no es blanco)\n');
