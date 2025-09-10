# 🔧 Troubleshooting - Controle Financeiro

## 🚨 Problema: "Failed to fetch"

### ❓ **Causa:**
O backend não está rodando ou não está acessível na porta 3001.

### ✅ **Soluções:**

#### **Opção 1: Usar Modo Offline**
```bash
# Execute apenas o frontend
./run-frontend-only.bat
```
- ✅ Funciona sem backend
- ✅ Dados salvos no navegador
- ✅ Todas as funcionalidades disponíveis

#### **Opção 2: Iniciar Backend Manualmente**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
npm run dev
```

#### **Opção 3: Verificar Porta em Uso**
```bash
# Verificar se porta 3001 está ocupada
netstat -ano | findstr :3001

# Se ocupada, matar processo
taskkill /PID [PID_NUMBER] /F
```

---

## 🔐 **Credenciais para Teste (Modo Offline)**

### **Contas Disponíveis:**
- **Admin:** admin@exemplo.com / admin123
- **User:** user@exemplo.com / user123  
- **Teste:** teste@teste.com / 123456

---

## 🔄 **Modo Offline vs Online**

### **💻 Modo Offline (LocalStorage):**
- ✅ Funciona sem backend
- ✅ Dados persistem no navegador
- ❌ Dados não compartilhados entre dispositivos
- ❌ Dados perdidos se limpar navegador

### **🌐 Modo Online (API + Banco):**
- ✅ Dados persistentes no servidor
- ✅ Compartilhamento entre dispositivos
- ✅ Backup automático
- ❌ Requer backend funcionando

---

## 🛠️ **Comandos Úteis**

### **Verificar Status:**
```bash
# Health check da API
curl http://localhost:3001/api/health

# Verificar processos na porta 3001
netstat -ano | findstr :3001
```

### **Resetar Aplicação:**
```bash
# Limpar dados do navegador
# F12 > Application > Storage > Clear All

# Resetar backend (se rodando)
curl -X DELETE http://localhost:3001/api/reset
```

### **Reinstalar Dependências:**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

---

## 📱 **Funcionalidades em Cada Modo**

| Funcionalidade | Offline | Online |
|---|---|---|
| Login/Registro | ✅ | ✅ |
| Criar Pessoas | ✅ | ✅ |
| Criar Entradas | ✅ | ✅ |
| Editar/Deletar | ✅ | ✅ |
| Filtros Data | ✅ | ✅ |
| Resumo Financeiro | ✅ | ✅ |
| Persistência | Navegador | Servidor |
| Multi-dispositivo | ❌ | ✅ |

---

## 🚀 **Scripts Disponíveis**

- `run-frontend-only.bat` - Apenas frontend (modo offline)
- `run-dev.bat` - Frontend + Backend completo
- `test-api.bat` - Testar endpoints da API

---

## 📞 **Se Nada Funcionar**

1. **Verifique Node.js:** `node --version` (requer v18+)
2. **Reinstale dependências:** `npm install`
3. **Use modo offline:** `./run-frontend-only.bat`
4. **Limpe cache:** Delete pasta `node_modules` e `npm install`

A aplicação **sempre funcionará** em modo offline! 🎉
