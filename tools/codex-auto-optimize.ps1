[CmdletBinding()]
param(
  [switch]$RunLoop,
  [switch]$RunOnce,
  [switch]$InstallTask,
  [switch]$UninstallTask,
  [switch]$DryRun,
  [int]$PollSeconds = 20,
  [int]$CpuBusyPercent = 82,
  [double]$FreeMemoryGbThreshold = 1.6,
  [double]$SevereFreeMemoryGbThreshold = 1.0,
  [int]$PressureHits = 2,
  [int]$CodexFocusGraceMinutes = 15,
  [int]$MinIdleAgeMinutes = 20,
  [int]$KeepRecentHelperGroups = 2,
  [double]$IdleCpuDeltaSeconds = 0.05,
  [int]$HelperTrimCooldownMinutes = 10,
  [int]$PressureCooldownLoops = 4,
  [int]$HelperMinWorkingSetMb = 6,
  [int]$UtilityMinWorkingSetMb = 12,
  [int]$CoreServerMinWorkingSetMb = 96,
  [int]$MaxLoops = 0,
  [string]$TaskName = 'CodexAutoOptimize'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not ($RunLoop -or $RunOnce -or $InstallTask -or $UninstallTask)) {
  $RunLoop = $true
}

$script:CpuSamplesById = @{}
$script:LastTrimAtById = @{}
$script:PriorityRestoreById = @{}
$script:LastCodexFocusAt = $null
$script:NoPressureLoops = 0
$script:PressureCount = 0

Add-Type @'
using System;
using System.Runtime.InteropServices;

public static class CodexOptimizeNative {
  [DllImport("user32.dll")]
  public static extern IntPtr GetForegroundWindow();

  [DllImport("user32.dll")]
  public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);

  [DllImport("kernel32.dll", SetLastError=true)]
  public static extern IntPtr OpenProcess(UInt32 access, bool inheritHandle, UInt32 processId);

  [DllImport("psapi.dll", SetLastError=true)]
  public static extern bool EmptyWorkingSet(IntPtr hProcess);

  [DllImport("kernel32.dll", SetLastError=true)]
  public static extern bool CloseHandle(IntPtr hObject);
}
'@

$script:ProcessSetQuota = 0x0100
$script:ProcessQueryInformation = 0x0400

function Get-DeployRoot {
  return Join-Path $env:LOCALAPPDATA 'CodexAutoOptimize'
}

function Get-DeployScriptPath {
  return Join-Path (Get-DeployRoot) 'codex-auto-optimize.ps1'
}

function Get-LogPath {
  return Join-Path (Get-DeployRoot) 'codex-auto-optimize.log'
}

function Ensure-DeployRoot {
  $root = Get-DeployRoot
  if (-not (Test-Path -LiteralPath $root)) {
    New-Item -ItemType Directory -Path $root -Force | Out-Null
  }
  return $root
}

function Write-Log {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Message
  )

  $root = Ensure-DeployRoot
  if (-not (Test-Path -LiteralPath $root)) {
    return
  }

  $line = '{0} {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message
  Add-Content -Path (Get-LogPath) -Value $line
  if ($DryRun -or $RunOnce) {
    Write-Host $line
  }
}

function Get-ForegroundProcessInfo {
  try {
    $windowHandle = [CodexOptimizeNative]::GetForegroundWindow()
    [uint32]$foregroundProcessId = 0
    [void][CodexOptimizeNative]::GetWindowThreadProcessId($windowHandle, [ref]$foregroundProcessId)
    if ($foregroundProcessId -le 0) {
      return $null
    }

    $foregroundProcess = Get-Process -Id $foregroundProcessId -ErrorAction SilentlyContinue
    if (-not $foregroundProcess) {
      return $null
    }

    return [pscustomobject]@{
      ProcessName = $foregroundProcess.ProcessName
      ProcessId = $foregroundProcess.Id
      MainWindowTitle = $foregroundProcess.MainWindowTitle
    }
  } catch {
    return $null
  }
}

