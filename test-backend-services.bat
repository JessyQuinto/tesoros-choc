@echo off
echo =============================================
echo  PRUEBA DE SERVICIOS BACKEND
echo =============================================
echo.

echo [1/5] Probando endpoint de productos...
echo.
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/products' -Method GET; Write-Host '✅ PRODUCTOS - Status:' $response.StatusCode; $json = $response.Content | ConvertFrom-Json; Write-Host 'Productos encontrados:' $json.data.Count } catch { Write-Host '❌ ERROR en productos:' $_.Exception.Message }"

echo.
echo [2/5] Probando endpoint raiz...
echo.
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/' -Method GET; Write-Host '✅ RAIZ - Status:' $response.StatusCode } catch { Write-Host '❌ ERROR en raiz:' $_.Exception.Message }"

echo.
echo [3/5] Probando endpoint de salud (si existe)...
echo.
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/health' -Method GET; Write-Host '✅ HEALTH - Status:' $response.StatusCode } catch { Write-Host '⚠️ Health endpoint no existe (normal)' }"

echo.
echo [4/5] Verificando CORS headers...
echo.
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/products' -Method GET; $corsHeader = $response.Headers['Access-Control-Allow-Origin']; if($corsHeader) { Write-Host '✅ CORS configurado:' $corsHeader } else { Write-Host '⚠️ CORS headers no encontrados' } } catch { Write-Host '❌ ERROR verificando CORS' }"

echo.
echo [5/5] Resumen de conectividad...
echo.
echo 📊 RESULTADO:
netstat -an | findstr ":3000.*LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Backend ejecutandose en puerto 3000
) else (
    echo ❌ Backend NO detectado en puerto 3000
)

netstat -an | findstr ":5173.*LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Frontend ejecutandose en puerto 5173
) else (
    echo ❌ Frontend NO detectado en puerto 5173
)

echo.
echo 🔗 ENDPOINTS DISPONIBLES:
echo   • Frontend: http://localhost:5173
echo   • Backend:  http://localhost:3000
echo   • API:      http://localhost:3000/api
echo.
echo 📝 CONCLUSION:
echo   Si ves Status 200 arriba, el backend funciona correctamente.
echo   Si hay errores, revisa que el backend este ejecutandose.
echo.

pause
