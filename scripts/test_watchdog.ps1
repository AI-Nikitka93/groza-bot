$watchdog = Start-Process -FilePath "node" -ArgumentList "watchdog.js" -PassThru

Start-Sleep -Seconds 5

$child = Get-WmiObject Win32_Process | Where-Object { $_.CommandLine -match 'dist\\index.js' }
if ($child) {
    Write-Host "Found child process. Killing PID: $($child.ProcessId)"
    Stop-Process -Id $child.ProcessId -Force
    
    Write-Host "Waiting 4 seconds for restart..."
    Start-Sleep -Seconds 4
    
    $newChild = Get-WmiObject Win32_Process | Where-Object { $_.CommandLine -match 'dist\\index.js' }
    if ($newChild -and $newChild.ProcessId -ne $child.ProcessId) {
        Write-Host "[SUCCESS] Automatic Restart Confirmed. Old PID: $($child.ProcessId), New PID: $($newChild.ProcessId)"
    } else {
        Write-Host "[FAIL] Process did not restart."
    }
} else {
    Write-Host "[FAIL] Child process not found."
}

Stop-Process -Id $watchdog.Id -Force
