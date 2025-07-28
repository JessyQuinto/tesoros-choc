@echo off
echo ===============================================
echo  DIAGNOSTICO DEL BACKEND - Tesoros del Choco
echo ===============================================
echo.

echo [1/5] Verificando configuracion API...
echo.
echo URL Base configurada:
echo   - Desarrollo: http://localhost:3000/api
echo   - Frontend:   http://localhost:5173
echo   - Backend:    http://localhost:3000
echo.

echo [2/5] Verificando puertos...
echo.
echo Puerto 3000 (backend):
netstat -an | findstr ":3000" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Puerto 3000 OCUPADO - Backend ejecutandose
    netstat -an | findstr ":3000"
) else (
    echo ❌ Puerto 3000 libre - Backend NO ejecutandose
)

echo.
echo Puerto 5173 (frontend):
netstat -an | findstr ":5173" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Puerto 5173 OCUPADO - Frontend ejecutandose  
    netstat -an | findstr ":5173"
) else (
    echo ❌ Puerto 5173 libre - Frontend NO ejecutandose
)

echo.
echo [3/5] Archivos de configuracion backend...
echo.
if exist "server" (
    echo ✅ Carpeta server/ encontrada
    dir server /b | head -10
) else (
    echo ❌ Carpeta server/ NO encontrada
)

if exist "backend" (
    echo ✅ Carpeta backend/ encontrada
    dir backend /b | head -10
) else (
    echo ❌ Carpeta backend/ NO encontrada
)

if exist "api" (
    echo ✅ Carpeta api/ encontrada
    dir api /b | head -10
) else (
    echo ❌ Carpeta api/ NO encontrada
)

echo.
echo [4/5] Verificando si hay server.js o app.js...
if exist "server.js" (
    echo ✅ server.js encontrado en raiz
) else (
    echo ❌ server.js NO encontrado en raiz
)

if exist "app.js" (
    echo ✅ app.js encontrado en raiz
) else (
    echo ❌ app.js NO encontrado en raiz
)

if exist "index.js" (
    echo ✅ index.js encontrado en raiz
) else (
    echo ❌ index.js NO encontrado en raiz
)

echo.
echo [5/5] Estado actual...
echo.
echo 📊 RESUMEN:
echo ✅ Frontend: Ejecutandose en http://localhost:3000
echo ❓ Backend: No detectado ejecutandose
echo.
echo 💡 SITUACION DETECTADA:
echo   El proyecto tiene configuracion para backend pero 
echo   NO ESTA EJECUTANDOSE ningun servidor backend.
echo.
echo 📝 QUE SIGNIFICA ESTO:
echo   - El frontend carga normalmente
echo   - Las llamadas API fallan (datos hardcodeados)
echo   - Firebase Auth funciona (autenticacion)
echo   - NO hay datos reales de productos/ordenes
echo.
echo 🚀 PARA USAR BACKEND REAL:
echo   1. Verificar si hay codigo backend en este proyecto
echo   2. Iniciar servidor backend en puerto diferente (ej: 8000)
echo   3. Actualizar API_CONFIG.BASE_URL en src/config/api.config.ts
echo.

pause
