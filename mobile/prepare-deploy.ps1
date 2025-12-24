# Script de Preparación para Publicación en Play Store
# Ejecuta este script antes de compilar

Write-Host "🚀 Preparando CleanHome para publicación..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Debes ejecutar este script desde la carpeta 'mobile'" -ForegroundColor Red
    exit 1
}

# 1. Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# 2. Verificar que EAS CLI esté instalado
Write-Host ""
Write-Host "🔧 Verificando EAS CLI..." -ForegroundColor Yellow
if (-not (Get-Command eas -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  EAS CLI no está instalado. Instalando..." -ForegroundColor Yellow
    npm install -g eas-cli
} else {
    Write-Host "✅ EAS CLI ya está instalado" -ForegroundColor Green
}

# 3. Verificar assets
Write-Host ""
Write-Host "🎨 Verificando assets requeridos..." -ForegroundColor Yellow
$requiredAssets = @(
    "assets/icon.png",
    "assets/adaptive-icon.png",
    "assets/splash-icon.png"
)

$missingAssets = @()
foreach ($asset in $requiredAssets) {
    if (-not (Test-Path $asset)) {
        $missingAssets += $asset
        Write-Host "  ⚠️  Falta: $asset" -ForegroundColor Red
    } else {
        Write-Host "  ✅ Encontrado: $asset" -ForegroundColor Green
    }
}

# 4. Resumen
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 RESUMEN DE PREPARACIÓN" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($missingAssets.Count -eq 0) {
    Write-Host "✅ Todos los assets están presentes" -ForegroundColor Green
} else {
    Write-Host "⚠️  Faltan $($missingAssets.Count) assets:" -ForegroundColor Yellow
    foreach ($asset in $missingAssets) {
        Write-Host "   - $asset" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "💡 Crea estos archivos antes de continuar:" -ForegroundColor Cyan
    Write-Host "   • icon.png: 1024x1024px" -ForegroundColor White
    Write-Host "   • adaptive-icon.png: 1024x1024px" -ForegroundColor White
    Write-Host "   • splash-icon.png: 2048x2048px" -ForegroundColor White
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📝 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Crear cuenta en Expo (si no tienes):" -ForegroundColor Yellow
Write-Host "   eas login" -ForegroundColor White
Write-Host ""
Write-Host "2. Inicializar proyecto:" -ForegroundColor Yellow
Write-Host "   eas init" -ForegroundColor White
Write-Host ""
Write-Host "3. Compilar APK de prueba:" -ForegroundColor Yellow
Write-Host "   eas build --platform android --profile preview" -ForegroundColor White
Write-Host ""
Write-Host "4. Compilar AAB para Play Store:" -ForegroundColor Yellow
Write-Host "   eas build --platform android --profile production" -ForegroundColor White
Write-Host ""
Write-Host "5. Enviar a Play Store:" -ForegroundColor Yellow
Write-Host "   eas submit --platform android --profile production" -ForegroundColor White
Write-Host ""
Write-Host "📖 Consulta PLAY_STORE_DEPLOYMENT.md para guía completa" -ForegroundColor Cyan
Write-Host ""
