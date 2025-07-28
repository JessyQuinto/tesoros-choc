@echo off
echo ===================================
echo  VERIFICADOR DE SISTEMA 
echo  Tesoros del Choco
echo ===================================
echo.

echo [1/7] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no esta instalado
    echo    Descarga Node.js desde: https://nodejs.org/
    goto :error
) else (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js: %%i
)

echo.
echo [2/7] Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm no esta disponible
    goto :error
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm: %%i
)

echo.
echo [3/7] Verificando dependencias del proyecto...
if exist "node_modules" (
    echo ✅ Carpeta node_modules existe
) else (
    echo ⚠️ Carpeta node_modules no existe - ejecuta 'npm install'
)

echo.
echo [4/7] Verificando archivos principales...
if exist "package.json" (
    echo ✅ package.json encontrado
) else (
    echo ❌ package.json no encontrado
    goto :error
)

if exist "vite.config.ts" (
    echo ✅ vite.config.ts encontrado
) else (
    echo ❌ vite.config.ts no encontrado
    goto :error
)

if exist "src\main.tsx" (
    echo ✅ src\main.tsx encontrado
) else (
    echo ❌ src\main.tsx no encontrado
    goto :error
)

echo.
echo [5/7] Verificando configuracion de TypeScript...
if exist "tsconfig.json" (
    echo ✅ tsconfig.json encontrado
) else (
    echo ❌ tsconfig.json no encontrado
    goto :error
)

echo.
echo [6/7] Verificando archivos de entorno...
if exist ".env.local" (
    echo ✅ .env.local encontrado
) else (
    echo ⚠️ .env.local no encontrado - usando valores por defecto
)

echo.
echo [7/7] Verificando puertos...
netstat -an | findstr ":3000 " >nul 2>&1
if errorlevel 1 (
    echo ✅ Puerto 3000 disponible
) else (
    echo ⚠️ Puerto 3000 ocupado - se usara puerto alternativo automaticamente
)

echo.
echo ===================================
echo  VERIFICACION COMPLETADA
echo ===================================
echo.
echo 🎉 El proyecto esta listo para ejecutarse!
echo.
echo Para iniciar el proyecto:
echo   1. Doble click en: start-dev.bat
echo   2. O ejecuta: npm run dev
echo.
echo El proyecto se abrira en: http://localhost:3000
echo.
goto :end

:error
echo.
echo ===================================
echo  ERROR EN VERIFICACION
echo ===================================
echo.
echo ❌ Se encontraron problemas que deben solucionarse
echo    antes de ejecutar el proyecto.
echo.

:end
pause
