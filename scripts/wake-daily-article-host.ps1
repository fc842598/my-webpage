[CmdletBinding()]
param([switch]$CheckOnly)

$ErrorActionPreference = 'Stop'
$stateDirectory = Join-Path $env:LOCALAPPDATA 'YuetianArticleSchedule'
[IO.Directory]::CreateDirectory($stateDirectory) | Out-Null
$logFile = Join-Path $stateDirectory 'host-wake.log'

function Get-ArticleHost {
    @(Get-Process -Name 'Codex' -ErrorAction SilentlyContinue | Where-Object {
        $_.Path -like '*\OpenAI\Codex\bin\*\codex.exe'
    })
}

if ((Get-ArticleHost).Count -gt 0) {
    Add-Content -LiteralPath $logFile -Value "$(Get-Date -Format o) Codex is running."
    Write-Output 'Article host is running.'
    exit 0
}

if ($CheckOnly) { throw 'The Codex desktop app is not running.' }
$binaryRoot = Join-Path $env:LOCALAPPDATA 'OpenAI\Codex\bin'
$launcher = Get-ChildItem -LiteralPath $binaryRoot -Directory -ErrorAction Stop | ForEach-Object {
    $candidate = Join-Path $_.FullName 'codex.exe'
    if (Test-Path -LiteralPath $candidate -PathType Leaf) { Get-Item -LiteralPath $candidate }
} | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $launcher) { throw 'The Codex desktop executable was not found.' }
Start-Process -FilePath $launcher.FullName -WindowStyle Hidden

for ($attempt = 0; $attempt -lt 30; $attempt++) {
    if ((Get-ArticleHost).Count -gt 0) {
        Add-Content -LiteralPath $logFile -Value "$(Get-Date -Format o) Codex started for the article schedule."
        Write-Output 'Article host started.'
        exit 0
    }
    Start-Sleep -Seconds 1
}
throw 'Codex did not start within 30 seconds.'
