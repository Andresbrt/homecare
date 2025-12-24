# ======================================
# 🚀 viclean - Inicialización Completa (simplificada)
# ======================================
# Arranca Backend + Frontend (estático) + Mobile (Expo) con un comando.

param(
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [switch]$SkipMobile,
    [switch]$SkipDatabase,
    [switch]$Clean
)

$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot

function Stop-PortIfListening {
    param([int[]]$Ports)
    foreach ($p in $Ports) {
        $conn = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
        if ($conn) {
            Write-Host "  → Cerrando puerto $p (PID $($conn.OwningProcess))" -ForegroundColor DarkGray
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
}

function Ensure-Command {
    param([string]$Cmd, [string]$Label)
    if (-not (Get-Command $Cmd -ErrorAction SilentlyContinue)) {
        Write-Host "✗ Falta $Label ($Cmd)" -ForegroundColor Red
        throw "Dependencia faltante: $Label ($Cmd)"
    }
    Write-Host "✓ $Label" -ForegroundColor Green
}

Write-Host "=== viclean - inicio full stack ===" -ForegroundColor Cyan

if ($Clean) {
    Write-Host "[CLEAN] Limpiando puertos 8080,3000,8081,8082,8083,19000-19002" -ForegroundColor Yellow
    Stop-PortIfListening -Ports @(8080,3000,8081,8082,8083,19000,19001,19002)
}

Write-Host "[CHECK] Dependencias" -ForegroundColor Yellow
Ensure-Command -Cmd 'java' -Label 'Java'
Ensure-Command -Cmd 'mvn' -Label 'Maven'
Ensure-Command -Cmd 'node' -Label 'Node.js'
Ensure-Command -Cmd 'npm' -Label 'npm'

# DB aviso
if (-not $SkipDatabase) {
    $dbUp = Get-NetTCPConnection -LocalPort 5432 -State Listen -ErrorAction SilentlyContinue -or 
            Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue
    if (-not $dbUp) {
        Write-Host "[DB] No hay PostgreSQL/MySQL detectado; dev usará H2." -ForegroundColor DarkGray
    }
}

# Vars dummy para Wompi en dev
if (-not $Env:WOMPI_PUBLIC_KEY) { $Env:WOMPI_PUBLIC_KEY = 'dummy' }
if (-not $Env:WOMPI_PRIVATE_KEY) { $Env:WOMPI_PRIVATE_KEY = 'dummy' }
if (-not $Env:WOMPI_EVENTS_SECRET) { $Env:WOMPI_EVENTS_SECRET = 'dummy' }
if (-not $Env:WOMPI_API_BASE) { $Env:WOMPI_API_BASE = 'https://sandbox.wompi.co/v1' }
$Env:SPRING_PROFILES_ACTIVE = 'dev'

# Backend
if (-not $SkipBackend) {
    Write-Host "[BACKEND] mvn spring-boot:run (perfil dev, puerto 8081)" -ForegroundColor Yellow
    $backendPath = $projectRoot
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-Command',
        "cd '$backendPath'; mvn spring-boot:run"
    ) -WindowStyle Normal
}

# Frontend estático (http-server)
if (-not $SkipFrontend) {
    $frontendPath = Join-Path $projectRoot 'frontend'
    if (Test-Path $frontendPath) {
        Write-Host "[FRONTEND] sirviendo estático en http://localhost:3000" -ForegroundColor Yellow
        Start-Process powershell -ArgumentList @(
            '-NoExit',
            '-Command',
            "cd '$projectRoot'; npx http-server frontend -p 3000"
        ) -WindowStyle Normal
    } else {
        Write-Host "[FRONTEND] carpeta 'frontend' no encontrada, se omite" -ForegroundColor DarkGray
    }
}

# Mobile Expo
if (-not $SkipMobile) {
    $mobilePath = Join-Path $projectRoot 'mobile'
    if (Test-Path $mobilePath) {
        Write-Host "[MOBILE] Expo en puerto 8083 (alternativo)" -ForegroundColor Yellow
        Start-Process powershell -ArgumentList @(
            '-NoExit',
            '-Command',
            "cd '$mobilePath'; npm install --legacy-peer-deps; npx expo start --port 8083"
        ) -WindowStyle Normal
    } else {
        Write-Host "[MOBILE] carpeta 'mobile' no encontrada, se omite" -ForegroundColor DarkGray
    }
}

Write-Host "[OK] Servicios lanzados (usa Ctrl+C en cada ventana para parar)." -ForegroundColor Green
