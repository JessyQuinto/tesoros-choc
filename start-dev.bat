@echo off
echo ===================================
echo  INICIANDO TESOROS DEL CHOCO
echo ===================================
echo.

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias de npm...
    npm install
    if errorlevel 1 (
        echo Error al instalar dependencias.
        pause
        exit /b 1
    )
)

echo.
echo ===================================
echo  CONFIGURACION DE SERVICIOS
echo ===================================
echo.
echo Frontend: http://localhost:5173 (este proyecto)
echo Backend:   http://localhost:3000 (backend-marketplace)
echo.
echo IMPORTANTE: Asegurate que el backend este ejecutandose
echo en el proyecto backend-marketplace en puerto 3000
echo.

echo.
echo Iniciando servidor de desarrollo frontend...
echo La aplicacion se abrira automaticamente en: http://localhost:5173
echo.
echo Para detener el servidor, presiona Ctrl+C
echo.

npm run dev

pause
