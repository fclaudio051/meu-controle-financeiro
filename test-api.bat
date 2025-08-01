@echo off
echo 🧪 Testando API...
echo.

echo 📡 Testando health check...
curl -s http://localhost:3001/api/health
echo.
echo.

echo 🔐 Testando registro...
curl -s -X POST http://localhost:3001/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Teste\",\"email\":\"teste@teste.com\",\"password\":\"123456\"}"
echo.
echo.

echo ✅ Testes concluídos!
pause
