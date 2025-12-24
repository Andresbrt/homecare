# Runs Spring Boot on port 8081 and dev profile
$ErrorActionPreference = 'Stop'

$env:SPRING_PROFILES_ACTIVE = 'dev'
$env:SERVER_PORT = '8081'

Set-Location "$PSScriptRoot\.."
./mvnw -v >$null 2>&1
if ($LASTEXITCODE -ne 0) {
  mvn -v | Out-Null
  if ($LASTEXITCODE -ne 0) { Write-Error 'Maven no está disponible. Instálalo y reintenta.'; exit 1 }
}

mvn clean package -DskipTests
mvn spring-boot:run
