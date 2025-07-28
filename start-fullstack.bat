@echo off
echo ================================================
echo  INICIADOR COMPLETO - Frontend + Backend
echo ================================================
echo.

echo [1/3] Verificando puertos...
echo.

echo Verificando Backend (puerto 3000)...
netstat -an | findstr ":3000.*LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Backend detectado en puerto 3000
) else (
    echo ❌ Backend NO detectado en puerto 3000
    echo.
    echo ⚠️  ADVERTENCIA: Necesitas iniciar el backend primero
    echo.
    echo 🚀 Para iniciar el backend:
    echo    1. Abre otra terminal
    echo    2. cd D:\DOCUMENTOS\GitHub\backend-marketplace
    echo    3. npm run start
    echo.
    choice /m "¿Continuar sin backend (solo frontend)?"
    if errorlevel 2 exit /b 1
)

echo.
echo [2/3] Iniciando Frontend...
echo.
echo Frontend se iniciara en: http://localhost:5173
echo Backend debe estar en:    http://localhost:3000
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    npm install
    if errorlevel 1 (
        echo Error al instalar dependencias.
        pause
        exit /b 1
    )
)

echo.
echo [3/3] Abriendo navegador...
timeout /t 2 >nul
start http://localhost:5173

echo.
echo ✅ Iniciando servidor de desarrollo...
npm run dev

pause
