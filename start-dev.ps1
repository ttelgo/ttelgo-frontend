# PowerShell script to start the dev server and open browser
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TTelGo Web Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting dev server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Localhost URL: " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:5173" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host ""
Write-Host "Opening browser in 3 seconds..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Wait 3 seconds then open browser
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

# Start the dev server
npm run dev

