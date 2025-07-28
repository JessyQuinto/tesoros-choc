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
echo Iniciando servidor de desarrollo...
echo La aplicacion se abrira automaticamente en: http://localhost:3000
echo.
echo Para detener el servidor, presiona Ctrl+C
echo.

npm run dev

pause
