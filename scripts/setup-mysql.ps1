# Requires elevated PowerShell (Run as Administrator)
# Installs MySQL, creates databases and users for CleanHome

$ErrorActionPreference = 'Stop'

function Ensure-Admin {
  $currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($currentIdentity)
  if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host 'Reejecutando con privilegios de administrador...' -ForegroundColor Yellow
    Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
  }
}

function Try-Install-MySql {
  try {
    Write-Host 'Intentando instalar MySQL con winget...' -ForegroundColor Cyan
    winget install --id Oracle.MySQL -e --silent
    return $true
  } catch {
    Write-Warning 'winget no pudo instalar MySQL. Intentando con Chocolatey...'
    try {
      choco install mysql -y
      return $true
    } catch {
      Write-Error 'No fue posible instalar MySQL automáticamente. Instala manualmente desde https://dev.mysql.com/downloads/installer/'
      return $false
    }
  }
}

function Ensure-MySql-Service {
  try {
    $svc = Get-Service -Name 'MySQL*' -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($null -ne $svc) {
      if ($svc.Status -ne 'Running') { Start-Service $svc.Name }
      return $true
    }
  } catch {}
  return $false
}

function Init-Db {
  param(
    [string]$RootPassword = 'root'
  )
  Write-Host 'Creando bases de datos y usuario...' -ForegroundColor Cyan
  $sql = @"
CREATE DATABASE IF NOT EXISTS cleanhome_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS cleanhome_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'cleanhome_user'@'%' IDENTIFIED BY 'cleanhome_password';
GRANT ALL PRIVILEGES ON cleanhome_db.* TO 'cleanhome_user'@'%';
FLUSH PRIVILEGES;
"@
  $cmd = "mysql -uroot -p$RootPassword -e `"$sql`""
  cmd /c $cmd
}

Ensure-Admin

if (-not (Ensure-MySql-Service)) {
  if (-not (Try-Install-MySql)) { exit 1 }
}

# Intentar contraseñas comunes para root y permitir override
$rootCandidates = @('root','')
foreach ($pwd in $rootCandidates) {
  try {
    Init-Db -RootPassword $pwd
    Write-Host 'MySQL preparado correctamente.' -ForegroundColor Green
    exit 0
  } catch {
    Write-Warning "No se pudo autenticar con root:'$pwd'"
  }
}

Write-Warning 'No se pudo inicializar MySQL automáticamente. Abre MySQL Workbench/CLI y crea las DBs manualmente.'
exit 2
