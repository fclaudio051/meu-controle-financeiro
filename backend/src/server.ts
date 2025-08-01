import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas depois do dotenv
import authRoutes from './routes/auth';
import peopleRoutes from './routes/people';
import entriesRoutes from './routes/entries';

const app = express();

// --- CORREÇÕES IMPLEMENTADAS AQUI ---
// Define a porta do servidor, usando a variável de ambiente do Render ou 3001 como fallback.
// O parseInt() converte o valor da string para um número, resolvendo o erro do TypeScript.
const PORT = parseInt(process.env.PORT as string, 10) || 3001;

// Define o host para o servidor. '0.0.0.0' garante que ele será acessível externamente no Render.
const HOST = '0.0.0.0';

// Define a origem permitida para o CORS, usando a variável de ambiente ou localhost como fallback.
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
// --- FIM DAS CORREÇÕES ---


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

// Rota de teste primeiro
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/people', peopleRoutes);
app.use('/api/entries', entriesRoutes);

// Altera a linha de app.listen para incluir o HOST e logs de debug.
app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
  console.log(`📋 API disponível em: http://${HOST}:${PORT}/api`);
  console.log(`💚 Health check: http://${HOST}:${PORT}/api/health`);
  console.log(`- Valores de ambiente detectados:`);
  console.log(`  - PORT: ${PORT}`);
  console.log(`  - CORS_ORIGIN: ${allowedOrigin}`);
});

export default app;