# 💰 Meu Controle Financeiro

Sistema completo de controle financeiro pessoal com interface moderna e backend robusto.

## 🚀 Tecnologias

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **React Icons** - Ícones
- **Glassmorphism** - Design moderno

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **JSON File Database** - Armazenamento persistente

## 🎨 Features

### ✨ Interface Moderna
- Design system com gradientes e glassmorphism
- Animações suaves e hover effects
- Layout responsivo
- Tema consistente em cores (indigo/purple)

### 🔐 Sistema de Autenticação
- Login/Registro de usuários
- Proteção de rotas
- Sessões persistentes
- Logout seguro

### 💸 Gestão Financeira
- **Receitas, Despesas Fixas e Variáveis**
- **Validação de valores positivos**
- **Filtros por mês/ano**
- **Resumo financeiro com gráficos**
- **Gerenciamento de pessoas**

### 🛡️ Validações
- Valores não podem ser negativos
- Campos obrigatórios
- Validação de email
- Senhas seguras

## 🚀 Como Executar

### 1. Clonar o Repositório
\`\`\`bash
git clone [url-do-repo]
cd meu-controle-financeiro
\`\`\`

### 2. Configurar Backend
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
O servidor estará rodando em: http://localhost:3001

### 3. Configurar Frontend
\`\`\`bash
# Em outro terminal, na raiz do projeto
npm install
npm run dev
\`\`\`
A aplicação estará rodando em: http://localhost:3000

## 🔧 Scripts Disponíveis

### Frontend
- \`npm run dev\` - Executar em modo desenvolvimento
- \`npm run build\` - Build para produção
- \`npm run start\` - Executar build de produção

### Backend
- \`npm run dev\` - Executar em modo desenvolvimento
- \`npm run build\` - Compilar TypeScript
- \`npm run start\` - Executar versão compilada

## 📡 API Endpoints

### Autenticação
- \`POST /api/auth/register\` - Registrar usuário
- \`POST /api/auth/login\` - Login
- \`GET /api/auth/me\` - Verificar token

### Pessoas
- \`GET /api/people\` - Listar pessoas
- \`POST /api/people\` - Criar pessoa
- \`DELETE /api/people/:id\` - Deletar pessoa

### Entradas Financeiras
- \`GET /api/entries\` - Listar entradas
- \`POST /api/entries\` - Criar entrada
- \`PUT /api/entries/:id\` - Atualizar entrada
- \`DELETE /api/entries/:id\` - Deletar entrada

## 💾 Banco de Dados

O sistema usa arquivos JSON para persistência:
- \`backend/data/database.json\` - Dados principais
- Estrutura: users, people, entries
- Backup automático em cada operação

## 🔒 Segurança

- Senhas hasheadas com bcrypt
- JWT para autenticação
- Middleware de autorização
- Validação de dados
- CORS configurado

## 🎨 Design System

### Cores Principais
- **Gradiente Principal**: Indigo → Purple
- **Receitas**: Emerald → Teal
- **Despesas**: Red → Pink
- **Neutros**: Gray shades

### Componentes
- Cards com glassmorphism
- Botões com gradientes
- Inputs com focus rings
- Modais modernos
- Tabelas responsivas

## 📱 Responsividade

- Mobile First
- Breakpoints: sm, md, lg, xl
- Grid system flexível
- Componentes adaptativos

## 🚀 Deploy

### Frontend (Vercel)
\`\`\`bash
npm run build
# Deploy para Vercel
\`\`\`

### Backend (Railway/Heroku)
\`\`\`bash
cd backend
npm run build
# Configurar variáveis de ambiente
# Deploy para plataforma escolhida
\`\`\`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (\`git checkout -b feature/nova-feature\`)
3. Commit (\`git commit -m 'Adicionar nova feature'\`)
4. Push (\`git push origin feature/nova-feature\`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ e muito ☕**