function Get-OverallCpuLoad {
  try {
    $sample = (Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 1).CounterSamples
    return [math]::Round($sample[0].CookedValue, 1)
  } catch {
    $loads = Get-CimInstance Win32_Processor | Select-Object -ExpandProperty LoadPercentage
    $average = ($loads | Measure-Object -Average).Average
    return [math]::Round($average, 1)
  }
}

function Get-FreeMemoryGb {
  $os = Get-CimInstance Win32_OperatingSystem
  return [math]::Round(($os.FreePhysicalMemory * 1KB / 1GB), 2)
}

function Get-CodexRole {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ProcessName,
    [string]$CommandLine
  )

  switch ($ProcessName.ToLowerInvariant()) {
    'node_repl.exe' { return 'node-repl' }
    'codex.exe' {
      if ($CommandLine -match '--listen stdio://') {
        return 'thread-server'
      }
      if ($CommandLine -match '--analytics-default-enabled') {
        return 'core-server'
      }
      if ($CommandLine -match '--type=renderer') {
        return 'renderer'
      }
      if ($CommandLine -match '--type=gpu-process') {
        return 'gpu'
      }
      if ($CommandLine -match '--type=utility') {
        return 'utility'
      }
      if ($CommandLine -match '--type=crashpad-handler') {
        return 'crashpad'
      }
      if ($CommandLine -match '--type=') {
        return 'ui-child'
      }
      if ($CommandLine -match 'resources\\codex\.exe') {
        return 'core-server'
      }
      if ($CommandLine -match 'AppData\\Local\\OpenAI\\Codex\\bin\\') {
        return 'thread-server'
      }
      return 'ui-main'
    }
    default { return 'other' }
  }
}

function Get-CodexInventory {
  $wmiProcesses = Get-CimInstance Win32_Process | Where-Object {
    $_.Name -in @('Codex.exe', 'codex.exe', 'node_repl.exe')
  }

  $powershellProcesses = @{}
  Get-Process Codex, codex, node_repl -ErrorAction SilentlyContinue | ForEach-Object {
    $powershellProcesses[$_.Id] = $_
  }

  $inventory = foreach ($wmiProcess in $wmiProcesses) {
    $processId = [int]$wmiProcess.ProcessId
    if (-not $powershellProcesses.ContainsKey($processId)) {
      continue
    }

    $process = $powershellProcesses[$processId]
    $cpuTotal = if ($null -ne $process.CPU) { [double]$process.CPU } else { 0.0 }
    $cpuDelta = [double]::PositiveInfinity
    if ($script:CpuSamplesById.ContainsKey($process.Id)) {
      $cpuDelta = [math]::Max(0.0, $cpuTotal - [double]$script:CpuSamplesById[$process.Id])
    }
    $script:CpuSamplesById[$process.Id] = $cpuTotal

    [pscustomobject]@{
      Id = $processId
      ParentId = [int]$wmiProcess.ParentProcessId
      Name = $process.ProcessName
      Role = Get-CodexRole -ProcessName $wmiProcess.Name -CommandLine $wmiProcess.CommandLine
      CommandLine = $wmiProcess.CommandLine
      CpuDelta = [math]::Round($cpuDelta, 4)
      CpuTotal = [math]::Round($cpuTotal, 2)
      StartTime = $process.StartTime
      AgeMinutes = [math]::Round(((Get-Date) - $process.StartTime).TotalMinutes, 1)
      WorkingSetMb = [math]::Round(($process.WorkingSet64 / 1MB), 1)
      PriorityClass = $process.PriorityClass
    }
  }

  $liveIds = @{}
  foreach ($item in $inventory) {
    $liveIds[$item.Id] = $true
  }

  foreach ($existingId in @($script:CpuSamplesById.Keys)) {
    if (-not $liveIds.ContainsKey([int]$existingId)) {
      $script:CpuSamplesById.Remove($existingId)
    }
  }

  foreach ($existingId in @($script:LastTrimAtById.Keys)) {
    if (-not $liveIds.ContainsKey([int]$existingId)) {
      $script:LastTrimAtById.Remove($existingId)
    }
  }

  foreach ($existingId in @($script:PriorityRestoreById.Keys)) {
    if (-not $liveIds.ContainsKey([int]$existingId)) {
      $script:PriorityRestoreById.Remove($existingId)
    }
  }

  return @($inventory)
}

