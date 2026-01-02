# ============================================
# viclean - Verificar Estado de Servicios
# ============================================
# Script para verificar que servicios estan corriendo

Write-Host @"
================================================
     viclean - Estado de Servicios
================================================
"@ -ForegroundColor Cyan

$services = @{
    '8080' = 'Backend API (Spring Boot)'
    '3000' = 'Frontend Web'
    '8081' = 'Mobile Expo Metro'
    '19000' = 'Expo DevTools'
    '19001' = 'Expo DevTools (iOS)'
    '19002' = 'Expo DevTools (Web)'
    '5432' = 'PostgreSQL Database'
    '3306' = 'MySQL Database'
}

Write-Host "`n[PUERTOS] Verificando servicios en puertos...`n" -ForegroundColor Yellow

$running = @()
$stopped = @()

foreach ($port in $services.Keys | Sort-Object) {
    $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    
    if ($connection) {
        $processId = $connection.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        $processName = if ($process) { $process.Name } else { "Unknown" }
        
        Write-Host "  [OK] Puerto $port : $($services[$port])" -ForegroundColor Green
        Write-Host "       PID: $processId | Proceso: $processName" -ForegroundColor DarkGray
        
        $running += @{
            Port = $port
            Service = $services[$port]
            PID = $processId
            Process = $processName
        }
    } else {
        Write-Host "  [X]  Puerto $port : $($services[$port]) - DETENIDO" -ForegroundColor Red
        $stopped += $services[$port]
    }
}

# ============================================
# RESUMEN
# ============================================
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "              RESUMEN" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

Write-Host "  Servicios activos:   $($running.Count)" -ForegroundColor Green
Write-Host "  Servicios detenidos: $($stopped.Count)" -ForegroundColor Red

# ============================================
# URLs DISPONIBLES
# ============================================
if ($running.Count -gt 0) {
    Write-Host "`n================================================" -ForegroundColor Cyan
    Write-Host "          URLS DISPONIBLES" -ForegroundColor Cyan
    Write-Host "================================================`n" -ForegroundColor Cyan
    
    foreach ($svc in $running) {
        switch ($svc.Port) {
            '8080' { 
                Write-Host "  Backend API:     http://localhost:8080" -ForegroundColor White
                Write-Host "  Swagger Docs:    http://localhost:8080/swagger-ui.html" -ForegroundColor DarkGray
                Write-Host "  Health Check:    http://localhost:8080/actuator/health" -ForegroundColor DarkGray
            }
            '3000' { 
                Write-Host "  Frontend Web:    http://localhost:3000" -ForegroundColor White
            }
            '8081' { 
                Write-Host "  Expo Metro:      http://localhost:8081" -ForegroundColor White
            }
            '19002' { 
                Write-Host "  Expo DevTools:   http://localhost:19002" -ForegroundColor White
            }
            '5432' { 
                Write-Host "  PostgreSQL:      localhost:5432" -ForegroundColor White
            }
        }
    }
}

# ============================================
# SUGERENCIAS
# ============================================
if ($stopped.Count -gt 0) {
    Write-Host "`n================================================" -ForegroundColor Yellow
    Write-Host "           SUGERENCIAS" -ForegroundColor Yellow
    Write-Host "================================================`n" -ForegroundColor Yellow
    
    Write-Host "  Para iniciar todos los servicios:" -ForegroundColor White
    Write-Host "    .\start-dev.ps1`n" -ForegroundColor Cyan
    
    if ($stopped -contains 'Backend API (Spring Boot)') {
        Write-Host "  Para iniciar solo backend:" -ForegroundColor White
        Write-Host "    mvn spring-boot:run`n" -ForegroundColor Cyan
    }
    
    if ($stopped -match 'Mobile Expo Metro') {
        Write-Host "  Para iniciar solo mobile:" -ForegroundColor White
        Write-Host "    cd mobile; npx expo start`n" -ForegroundColor Cyan
    }
}

# ============================================
# VERIFICAR DOCKER (OPCIONAL)
# ============================================
Write-Host "`n[DOCKER] Verificando contenedores...`n" -ForegroundColor Yellow

try {
    $dockerRunning = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>$null
    
    if ($dockerRunning) {
        Write-Host $dockerRunning -ForegroundColor White
    } else {
        Write-Host "  No hay contenedores Docker corriendo" -ForegroundColor DarkGray
    }
} catch {
    Write-Host "  Docker no esta instalado o no esta corriendo" -ForegroundColor DarkGray
}

Write-Host "`n================================================`n" -ForegroundColor Cyan
