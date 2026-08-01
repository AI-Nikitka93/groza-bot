$endpoints = @("/health", "/health/details", "/ready")
$baseUrl = "http://127.0.0.1:3000"
$maxAttempts = 15

foreach ($ep in $endpoints) {
    $url = "$baseUrl$ep"
    $success = $false
    for ($i = 1; $i -le $maxAttempts; $i++) {
        Write-Host "Attempt $($i): Testing $url..."
        try {
            $sw = [System.Diagnostics.Stopwatch]::StartNew()
            $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
            $sw.Stop()
            Write-Host "Status: $($r.StatusCode)"
            Write-Host "Time: $($sw.ElapsedMilliseconds)ms"
            Write-Host "Content: $($r.Content)"
            Write-Host "------------------------"
            $success = $true
            break
        } catch {
            Write-Host "Error accessing $url : $_"
            if ($_.Exception.Response) {
                Write-Host "Status code: $($_.Exception.Response.StatusCode)"
                try {
                    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                    Write-Host "Error Content: $($reader.ReadToEnd())"
                } catch {}
            }
        }
        Start-Sleep -Seconds 2
    }
    if (-not $success) {
        Write-Host "Failed to reach $url after $maxAttempts attempts."
        Write-Host "------------------------"
    }
}