function Get-HelperGroups {
  param(
    [Parameter(Mandatory = $true)]
    [AllowEmptyCollection()]
    [object[]]$Inventory
  )

  $groups = @()
  $assignedThreadIds = @{}

  $threadServers = @($Inventory | Where-Object { $_.Role -eq 'thread-server' })
  $nodeRepls = @($Inventory | Where-Object { $_.Role -eq 'node-repl' })

  foreach ($nodeRepl in $nodeRepls) {
    $members = @($nodeRepl) + @($threadServers | Where-Object { $_.ParentId -eq $nodeRepl.Id })
    foreach ($member in $members) {
      $assignedThreadIds[$member.Id] = $true
    }
    $groups += New-HelperGroup -Key ('group-{0}' -f $nodeRepl.Id) -Members $members
  }

  $orphanThreadServers = $threadServers | Where-Object { -not $assignedThreadIds.ContainsKey($_.Id) }
  foreach ($threadServer in $orphanThreadServers) {
    $groups += New-HelperGroup -Key ('group-{0}' -f $threadServer.Id) -Members @($threadServer)
  }

  return @($groups)
}

function New-HelperGroup {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Key,
    [Parameter(Mandatory = $true)]
    [object[]]$Members
  )

  $latestMember = $Members | Sort-Object StartTime -Descending | Select-Object -First 1
  $maxCpuDelta = ($Members | Measure-Object CpuDelta -Maximum).Maximum
  $totalWorkingSetMb = ($Members | Measure-Object WorkingSetMb -Sum).Sum

  return [pscustomobject]@{
    Key = $Key
    Members = @($Members)
    LatestStartTime = $latestMember.StartTime
    LatestAgeMinutes = [math]::Round($latestMember.AgeMinutes, 1)
    MaxCpuDelta = [math]::Round($maxCpuDelta, 4)
    TotalWorkingSetMb = [math]::Round($totalWorkingSetMb, 1)
  }
}

function Get-ProtectedHelperIds {
  param(
    [Parameter(Mandatory = $true)]
    [AllowEmptyCollection()]
    [object[]]$HelperGroups
  )

  $protected = @{}
  $recentGroups = $HelperGroups | Sort-Object LatestStartTime -Descending | Select-Object -First $KeepRecentHelperGroups
  foreach ($group in $recentGroups) {
    foreach ($member in $group.Members) {
      $protected[$member.Id] = $true
    }
  }
  return $protected
}

function Test-CodexContext {
  $visibleCodexWindow = Get-Process Codex -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
  if (-not $visibleCodexWindow) {
    return $false
  }

  $foreground = Get-ForegroundProcessInfo
  if ($foreground -and $foreground.ProcessName -eq 'Codex') {
    $script:LastCodexFocusAt = Get-Date
  }

  if (-not $script:LastCodexFocusAt) {
    $script:LastCodexFocusAt = (Get-Date).AddMinutes(-($CodexFocusGraceMinutes + 1))
  }

  $helperCount = @(Get-Process codex, node_repl -ErrorAction SilentlyContinue).Count
  return (
    ($foreground -and $foreground.ProcessName -eq 'Codex') -or
    ($helperCount -ge 4) -or
    (((Get-Date) - $script:LastCodexFocusAt).TotalMinutes -le $CodexFocusGraceMinutes)
  )
}

function Test-TrimCooldown {
  param(
    [Parameter(Mandatory = $true)]
    [int]$ProcessId
  )

  if (-not $script:LastTrimAtById.ContainsKey($ProcessId)) {
    return $true
  }

  return (((Get-Date) - $script:LastTrimAtById[$ProcessId]).TotalMinutes -ge $HelperTrimCooldownMinutes)
}

