"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Carregar variáveis de ambiente
dotenv_1.default.config();
// Importar rotas modularizadas
const auth_1 = __importDefault(require("./routes/auth"));
const people_1 = __importDefault(require("./routes/people"));
const entries_1 = __importDefault(require("./routes/entries"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT, 10) || 3001;
const HOST = '0.0.0.0';
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
// Middlewares
app.use((0, cors_1.default)({
    origin: allowedOrigin,
    credentials: true
}));
app.use(express_1.default.json());
// Middleware de log
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Rota de health check no prefixo /api (como esperado pelo frontend)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor funcionando!',
        timestamp: new Date().toISOString()
    });
});
// Rotas da API
app.use('/auth', auth_1.default);
app.use('/people', people_1.default);
app.use('/entries', entries_1.default);
// Rota adicional para compatibilidade com health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor funcionando!',
        timestamp: new Date().toISOString()
    });
});
// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    });
});
// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.originalUrl} não existe`
    });
});
app.listen(PORT, HOST, () => {
    console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
    console.log(`📋 API disponível em: http://${HOST}:${PORT}`);
    console.log(`💚 Health check: http://${HOST}:${PORT}/api/health`);
    console.log(`- Valores de ambiente detectados:`);
    console.log(`  - PORT: ${PORT}`);
    console.log(`  - CORS_ORIGIN: ${allowedOrigin}`);
    console.log(`  - NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Arquitetura SOLID implementada:`);
    console.log(`  ✅ Single Responsibility Principle - Cada classe tem uma responsabilidade`);
    console.log(`  ✅ Open/Closed Principle - Extensível via interfaces`);
    console.log(`  ✅ Liskov Substitution Principle - Implementações podem ser substituídas`);
    console.log(`  ✅ Interface Segregation Principle - Interfaces específicas`);
    console.log(`  ✅ Dependency Inversion Principle - Dependências via abstrações`);
});
exports.default = app;
