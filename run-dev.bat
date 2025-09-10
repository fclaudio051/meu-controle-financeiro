@echo off
echo 🚀 Iniciando Controle Financeiro...
echo.

echo 📡 Iniciando Backend...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo 🎨 Iniciando Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo ✅ Serviços iniciados!
echo 📡 Backend: http://localhost:3001/api/health
echo 🎨 Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
