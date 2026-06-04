param(
  [string]$SourceRoot = "",
  [string]$BackupRoot = "",
  [int]$MaxSizeGB = 10
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($SourceRoot)) {
  $SourceRoot = (Get-Location).Path
}

if ([string]::IsNullOrWhiteSpace($BackupRoot)) {
  $BackupRoot = Split-Path -Parent $PSCommandPath
}

function Get-DirectorySizeBytes {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    return [int64]0
  }

  $measure = Get-ChildItem -LiteralPath $Path -Recurse -Force -File |
    Measure-Object -Property Length -Sum

  if ($null -eq $measure.Sum) {
    return [int64]0
  }

  return [int64]$measure.Sum
}

function Format-SizeGb {
  param([int64]$Bytes)
  return [math]::Round($Bytes / 1GB, 2)
}

function Append-LogLine {
  param(
    [string]$LogPath,
    [string]$Message
  )

  Add-Content -LiteralPath $LogPath -Value $Message -Encoding UTF8
}

$resolvedSource = (Resolve-Path -LiteralPath $SourceRoot).Path
$resolvedBackupRoot = $BackupRoot

if (-not (Test-Path -LiteralPath $resolvedBackupRoot)) {
  New-Item -ItemType Directory -Path $resolvedBackupRoot | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupName = "yuetian-site-backup-$timestamp"
$backupPath = Join-Path $resolvedBackupRoot $backupName
$logPath = Join-Path $resolvedBackupRoot "backup-log.txt"
$maxBytes = [int64]$MaxSizeGB * 1GB

$excludeDirNames = @(
  ".git",
  ".codex",
  "node_modules",
  "output",
  "__pycache__",
  ".next",
  "dist",
  "build"
)

$excludeFileNames = @(
  "Thumbs.db",
  ".DS_Store"
)

$excludeDirPaths = $excludeDirNames |
  ForEach-Object { Join-Path $resolvedSource $_ } |
  Where-Object { Test-Path -LiteralPath $_ }

New-Item -ItemType Directory -Path $backupPath | Out-Null

$robocopyArgs = @(
  $resolvedSource,
  $backupPath,
  "*",
  "/E",
  "/COPY:DAT",
  "/DCOPY:DAT",
  "/R:2",
  "/W:2",
  "/XJ",
  "/MT:8",
  "/NFL",
  "/NDL",
  "/NP"
)

if ($excludeDirPaths.Count -gt 0) {
  $robocopyArgs += "/XD"
  $robocopyArgs += $excludeDirPaths
}

if ($excludeFileNames.Count -gt 0) {
  $robocopyArgs += "/XF"
  $robocopyArgs += $excludeFileNames
}

& robocopy @robocopyArgs | Out-Null
$robocopyCode = $LASTEXITCODE

if ($robocopyCode -gt 7) {
  throw "robocopy failed with exit code $robocopyCode"
}

$removedBackups = New-Object System.Collections.Generic.List[string]
$allBackupDirs = Get-ChildItem -LiteralPath $resolvedBackupRoot -Directory |
  Where-Object { $_.Name -like "yuetian-site-backup-*" } |
  Sort-Object Name

$totalBytes = Get-DirectorySizeBytes -Path $resolvedBackupRoot

while ($totalBytes -gt $maxBytes -and $allBackupDirs.Count -gt 1) {
  $oldest = $allBackupDirs[0]
  Remove-Item -LiteralPath $oldest.FullName -Recurse -Force
  $removedBackups.Add($oldest.FullName) | Out-Null

  $allBackupDirs = Get-ChildItem -LiteralPath $resolvedBackupRoot -Directory |
    Where-Object { $_.Name -like "yuetian-site-backup-*" } |
    Sort-Object Name

  $totalBytes = Get-DirectorySizeBytes -Path $resolvedBackupRoot
}

$result = [pscustomobject]@{
  timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  sourceRoot = $resolvedSource
  backupRoot = $resolvedBackupRoot
  createdBackup = $backupPath
  currentBackupCount = $allBackupDirs.Count
  totalSizeGB = Format-SizeGb -Bytes $totalBytes
  overLimit = ($totalBytes -gt $maxBytes)
  removedOldBackups = @($removedBackups)
}

$removedText = if ($removedBackups.Count -gt 0) {
  ($removedBackups -join "; ")
} else {
  "none"
}

$logLine = "[{0}] backup={1} | total={2} GB | removed={3}" -f `
  $result.timestamp, $result.createdBackup, $result.totalSizeGB, $removedText

Append-LogLine -LogPath $logPath -Message $logLine

$result | ConvertTo-Json -Depth 4
