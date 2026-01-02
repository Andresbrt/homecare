param([int[]]$Ports = @(8080,8081))

foreach ($port in $Ports) {
  try {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
      $procIds = $conns | Select-Object -ExpandProperty OwningProcess -Unique
      foreach ($procId in $procIds) {
        Write-Host "Matando PID $procId que usa puerto $port" -ForegroundColor Yellow
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
      }
    } else {
      Write-Host "Puerto $port libre" -ForegroundColor Green
    }
  } catch {
    $errorMsg = $_.Exception.Message
    Write-Warning "No pude inspeccionar el puerto $port : $errorMsg"
  }
}
