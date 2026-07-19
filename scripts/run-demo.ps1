[CmdletBinding()]
param([switch]$VerifyAndExit)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$env:MONGO_URI = 'memory'
$env:SEED_TEMP_DATA = 'true'
$env:JWT_SECRET = 'local-demo-only-change-me'
$env:CLIENT_URL = 'http://127.0.0.1:3000,http://localhost:3000'
$env:NEXT_PUBLIC_API_URL = 'http://127.0.0.1:5000/api'
$env:NEXT_PUBLIC_WS_URL = 'http://127.0.0.1:5000'

function Stop-ProcessTree([int]$ProcessId) {
  $children = Get-CimInstance Win32_Process -Filter "ParentProcessId=$ProcessId" -ErrorAction SilentlyContinue
  foreach ($child in $children) { Stop-ProcessTree -ProcessId $child.ProcessId }
  Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
}

Write-Host 'Starting the synthetic, in-memory WorkHub demo.'
$backend = Start-Process node -ArgumentList 'server.js' -WorkingDirectory (Join-Path $repoRoot 'backend') -WindowStyle Hidden -PassThru
$frontend = Start-Process node -ArgumentList 'node_modules/next/dist/bin/next', 'dev' -WorkingDirectory (Join-Path $repoRoot 'frontend') -WindowStyle Hidden -PassThru

try {
  $healthy = $false
  for ($attempt = 0; $attempt -lt 120; $attempt += 1) {
    try {
      $api = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/health' -TimeoutSec 2
      $web = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/login' -UseBasicParsing -TimeoutSec 2
      if ($api.status -eq 'ok' -and $web.StatusCode -eq 200) {
        $healthy = $true
        break
      }
    } catch {
      Start-Sleep -Seconds 1
    }
  }
  if (-not $healthy) { throw 'Demo services did not become healthy within 120 seconds.' }

  node scripts/verify-demo-workflow.mjs
  Write-Host 'WorkHub demo verified at http://127.0.0.1:3000/login'
  if ($VerifyAndExit) { return }
  Write-Host 'Press Ctrl+C to stop both local services.'
  while (-not $backend.HasExited -and -not $frontend.HasExited) {
    Start-Sleep -Seconds 2
  }
  if ($backend.HasExited) { throw 'Backend process stopped unexpectedly.' }
  if ($frontend.HasExited) { throw 'Frontend process stopped unexpectedly.' }
} finally {
  foreach ($process in @($frontend, $backend)) {
    if ($process -and -not $process.HasExited) {
      Stop-ProcessTree -ProcessId $process.Id
    }
  }
}
