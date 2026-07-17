[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host 'Starting WorkHub OS in local demo mode.'
Write-Host 'Review environment placeholders and use synthetic data before continuing.'
npm run dev --prefix frontend