function Invoke-EmptyWorkingSetSafe {
  param(
    [Parameter(Mandatory = $true)]
    [int]$ProcessId
  )

  if ($DryRun) {
    return $true
  }

  $processHandle = [CodexOptimizeNative]::OpenProcess(
    ($script:ProcessQueryInformation -bor $script:ProcessSetQuota),
    $false,
    [uint32]$ProcessId
  )

  if ($processHandle -eq [IntPtr]::Zero) {
    return $false
  }

  try {
    return [CodexOptimizeNative]::EmptyWorkingSet($processHandle)
  } finally {
    [void][CodexOptimizeNative]::CloseHandle($processHandle)
  }
}

function Set-ProcessPrioritySafe {
  param(
    [Parameter(Mandatory = $true)]
    [int]$ProcessId,
    [Parameter(Mandatory = $true)]
    [System.Diagnostics.ProcessPriorityClass]$PriorityClass
  )

  $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
  if (-not $process) {
    return $false
  }

  if ($process.PriorityClass -eq $PriorityClass) {
    return $true
  }

  if ($DryRun) {
    return $true
  }

  $process.PriorityClass = $PriorityClass
  return $true
}

function Restore-LoweredPriorities {
  if ($script:PriorityRestoreById.Count -eq 0) {
    return
  }

  foreach ($processId in @($script:PriorityRestoreById.Keys)) {
    $targetPriority = $script:PriorityRestoreById[$processId]
    $restored = $false

    try {
      $restored = Set-ProcessPrioritySafe -ProcessId ([int]$processId) -PriorityClass $targetPriority
    } catch {
      $restored = $false
    }

    if ($restored -or -not (Get-Process -Id ([int]$processId) -ErrorAction SilentlyContinue)) {
      Write-Log ('restore-priority pid={0} target={1}' -f $processId, $targetPriority)
      $script:PriorityRestoreById.Remove($processId)
    }
  }
}

function Invoke-CodexRelief {
  param(
    [Parameter(Mandatory = $true)]
    [AllowEmptyCollection()]
    [object[]]$Inventory,
    [Parameter(Mandatory = $true)]
    [bool]$SevereMemoryPressure
  )

  $actions = New-Object System.Collections.Generic.List[string]

  $helperGroups = @(Get-HelperGroups -Inventory $Inventory)
  $protectedHelperIds = Get-ProtectedHelperIds -HelperGroups $helperGroups

  foreach ($group in $helperGroups) {
    $groupIsProtected = $false
    foreach ($member in $group.Members) {
      if ($protectedHelperIds.ContainsKey($member.Id)) {
        $groupIsProtected = $true
        break
      }
    }

    if ($groupIsProtected) {
      continue
    }

    if ($group.LatestAgeMinutes -lt $MinIdleAgeMinutes) {
      continue
    }

    if ($group.MaxCpuDelta -gt $IdleCpuDeltaSeconds) {
      continue
    }

    foreach ($member in $group.Members) {
      if ($member.WorkingSetMb -lt $HelperMinWorkingSetMb) {
        continue
      }

      if (-not (Test-TrimCooldown -ProcessId $member.Id)) {
        continue
      }

      if (Invoke-EmptyWorkingSetSafe -ProcessId $member.Id) {
        $script:LastTrimAtById[$member.Id] = Get-Date
        $actions.Add(('trim {0}#{1} ws={2}MB' -f $member.Role, $member.Id, $member.WorkingSetMb))
      }

      if ($member.PriorityClass -notin @(
        [System.Diagnostics.ProcessPriorityClass]::Idle,
        [System.Diagnostics.ProcessPriorityClass]::BelowNormal
      )) {
        if (-not $script:PriorityRestoreById.ContainsKey($member.Id)) {
          $script:PriorityRestoreById[$member.Id] = $member.PriorityClass
        }

        if (Set-ProcessPrioritySafe -ProcessId $member.Id -PriorityClass ([System.Diagnostics.ProcessPriorityClass]::BelowNormal)) {
          $actions.Add(('lower-priority {0}#{1}' -f $member.Role, $member.Id))
        }
      }
    }
  }

  $utilityCandidates = $Inventory | Where-Object {
    $_.Role -in @('utility', 'crashpad') -and
    $_.CpuDelta -le $IdleCpuDeltaSeconds -and
    $_.AgeMinutes -ge 5 -and
    $_.WorkingSetMb -ge $UtilityMinWorkingSetMb -and
    (Test-TrimCooldown -ProcessId $_.Id)
  }

  foreach ($candidate in $utilityCandidates) {
    if (Invoke-EmptyWorkingSetSafe -ProcessId $candidate.Id) {
      $script:LastTrimAtById[$candidate.Id] = Get-Date
      $actions.Add(('trim {0}#{1} ws={2}MB' -f $candidate.Role, $candidate.Id, $candidate.WorkingSetMb))
    }
  }

  if ($SevereMemoryPressure) {
    $coreServerCandidates = $Inventory | Where-Object {
      $_.Role -eq 'core-server' -and
      $_.CpuDelta -le $IdleCpuDeltaSeconds -and
      $_.WorkingSetMb -ge $CoreServerMinWorkingSetMb -and
      (Test-TrimCooldown -ProcessId $_.Id)
    }

    foreach ($candidate in $coreServerCandidates) {
      if (Invoke-EmptyWorkingSetSafe -ProcessId $candidate.Id) {
        $script:LastTrimAtById[$candidate.Id] = Get-Date
        $actions.Add(('trim {0}#{1} ws={2}MB' -f $candidate.Role, $candidate.Id, $candidate.WorkingSetMb))
      }
    }
  }

  return @($actions.ToArray())
}

