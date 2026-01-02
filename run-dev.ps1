# Homecare Dev Runner
# Runs backend (Spring Boot) and mobile (Expo) in separate windows with Wompi sandbox vars

param(
  [string]$WompiPublicKey = "pub_test_XXXXXXXX",
  [string]$WompiPrivateKey = "prv_test_XXXXXXXX",
  [string]$WompiEventsSecret = "evt_test_XXXXXXXX"
)

Write-Host "Starting Homecare dev environment..." -ForegroundColor Cyan

# Backend window
$backendScript = @"
$env:WOMPI_PUBLIC_KEY='$WompiPublicKey'
$env:WOMPI_PRIVATE_KEY='$WompiPrivateKey'
$env:WOMPI_EVENTS_SECRET='$WompiEventsSecret'
Set-Location "c:\Users\ANDRES\OneDrive\Desktop\andres rico"
mvn clean package
mvn spring-boot:run
"@

Start-Process powershell -ArgumentList "-NoExit","-Command", $backendScript

Start-Sleep -Seconds 5

# Mobile window
$mobileScript = @"
Set-Location "c:\Users\ANDRES\OneDrive\Desktop\andres rico\mobile"
if (Test-Path package.json) { npm install }
npx expo start
"@

Start-Process powershell -ArgumentList "-NoExit","-Command", $mobileScript

Write-Host "Homecare dev environment launch commands issued." -ForegroundColor Green
