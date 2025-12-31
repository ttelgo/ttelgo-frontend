@echo off
echo ========================================
echo   TTelGo Web Development Server
echo ========================================
echo.
echo Starting dev server...
echo.
echo Localhost URL: http://localhost:5173
echo.
echo Opening browser in 3 seconds...
echo Press Ctrl+C to stop the server
echo.

timeout /t 3 /nobreak > nul
start http://localhost:5173

REM Start the dev server (this will keep the window open)
call npm run dev
pause

