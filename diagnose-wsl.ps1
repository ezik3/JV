# WSL Diagnostic Script
# Run this in PowerShell as Administrator on your Windows machine

Write-Host "=== WSL Diagnostic Report ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check WSL Version
Write-Host "1. Checking WSL Version..." -ForegroundColor Yellow
try {
    $wslVersion = wsl --version 2>&1
    Write-Host $wslVersion -ForegroundColor Green
} catch {
    Write-Host "ERROR: WSL command not found or not working" -ForegroundColor Red
}
Write-Host ""

# 2. Check WSL Status
Write-Host "2. Checking WSL Status..." -ForegroundColor Yellow
try {
    $wslStatus = wsl --status 2>&1
    Write-Host $wslStatus -ForegroundColor Green
} catch {
    Write-Host "ERROR: Cannot get WSL status" -ForegroundColor Red
}
Write-Host ""

# 3. List WSL Distributions
Write-Host "3. Checking installed WSL distributions..." -ForegroundColor Yellow
try {
    $wslList = wsl --list --verbose 2>&1
    if ($wslList) {
        Write-Host $wslList -ForegroundColor Green
    } else {
        Write-Host "WARNING: No WSL distributions found!" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: Cannot list WSL distributions" -ForegroundColor Red
}
Write-Host ""

# 4. Check Windows Features
Write-Host "4. Checking required Windows features..." -ForegroundColor Yellow
$features = @(
    "Microsoft-Windows-Subsystem-Linux",
    "VirtualMachinePlatform"
)

foreach ($feature in $features) {
    $status = Get-WindowsOptionalFeature -Online -FeatureName $feature -ErrorAction SilentlyContinue
    if ($status) {
        $state = $status.State
        if ($state -eq "Enabled") {
            Write-Host "✓ $feature : ENABLED" -ForegroundColor Green
        } else {
            Write-Host "✗ $feature : DISABLED" -ForegroundColor Red
        }
    } else {
        Write-Host "? $feature : NOT FOUND" -ForegroundColor Yellow
    }
}
Write-Host ""

# 5. Check WSL Service
Write-Host "5. Checking WSL Service..." -ForegroundColor Yellow
$wslService = Get-Service -Name "LxssManager" -ErrorAction SilentlyContinue
if ($wslService) {
    $status = $wslService.Status
    Write-Host "WSL Service (LxssManager): $status" -ForegroundColor $(if ($status -eq "Running") { "Green" } else { "Red" })
} else {
    Write-Host "ERROR: WSL Service not found" -ForegroundColor Red
}
Write-Host ""

# 6. Check for Ubuntu in Microsoft Store Apps
Write-Host "6. Checking for installed Ubuntu apps..." -ForegroundColor Yellow
$ubuntuApps = Get-AppxPackage | Where-Object { $_.Name -like "*Ubuntu*" }
if ($ubuntuApps) {
    foreach ($app in $ubuntuApps) {
        Write-Host "Found: $($app.Name) - Version $($app.Version)" -ForegroundColor Green
    }
} else {
    Write-Host "WARNING: No Ubuntu apps found in Microsoft Store" -ForegroundColor Yellow
}
Write-Host ""

# 7. Check WSL Registry
Write-Host "7. Checking WSL Registry..." -ForegroundColor Yellow
$wslRegPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss"
if (Test-Path $wslRegPath) {
    $distributions = Get-ChildItem -Path $wslRegPath -ErrorAction SilentlyContinue
    if ($distributions) {
        Write-Host "Found $($distributions.Count) registered distribution(s):" -ForegroundColor Green
        foreach ($dist in $distributions) {
            $distName = (Get-ItemProperty -Path $dist.PSPath -Name "DistributionName" -ErrorAction SilentlyContinue).DistributionName
            $distState = (Get-ItemProperty -Path $dist.PSPath -Name "State" -ErrorAction SilentlyContinue).State
            Write-Host "  - $distName (State: $distState)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "WARNING: No distributions registered in registry" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR: WSL registry path not found" -ForegroundColor Red
}
Write-Host ""

# 8. Summary and Recommendations
Write-Host "=== DIAGNOSIS SUMMARY ===" -ForegroundColor Cyan
Write-Host ""

# Provide recommendations based on findings
if (-not $wslList -or $wslList -eq "") {
    Write-Host "ISSUE DETECTED: No WSL distributions are installed" -ForegroundColor Red
    Write-Host "RECOMMENDATION: Install Ubuntu from Microsoft Store or run: wsl --install -d Ubuntu" -ForegroundColor Yellow
}

$wslFeature = Get-WindowsOptionalFeature -Online -FeatureName "Microsoft-Windows-Subsystem-Linux" -ErrorAction SilentlyContinue
$vmFeature = Get-WindowsOptionalFeature -Online -FeatureName "VirtualMachinePlatform" -ErrorAction SilentlyContinue

if ($wslFeature.State -ne "Enabled" -or $vmFeature.State -ne "Enabled") {
    Write-Host "ISSUE DETECTED: Required Windows features are not enabled" -ForegroundColor Red
    Write-Host "RECOMMENDATION: Enable features with:" -ForegroundColor Yellow
    Write-Host "  dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart" -ForegroundColor White
    Write-Host "  dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart" -ForegroundColor White
    Write-Host "  Then restart your computer" -ForegroundColor White
}

if ($wslService -and $wslService.Status -ne "Running") {
    Write-Host "ISSUE DETECTED: WSL Service is not running" -ForegroundColor Red
    Write-Host "RECOMMENDATION: Start the service with: Start-Service LxssManager" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== END OF REPORT ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copy this entire output and share it for further troubleshooting." -ForegroundColor Green