function Get-PressureSnapshot {
  $foreground = Get-ForegroundProcessInfo
  $cpuLoad = Get-OverallCpuLoad
  $freeMemoryGb = Get-FreeMemoryGb

  return [pscustomobject]@{
    CpuLoad = $cpuLoad
    FreeMemoryGb = $freeMemoryGb
    SevereMemoryPressure = ($freeMemoryGb -le $SevereFreeMemoryGbThreshold)
    PressureDetected = (($cpuLoad -ge $CpuBusyPercent) -or ($freeMemoryGb -le $FreeMemoryGbThreshold))
    ForegroundProcessName = if ($foreground) { $foreground.ProcessName } else { '' }
  }
}

function Invoke-LoopOnce {
  $inventory = Get-CodexInventory
  if ($null -eq $inventory) {
    $inventory = @()
  }
  $snapshot = Get-PressureSnapshot

  if (-not (Test-CodexContext)) {
    $script:NoPressureLoops++
    if ($script:NoPressureLoops -ge $PressureCooldownLoops) {
      Restore-LoweredPriorities
    }
    return
  }

  if ($snapshot.PressureDetected) {
    $script:NoPressureLoops = 0
    $script:PressureCount = [int]$script:PressureCount + 1
  } else {
    $script:PressureCount = 0
    $script:NoPressureLoops++
    if ($script:NoPressureLoops -ge $PressureCooldownLoops) {
      Restore-LoweredPriorities
    }
    return
  }

  if ($script:PressureCount -lt $PressureHits) {
    return
  }

  $actions = @(Invoke-CodexRelief -Inventory $inventory -SevereMemoryPressure $snapshot.SevereMemoryPressure)
  if ($actions.Count -gt 0) {
    Write-Log ('relief cpu={0}% free={1}GB actions={2}' -f $snapshot.CpuLoad, $snapshot.FreeMemoryGb, ($actions -join '; '))
  } else {
    Write-Log ('pressure cpu={0}% free={1}GB no-safe-action' -f $snapshot.CpuLoad, $snapshot.FreeMemoryGb)
  }

  $script:PressureCount = 0
}

