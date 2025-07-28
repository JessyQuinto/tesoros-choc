@echo off
echo ======================================
echo   TESOROS DEL CHOCO - PROYECTO SENA
echo ======================================
echo.
echo Iniciando servidor de desarrollo...
echo.
echo La aplicacion se abrira automaticamente en:
echo http://localhost:3000
echo.
echo Si no se abre automaticamente, presiona Ctrl+C
echo y ejecuta: npm run dev
echo.
echo ======================================

cd /d "%~dp0"
npm run dev

pause
