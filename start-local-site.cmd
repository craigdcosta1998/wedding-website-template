@echo off
setlocal
cd /d "%~dp0"

powershell.exe -NoProfile -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/en' -UseBasicParsing -TimeoutSec 2; if ($response.StatusCode -eq 200) { exit 0 } } catch {}; exit 1"
if %errorlevel% equ 0 (
  echo Wedding site is already running at http://127.0.0.1:3000/en
  exit /b 0
)

start "Wedding Website" /min cmd /c "npm.cmd run dev -- --port 3000"
echo Starting the wedding site. Open http://127.0.0.1:3000/en in your browser in a few seconds.
echo Keep the minimized Wedding Website server window open while reviewing.
endlocal
