import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas depois do dotenv
import authRoutes from './routes/auth';
import peopleRoutes from './routes/people';
import entriesRoutes from './routes/entries';

const app = express();
const prisma = new PrismaClient();
const PORT = parseInt(process.env.PORT as string, 10) || 3001;
const HOST = '0.0.0.0';
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middlewares
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json());

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

// Corrigido: Rotas da API sem prefixo /api, pois o frontend já foi corrigido
app.use('/auth', authRoutes);
app.use('/people', peopleRoutes);
app.use('/entries', entriesRoutes);

// Rota adicional para compatibilidade com health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
});

export default app;