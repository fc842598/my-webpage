param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^\d{4}-\d{2}-\d{2}$')]
    [string]$Date,

    [Parameter(Mandatory = $true)]
    [ValidateRange(1, 30)]
    [int]$Order
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$node = (Get-Command node.exe -ErrorAction Stop).Source
$gitCommon = & git -C $repo rev-parse --git-common-dir
if ($LASTEXITCODE -ne 0) { throw 'Cannot locate shared Git directory' }
if (-not [IO.Path]::IsPathRooted($gitCommon)) { $gitCommon = Join-Path $repo $gitCommon }
$gitCommon = [IO.Path]::GetFullPath($gitCommon)
$logDirectory = Join-Path $gitCommon 'article-release-logs'
[IO.Directory]::CreateDirectory($logDirectory) | Out-Null
$orderText = '{0:D2}' -f $Order
$logFile = Join-Path $logDirectory "$Date-$orderText.log"

Set-Location -LiteralPath $repo
try {
    & $node (Join-Path $PSScriptRoot 'release-daily-article-slot.mjs') --date $Date --order $orderText *>> $logFile
    exit $LASTEXITCODE
}
catch {
    $_ | Out-File -LiteralPath $logFile -Encoding utf8 -Append
    exit 1
}
