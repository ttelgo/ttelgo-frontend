# PowerShell script to kill process on port 5173
$port = 5173
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($process) {
    $pid = $process.OwningProcess
    Write-Host "Found process $pid using port $port"
    Stop-Process -Id $pid -Force
    Write-Host "Process killed successfully!"
} else {
    Write-Host "No process found using port $port"
}