function Enter-SingleInstanceGuard {
  if ($DryRun) {
    return 'dry-run'
  }

  $mutexName = 'Local\CodexAutoOptimizeMonitor'
  $mutex = New-Object System.Threading.Mutex($false, $mutexName)
  if (-not $mutex.WaitOne(0, $false)) {
    Write-Log 'monitor already running, skip new instance'
    return $null
  }
  return $mutex
}

function Install-CodexAutoOptimizeTask {
  $deployRoot = Ensure-DeployRoot
  $deployScriptPath = Get-DeployScriptPath
  Copy-Item -LiteralPath $PSCommandPath -Destination $deployScriptPath -Force

  $powershellPath = Join-Path $PSHOME 'powershell.exe'
  $arguments = '-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "{0}" -RunLoop' -f $deployScriptPath
  $commandLine = '{0} {1}' -f $powershellPath, $arguments

  $installMode = 'scheduled-task'
  try {
    $action = New-ScheduledTaskAction -Execute $powershellPath -Argument $arguments
    $trigger = New-ScheduledTaskTrigger -AtLogOn
    $settings = New-ScheduledTaskSettingsSet `
      -AllowStartIfOnBatteries `
      -DontStopIfGoingOnBatteries `
      -StartWhenAvailable `
      -MultipleInstances IgnoreNew `
      -RestartCount 3 `
      -RestartInterval (New-TimeSpan -Minutes 1) `
      -ExecutionTimeLimit ([TimeSpan]::Zero)
    $principal = New-ScheduledTaskPrincipal `
      -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) `
      -LogonType Interactive `
      -RunLevel Limited

    Register-ScheduledTask `
      -TaskName $TaskName `
      -Action $action `
      -Trigger $trigger `
      -Settings $settings `
      -Principal $principal `
      -Description 'Auto-relieve Codex pressure without touching the active Codex window.' `
      -Force | Out-Null

    Start-ScheduledTask -TaskName $TaskName
  } catch {
    $installMode = 'registry-run'
    $runKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
    New-Item -Path $runKey -Force | Out-Null
    Set-ItemProperty -Path $runKey -Name $TaskName -Value $commandLine
    Start-Process -FilePath $powershellPath -ArgumentList $arguments -WindowStyle Hidden
  }

  Write-Log ('auto-start-installed mode={0} script={1}' -f $installMode, $deployScriptPath)
}

function Uninstall-CodexAutoOptimizeTask {
  $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
  if ($task) {
    Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
  }

  $runKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
  if (Get-ItemProperty -Path $runKey -Name $TaskName -ErrorAction SilentlyContinue) {
    Remove-ItemProperty -Path $runKey -Name $TaskName -ErrorAction SilentlyContinue
  }

  Get-CimInstance Win32_Process | Where-Object {
    $_.CommandLine -match 'codex-auto-optimize\.ps1' -and
    $_.CommandLine -match '-RunLoop'
  } | ForEach-Object {
    Stop-Process -Id ([int]$_.ProcessId) -Force -ErrorAction SilentlyContinue
  }

  $deployRoot = Get-DeployRoot
  if (Test-Path -LiteralPath $deployRoot) {
    Remove-Item -LiteralPath $deployRoot -Recurse -Force
  }
}

if ($InstallTask) {
  Install-CodexAutoOptimizeTask
  return
}

if ($UninstallTask) {
  Uninstall-CodexAutoOptimizeTask
  return
}

$mutex = Enter-SingleInstanceGuard
if (-not $mutex) {
  return
}

try {
  if ($RunOnce) {
    Invoke-LoopOnce
    return
  }

  $loopCount = 0
  while ($true) {
    Invoke-LoopOnce
    $loopCount++
    if ($MaxLoops -gt 0 -and $loopCount -ge $MaxLoops) {
      break
    }
    Start-Sleep -Seconds $PollSeconds
  }
} finally {
  if ($mutex -is [System.Threading.Mutex]) {
    $mutex.ReleaseMutex() | Out-Null
    $mutex.Dispose()
  }
}
