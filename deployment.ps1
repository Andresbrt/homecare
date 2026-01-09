# deployment.ps1 - Script automatizado para deployment de Home Care en Windows

param(
    [string]$Environment = "production",
    [switch]$SkipBackup = $false,
    [switch]$DryRun = $false
)

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$logFile = Join-Path $scriptPath "deployment.log"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Funciones de logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $logMessage = "[$timestamp] [$Level] $Message"
    Add-Content $logFile $logMessage
    
    switch ($Level) {
        "SUCCESS" { Write-Host "✅ $Message" -ForegroundColor Green }
        "ERROR" { Write-Host "❌ $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "⚠️  $Message" -ForegroundColor Yellow }
        "INFO" { Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
        default { Write-Host $Message }
    }
}

function Check-Requirements {
    Write-Log "Verificando requisitos..." "INFO"
    
    $requirements = @("docker", "docker-compose")
    foreach ($req in $requirements) {
        $cmd = Get-Command $req -ErrorAction SilentlyContinue
        if (-not $cmd) {
            Write-Log "$req no está instalado" "ERROR"
            exit 1
        }
        Write-Log "$req instalado" "SUCCESS"
    }
    
    if (-not (Test-Path "$scriptPath\.env")) {
        Write-Log ".env no encontrado. Ejecuta: Copy-Item .env.example .env" "ERROR"
        exit 1
    }
    Write-Log ".env encontrado" "SUCCESS"
}

function Validate-Env {
    Write-Log "Validando archivo .env..." "INFO"
    
    $requiredVars = @("DB_PASSWORD", "JWT_SECRET", "SPRING_PROFILES_ACTIVE")
    
    foreach ($var in $requiredVars) {
        $content = Get-Content "$scriptPath\.env"
        if (-not ($content | Select-String "^$var=")) {
            Write-Log "Variable $var no encontrada en .env" "ERROR"
            exit 1
        }
    }
    
    Write-Log "Variables de entorno validadas" "SUCCESS"
}

function Update-Code {
    Write-Log "Actualizando código..." "INFO"
    
    Push-Location $scriptPath
    git pull origin main 2>$null | Out-Null
    Pop-Location
    
    Write-Log "Código actualizado" "SUCCESS"
}

function Backup-Database {
    if ($SkipBackup) {
        Write-Log "Backup saltado (--SkipBackup)" "WARNING"
        return
    }
    
    Write-Log "Creando backup de base de datos..." "INFO"
    
    try {
        $backupDir = Join-Path $scriptPath "backups"
        if (-not (Test-Path $backupDir)) {
            New-Item -ItemType Directory -Path $backupDir | Out-Null
        }
        
        $backupFile = Join-Path $backupDir "database_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
        
        $running = docker ps --filter "name=viclean-db" --filter "status=running" | Select-Object -Skip 1
        if ($running) {
            docker exec viclean-db pg_dump -U viclean_user viclean > $backupFile 2>$null
            Write-Log "Backup creado: $backupFile" "SUCCESS"
        } else {
            Write-Log "BD no está corriendo, saltando backup" "WARNING"
        }
    } catch {
        Write-Log "Error en backup: $_" "WARNING"
    }
}

function Stop-Services {
    Write-Log "Deteniendo servicios previos..." "INFO"
    
    Push-Location $scriptPath
    docker-compose down 2>$null | Out-Null
    Pop-Location
    
    Write-Log "Servicios detenidos" "SUCCESS"
}

function Build-Images {
    Write-Log "Construyendo imágenes Docker..." "INFO"
    
    Push-Location $scriptPath
    docker-compose build --no-cache backend
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Error construyendo imagen backend" "ERROR"
        exit 1
    }
    Pop-Location
    
    Write-Log "Imágenes construidas" "SUCCESS"
}

function Start-Services {
    Write-Log "Iniciando servicios..." "INFO"
    
    Push-Location $scriptPath
    docker-compose up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Error iniciando servicios" "ERROR"
        exit 1
    }
    Pop-Location
    
    Write-Log "Servicios iniciados" "SUCCESS"
}

function Wait-ForServices {
    Write-Log "Esperando a que servicios estén listos..." "INFO"
    
    # Esperar BD
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        try {
            docker exec viclean-db pg_isready -U viclean_user -d viclean 2>$null | Out-Null
            if ($?) {
                Write-Log "Base de datos lista" "SUCCESS"
                $ready = $true
                break
            }
        } catch { }
        Start-Sleep -Seconds 2
    }
    
    if (-not $ready) {
        Write-Log "Base de datos no respondió" "ERROR"
        exit 1
    }
    
    # Esperar Backend
    Start-Sleep -Seconds 10
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Log "Backend listo" "SUCCESS"
                $ready = $true
                break
            }
        } catch { }
        Start-Sleep -Seconds 2
    }
    
    if (-not $ready) {
        Write-Log "Backend no respondió" "ERROR"
        exit 1
    }
}

function Health-Check {
    Write-Log "Verificando salud de servicios..." "INFO"
    
    Push-Location $scriptPath
    
    # Estado de contenedores
    $status = docker-compose ps
    if (-not ($status | Select-String "Up")) {
        Write-Log "Algunos servicios no están corriendo" "ERROR"
        Write-Host $status
        exit 1
    }
    
    # Health check backend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -ErrorAction SilentlyContinue
        if ($response.Content -match '"status":"UP"') {
            Write-Log "Backend saludable" "SUCCESS"
        } else {
            Write-Log "Backend no saludable" "ERROR"
            exit 1
        }
    } catch {
        Write-Log "Error checking backend health: $_" "ERROR"
        exit 1
    }
    
    Pop-Location
}

function Show-Info {
    Write-Log "Deployment completado" "SUCCESS"
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  🌍 DEPLOYMENT COMPLETADO" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  Ambiente: $Environment"
    Write-Host "  Backend:  http://localhost:8080"
    Write-Host "  API:      http://localhost:8080/api"
    Write-Host "  WebSocket: ws://localhost:8080/ws"
    Write-Host "  Health:   http://localhost:8080/actuator/health"
    Write-Host ""
    Write-Host "  Comandos útiles:"
    Write-Host "  • Ver logs:      docker-compose logs -f"
    Write-Host "  • Detener:       docker-compose down"
    Write-Host "  • Reiniciar:     docker-compose restart"
    Write-Host ""
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
}

function Invoke-Deployment {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  🚀 HOME CARE DEPLOYMENT SCRIPT            ║" -ForegroundColor Cyan
    Write-Host "║  Ambiente: $Environment                       ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    
    if ($DryRun) {
        Write-Log "Ejecutando en modo DRY RUN (sin cambios)" "WARNING"
    }
    
    Check-Requirements
    Validate-Env
    Update-Code
    
    if (-not $DryRun) {
        Backup-Database
        Stop-Services
        Build-Images
        Start-Services
        Wait-ForServices
        Health-Check
        Show-Info
    }
}

# Ejecutar
$ErrorActionPreference = "Stop"
try {
    Invoke-Deployment
} catch {
    Write-Log "Script fallido: $_" "ERROR"
    exit 1
}
