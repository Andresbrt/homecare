Write-Host "=== 🚀 viclean - Iniciando Proyecto ===" -ForegroundColor Cyan

# Verificar dependencias básicas
Write-Host "[1] Verificando dependencias..." -ForegroundColor Yellow

if (-not (Get-Command 'java' -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Java no encontrado. Instala Java 17 o superior." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command 'mvn' -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Maven no encontrado. Instala Maven." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command 'node' -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no encontrado. Instala Node.js." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Todas las dependencias están disponibles" -ForegroundColor Green

# Configurar variables de entorno
$Env:SPRING_PROFILES_ACTIVE = 'dev'

Write-Host ""
Write-Host "[2] 🔥 Iniciando Backend (Spring Boot)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "' + $PSScriptRoot + '"; Write-Host "=== BACKEND VICLEAN - Puerto 8080 ===" -ForegroundColor Green; mvn spring-boot:run'

Start-Sleep 5

Write-Host "[3] 📱 Iniciando Mobile App (Expo)..." -ForegroundColor Yellow
if (Test-Path (Join-Path $PSScriptRoot 'mobile')) {
    Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "' + (Join-Path $PSScriptRoot 'mobile') + '"; Write-Host "=== MOBILE VICLEAN - Expo ===" -ForegroundColor Green; npm install; npx expo start'
}

Start-Sleep 3

Write-Host "[4] 🌐 Iniciando Frontend Web..." -ForegroundColor Yellow
if (Test-Path (Join-Path $PSScriptRoot 'frontend')) {
    Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "' + $PSScriptRoot + '"; Write-Host "=== FRONTEND VICLEAN - Puerto 3000 ===" -ForegroundColor Green; npx http-server frontend -p 3000'
}

Write-Host ""
Write-Host "🎉 ¡viclean iniciado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 URLs:" -ForegroundColor Cyan
Write-Host "  🔥 Backend:   http://localhost:8080" -ForegroundColor White
Write-Host "  📖 Swagger:  http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "  🌐 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Presiona Ctrl+C en cada ventana para detener" -ForegroundColor Gray