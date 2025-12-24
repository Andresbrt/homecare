Param(
  [string]$BaseUrl = "http://localhost:8080/api",
  [string]$Email = "test@viclean.com",
  [string]$Password = "Secret123"
)

Write-Host "=== viclean Backend Smoke Tests ===" -ForegroundColor Cyan

function Invoke-JsonPost {
  Param(
    [string]$Url,
    [hashtable]$Body,
    [string]$Token
  )
  $headers = @{ 'Content-Type' = 'application/json' }
  if ($Token) { $headers['Authorization'] = "Bearer $Token" }
  $json = ($Body | ConvertTo-Json -Depth 4)
  try {
    Invoke-RestMethod -Method Post -Uri $Url -Headers $headers -Body $json
  } catch {
    Write-Warning "POST $Url fallo: $($_.Exception.Message)"; return $null
  }
}

function Invoke-JsonGet {
  Param(
    [string]$Url,
    [string]$Token
  )
  $headers = @{}
  if ($Token) { $headers['Authorization'] = "Bearer $Token" }
  try {
    Invoke-RestMethod -Method Get -Uri $Url -Headers $headers
  } catch {
    Write-Warning "GET $Url fallo: $($_.Exception.Message)"; return $null
  }
}

# 1. Login para obtener token
$loginResp = Invoke-JsonPost -Url "$BaseUrl/auth/login" -Body @{ email=$Email; password=$Password } -Token $null
if (-not $loginResp) { Write-Error "Login falló. Abortando."; exit 1 }
$token = $loginResp.token
Write-Host "Token obtenido (truncado): $($token.Substring(0,20))..." -ForegroundColor Green

# 2. Servicios
$services = Invoke-JsonGet -Url "$BaseUrl/services" -Token $token
if ($services) { Write-Host "Servicios recibidos: $($services.Count)" }

# 3. Crear booking (serviceId=1 ajustar si no existe)
$scheduled = (Get-Date).AddDays(1).ToString('yyyy-MM-ddTHH:mm:ss')
$bookingResp = Invoke-JsonPost -Url "$BaseUrl/bookings" -Body @{ serviceId=1; scheduledDate=$scheduled } -Token $token
if ($bookingResp) { Write-Host "Booking creado ID: $($bookingResp.id)" -ForegroundColor Green }
$bookingId = $bookingResp.id

# 4. Cambiar estado booking -> IN_PROGRESS
if ($bookingId) {
  $statusUrl = "$BaseUrl/bookings/$bookingId/status?status=IN_PROGRESS"
  $statusResp = Invoke-JsonPut -Url $statusUrl -Token $token
}

function Invoke-JsonPut {
  Param(
    [string]$Url,
    [string]$Token,
    [hashtable]$Body
  )
  $headers = @{ 'Content-Type' = 'application/json' }
  if ($Token) { $headers['Authorization'] = "Bearer $Token" }
  try {
    if ($Body) { 
      $json = ($Body | ConvertTo-Json -Depth 4)
      Invoke-RestMethod -Method Put -Uri $Url -Headers $headers -Body $json 
    } else { 
      Invoke-RestMethod -Method Put -Uri $Url -Headers $headers 
    }
  } catch {
    Write-Warning "PUT $Url fallo: $($_.Exception.Message)"; return $null
  }
}

if ($bookingId) {
  $statusResp = Invoke-JsonPut -Url "$BaseUrl/bookings/$bookingId/status?status=IN_PROGRESS" -Token $token
  if ($statusResp) { Write-Host "Booking $bookingId ahora IN_PROGRESS" -ForegroundColor Green }
}

# 5. Pago
if ($bookingId) {
  $paymentResp = Invoke-JsonPost -Url "$BaseUrl/payments/process" -Body @{ bookingId=$bookingId; method='CARD' } -Token $token
  if ($paymentResp) { Write-Host "Pago procesado ID: $($paymentResp.id)" -ForegroundColor Green }
}

# 6. Listar pagos del usuario
$payments = Invoke-JsonGet -Url "$BaseUrl/payments/user" -Token $token
if ($payments) { Write-Host "Pagos usuario: $($payments.Count)" }

# 7. Cambiar rol de usuario
$userId = $loginResp.user.id
if ($userId) {
  $newRole = if ($loginResp.user.role -eq 'CUSTOMER') { 'SERVICE_PROVIDER' } else { 'CUSTOMER' }
  $roleResp = Invoke-JsonPut -Url "$BaseUrl/auth/update-role/$userId" -Body @{ role=$newRole } -Token $token
  if ($roleResp) { Write-Host "Rol actualizado a: $($roleResp.role)" -ForegroundColor Green }
}

Write-Host "=== Fin smoke tests ===" -ForegroundColor Cyan

<#
Uso:
  powershell -ExecutionPolicy Bypass -File .\test_endpoints.ps1 -BaseUrl "http://localhost:8080/api" -Email "correo@viclean.com" -Password "Secret123"
Ajustar serviceId y credenciales según datos reales.
#>
