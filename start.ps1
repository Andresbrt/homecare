Write-Host "=== viclean - Iniciando Proyecto ===" -ForegroundColor Cyan

# Verificar Java
if (-not (Get-Command 'java' -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Java no encontrado" -ForegroundColor Red
    exit 1
}

# Verificar Maven
if (-not (Get-Command 'mvn' -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Maven no encontrado" -ForegroundColor Red
    exit 1
}

# Verificar Node.js
if (-not (Get-Command 'node' -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "OK: Dependencias verificadas" -ForegroundColor Green

# Configurar variables
$Env:SPRING_PROFILES_ACTIVE = 'dev'

Write-Host ""
Write-Host "[1] Iniciando Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "' + $PSScriptRoot + '"; Write-Host "BACKEND VICLEAN - Puerto 8080" -ForegroundColor Green; mvn spring-boot:run'

Start-Sleep 5

Write-Host "[2] Iniciando Mobile..." -ForegroundColor Yellow
if (Test-Path (Join-Path $PSScriptRoot 'mobile')) {
    Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "' + (Join-Path $PSScriptRoot 'mobile') + '"; Write-Host "MOBILE VICLEAN - Expo" -ForegroundColor Green; npm install; npx expo start'
}

Start-Sleep 3

Write-Host "[3] Iniciando Frontend..." -ForegroundColor Yellow
if (Test-Path (Join-Path $PSScriptRoot 'frontend')) {
    Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "' + $PSScriptRoot + '"; Write-Host "FRONTEND VICLEAN - Puerto 3000" -ForegroundColor Green; npx http-server frontend -p 3000'
}

Write-Host ""
Write-Host "VICLEAN INICIADO CORRECTAMENTE" -ForegroundColor Green
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Cyan
Write-Host "  Backend:   http://localhost:8080" -ForegroundColor White
Write-Host "  Swagger:   http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C en cada ventana para detener servicios" -ForegroundColor Gray