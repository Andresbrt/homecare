# Runs Expo with backend URL exported
$ErrorActionPreference = 'Stop'

param(
  [string]$ApiUrl = 'http://localhost:8081/api'
)

$env:EXPO_PUBLIC_API_URL = $ApiUrl

Set-Location "$PSScriptRoot\..\mobile"

npx --yes expo start
