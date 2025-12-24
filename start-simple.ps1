# ======================================
# 🚀 viclean - Inicialización Simplificada
# ======================================

param(
    [switch]$Clean
)

$ErrorActionPreference = 'Continue'

function Stop-PortIfListening {
    param([int[]]$Ports)
    foreach ($p in $Ports) {
        try {
            $conn = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
            if ($conn) {
                Write-Host "  → Cerrando puerto $p (PID $($conn.OwningProcess))" -ForegroundColor DarkGray
                Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            }
        } catch {
            # Continuar si hay error
        }
    }
}

function Test-Command {
    param([string]$Cmd, [string]$Label)
    if (-not (Get-Command $Cmd -ErrorAction SilentlyContinue)) {
        Write-Host "✗ Falta $Label ($Cmd)" -ForegroundColor Red
        return $false
    }
    Write-Host "✓ $Label disponible" -ForegroundColor Green
    return $true
}

Write-Host "=== 🚀 viclean - Iniciando Stack Completo ===" -ForegroundColor Cyan

if ($Clean) {
    Write-Host "[CLEAN] Limpiando puertos ocupados..." -ForegroundColor Yellow
    Stop-PortIfListening -Ports @(8080, 3000, 8081, 8083, 19000, 19001, 19002)
    Start-Sleep 2
}

Write-Host "[CHECK] Verificando dependencias..." -ForegroundColor Yellow
$javaOk = Test-Command -Cmd 'java' -Label 'Java'
$mavenOk = Test-Command -Cmd 'mvn' -Label 'Maven'
$nodeOk = Test-Command -Cmd 'node' -Label 'Node.js'
$npmOk = Test-Command -Cmd 'npm' -Label 'npm'

if (-not ($javaOk -and $mavenOk)) {
    Write-Host "❌ Faltan dependencias críticas para el backend" -ForegroundColor Red
    exit 1
}

if (-not ($nodeOk -and $npmOk)) {
    Write-Host "❌ Faltan dependencias para el frontend/mobile" -ForegroundColor Red
    exit 1
}

# Configurar variables de entorno para desarrollo
$Env:SPRING_PROFILES_ACTIVE = 'dev'
$Env:WOMPI_PUBLIC_KEY = 'pub_test_dummy'
$Env:WOMPI_PRIVATE_KEY = 'prv_test_dummy'
$Env:WOMPI_EVENTS_SECRET = 'test_secret'

Write-Host ""
Write-Host "🔥 [1/3] Iniciando Backend (Spring Boot)..." -ForegroundColor Yellow
try {
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-Command', 
        'cd "' + $PSScriptRoot + '"; Write-Host "=== BACKEND viclean - Puerto 8080 ===" -ForegroundColor Green; mvn spring-boot:run -Dspring-boot.run.profiles=dev'
    ) -WindowStyle Normal
    Write-Host "✓ Backend iniciando en http://localhost:8080" -ForegroundColor Green
} catch {
    Write-Host "❌ Error iniciando backend: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep 3

Write-Host "📱 [2/3] Iniciando Mobile App (Expo)..." -ForegroundColor Yellow
$mobilePath = Join-Path $PSScriptRoot 'mobile'
if (Test-Path $mobilePath) {
    try {
        Start-Process powershell -ArgumentList @(
            '-NoExit',
            '-Command',
            'cd "' + $mobilePath + '"; Write-Host "=== MOBILE viclean - Expo ===" -ForegroundColor Green; npm install --legacy-peer-deps; npx expo start'
        ) -WindowStyle Normal
        Write-Host "✓ Mobile app iniciando (Expo DevTools)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error iniciando mobile: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Carpeta 'mobile' no encontrada" -ForegroundColor DarkYellow
}

Start-Sleep 2

Write-Host "🌐 [3/3] Iniciando Frontend Web..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot 'frontend'
if (Test-Path $frontendPath) {
    try {
        # Verificar si http-server está disponible, si no, instalarlo
        if (-not (Get-Command 'http-server' -ErrorAction SilentlyContinue)) {
            Write-Host "  → Instalando http-server..." -ForegroundColor DarkGray
            npm install -g http-server
        }
        
        Start-Process powershell -ArgumentList @(
            '-NoExit',
            '-Command',
            'cd "' + $PSScriptRoot + '"; Write-Host "=== FRONTEND viclean - Puerto 3000 ===" -ForegroundColor Green; npx http-server frontend -p 3000 -o'
        ) -WindowStyle Normal
        Write-Host "✓ Frontend iniciando en http://localhost:3000" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error iniciando frontend: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Carpeta 'frontend' no encontrada" -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "🎉 ¡Stack viclean iniciado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 URLs disponibles:" -ForegroundColor Cyan
Write-Host "  🔥 Backend API:    http://localhost:8080" -ForegroundColor White
Write-Host "  📖 Swagger Docs:  http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "  🌐 Frontend Web:  http://localhost:3000" -ForegroundColor White
Write-Host "  📱 Mobile Expo:   Abrirá automáticamente" -ForegroundColor White
Write-Host ""
Write-Host "💡 Usa Ctrl+C en cada ventana para detener los servicios" -ForegroundColor DarkGray
Write-Host "🔍 Ejecuta '.\check-status.ps1' para verificar el estado" -ForegroundColor DarkGray