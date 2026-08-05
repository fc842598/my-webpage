[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^\d{4}-\d{2}-\d{2}$')]
    [string]$Date,

    [string]$Queue
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$queuePath = if ($Queue) { $Queue } else { Join-Path $repo "docs\ziwei-daily-$Date-queue.md" }
if (-not (Test-Path -LiteralPath $queuePath -PathType Leaf)) {
    throw "Queue not found: $queuePath"
}

$queueText = Get-Content -LiteralPath $queuePath -Encoding utf8 -Raw
$escapedDate = [regex]::Escape($Date)
$matches = [regex]::Matches($queueText, "(?m)^(\d{2})\.\s+$escapedDate\s+(\d{2}:\d{2})\s+-")
$articleCount = $matches.Count
if ($articleCount -lt 10 -or $articleCount -gt 30) {
    throw "Expected 10-30 release times for $Date, found $articleCount"
}

$orders = $matches | ForEach-Object { [int]$_.Groups[1].Value }
if (($orders | Sort-Object -Unique).Count -ne $articleCount -or ($orders | Measure-Object -Minimum -Maximum).Minimum -ne 1 -or ($orders | Measure-Object -Minimum -Maximum).Maximum -ne $articleCount) {
    throw "Queue orders must be unique and cover 01 through $('{0:D2}' -f $articleCount)"
}

$now = Get-Date
$slots = foreach ($match in $matches) {
    $order = [int]$match.Groups[1].Value
    $time = $match.Groups[2].Value
    $when = [datetime]::ParseExact("$Date $time", 'yyyy-MM-dd HH:mm', [Globalization.CultureInfo]::InvariantCulture)
    if ($when -le $now) {
        throw "Release slot $order is not in the future: $when"
    }
    [pscustomobject]@{ Order = $order; Time = $time; When = $when }
}

$taskPrefix = 'YuetianAI-Article-'
$dateKey = $Date.Replace('-', '')
$wrapper = Join-Path $PSScriptRoot 'release-daily-article-slot.ps1'
$powershell = (Get-Command powershell.exe -ErrorAction Stop).Source
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet `
    -Hidden `
    -StartWhenAvailable `
    -WakeToRun `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 20)

$oldTasks = Get-ScheduledTask -TaskName "$taskPrefix*" -ErrorAction SilentlyContinue | Where-Object {
    $_.TaskName -notlike "$taskPrefix$dateKey-*"
}
foreach ($task in $oldTasks) {
    if ($PSCmdlet.ShouldProcess($task.TaskName, 'Remove previous article release task')) {
        Unregister-ScheduledTask -TaskName $task.TaskName -Confirm:$false
    }
}

$desiredTaskNames = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$slots | ForEach-Object { [void]$desiredTaskNames.Add("$taskPrefix$dateKey-$('{0:D2}' -f $_.Order)") }
$staleSameDateTasks = Get-ScheduledTask -TaskName "$taskPrefix$dateKey-*" -ErrorAction SilentlyContinue | Where-Object {
    -not $desiredTaskNames.Contains($_.TaskName)
}
foreach ($task in $staleSameDateTasks) {
    if ($PSCmdlet.ShouldProcess($task.TaskName, 'Remove release task outside the current batch size')) {
        Unregister-ScheduledTask -TaskName $task.TaskName -Confirm:$false
    }
}

foreach ($slot in $slots) {
    $orderText = '{0:D2}' -f $slot.Order
    $taskName = "$taskPrefix$dateKey-$orderText"
    $arguments = "-NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$wrapper`" -Date `"$Date`" -Order $($slot.Order)"
    $action = New-ScheduledTaskAction -Execute $powershell -Argument $arguments -WorkingDirectory $repo
    $trigger = New-ScheduledTaskTrigger -Once -At $slot.When
    if ($PSCmdlet.ShouldProcess($taskName, "Register release at $($slot.When.ToString('yyyy-MM-dd HH:mm'))")) {
        Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null
    }
}

if (-not $WhatIfPreference) {
    $registered = @(Get-ScheduledTask -TaskName "$taskPrefix$dateKey-*" -ErrorAction Stop)
    if ($registered.Count -ne $articleCount) {
        throw "Expected $articleCount registered tasks, found $($registered.Count)"
    }
    Write-Output "Registered $articleCount hidden article release tasks for $Date."
}
