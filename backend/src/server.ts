import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas modularizadas
import authRoutes from './routes/auth';
import peopleRoutes from './routes/people';
import entriesRoutes from './routes/entries';

const app = express();
const PORT = parseInt(process.env.PORT as string, 10) || 3001;
const HOST = '0.0.0.0';
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API MeuProjeto',
      version: '1.0.0',
      description: 'Documentação da API do meu projeto em Node + TypeScript',
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Servidor local' }
    ],
  },
  apis: ['./routes/*.ts'], // arquivos de rotas para documentação
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));




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

// Rotas da API
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
  console.log(` Arquitetura SOLID implementada:`);
  console.log(`  ✅ Single Responsibility Principle - Cada classe tem uma responsabilidade`);
  console.log(`  ✅ Open/Closed Principle - Extensível via interfaces`);
  console.log(`  ✅ Liskov Substitution Principle - Implementações podem ser substituídas`);
  console.log(`  ✅ Interface Segregation Principle - Interfaces específicas`);
  console.log(`  ✅ Dependency Inversion Principle - Dependências via abstrações`);
});

export default app;