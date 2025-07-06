# 💼 Meu Controle Financeiro

**Meu Controle Financeiro** é uma aplicação web desenvolvida com React e TypeScript que permite o gerenciamento simples e eficiente de receitas e despesas mensais. É ideal para uso pessoal, familiar ou compartilhado entre grupos de pessoas.

---

## 📚 Visão Geral

- 🔎 **Filtros por mês e ano** para controle detalhado dos lançamentos.
- 👥 **Gerenciamento de pessoas** associadas a cada entrada financeira.
- 💰 **Classificação por tipo**: receita, despesa fixa e despesa variável.
- ♻️ **Despesas fixas recorrentes** com controle de meses repetidos.
- 📈 **Resumo geral e individual por pessoa** (receitas, despesas e saldo).
- 💾 **Persistência local** com `localStorage` (sem necessidade de backend).

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia     | Descrição                              |
|----------------|------------------------------------------|
| [React](https://reactjs.org/)       | Biblioteca para construção da interface     |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática e segurança de código      |
| [Tailwind CSS](https://tailwindcss.com/)     | Framework utilitário para estilização rápida |
| [React Icons](https://react-icons.github.io/react-icons/) | Ícones vetoriais modernos                    |
| `localStorage` | Armazenamento persistente no navegador  |

---

## 📂 Estrutura do Projeto

📦 meu-controle-financeiro/
├── components/
│ ├── EntryForm.tsx # Formulário de lançamento
│ ├── EntryTable.tsx # Tabela com listagem
│ ├── Modal.tsx # Componente modal reutilizável
│ ├── PersonManager.tsx # Gerenciador de pessoas
│ └── Summary.tsx # Resumo financeiro do mês
├── types/
│ ├── Entry.ts # Tipagem para entradas financeiras
│ └── person.ts # Tipagem para pessoas
├── App.tsx # Arquivo principal com toda a lógica
├── globals.css # Estilização global com Tailwind

---

## ▶️ Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/fclaudio051/meu-controle-financeiro.git

# Acesse o diretório
cd meu-controle-financeiro

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

Acesse em: http://localhost:3000


## 📊 Visualizações e Relatórios

 Dashboard com gráficos interativos (ex: Pie, Bar, Line) usando Recharts ou Chart.js.

 Resumo anual/mensal consolidado para análise de tendências.

 Exportação para PDF, Excel ou CSV de todos os lançamentos.

☁️ Integrações e Backend
 Autenticação de usuários (via Firebase Auth ou Auth.js).

 Armazenamento em nuvem com Firestore ou Supabase, mantendo dados sincronizados entre dispositivos.

 API REST ou GraphQL para persistência robusta.

📱 Experiência do Usuário (UX)
 Modo escuro com toggle automático/manual.

 Responsividade aprimorada para mobile e tablets.

 Sistema de categorias personalizáveis (alimentação, transporte, lazer etc.).

 Busca e filtro por descrição, valor ou pessoa.


##👤 Autor
Desenvolvido por Cláudio Faustino