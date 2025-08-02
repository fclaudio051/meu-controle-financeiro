import express from 'express';
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos para as entradas
import { readDB, writeDB } from '../database'; // Importação corrigida para as funções do DB de arquivo
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { FinanceEntry, EntryType, Person } from '../types';

const router = express.Router();

// Aplique o middleware de autenticação a todas as rotas deste arquivo
router.use(authMiddleware);

// Listar entradas do usuário
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const db = readDB();

    // 1. Filtrar as entradas do usuário e a pessoa de referência
    const userEntries = db.entries
      .filter(entry => entry.userId === userId)
      .map(entry => {
        // Encontrar a pessoa de referência para cada entrada
        // CORREÇÃO: Usando entry.person em vez de entry.personId
        const personRef = db.people.find(p => p.id === entry.person && p.userId === userId);
        return {
          ...entry,
          personRef: personRef ? { id: personRef.id, name: personRef.name } : null
        };
      })
      // 2. Ordenar as entradas por data de criação de forma decrescente
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(userEntries);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro ao buscar entradas:', errorMessage);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar entrada
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { type, person, date, value, description } = req.body;
    const userId = req.userId!;

    // Validações (lógica mantida)
    if (!type || !person || !date || !value || !description) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    if (!['receita', 'despesa_fixa', 'despesa_variavel'].includes(type)) {
      return res.status(400).json({ error: 'Tipo de entrada inválido' });
    }
    if (isNaN(Number(value)) || Number(value) <= 0) {
      return res.status(400).json({ error: 'Valor deve ser um número positivo' });
    }
    if (!description.trim()) {
      return res.status(400).json({ error: 'Descrição é obrigatória' });
    }

    const db = readDB();
    
    // 2. Verificar se a pessoa existe e pertence ao usuário
    const personExists = db.people.find(p => p.id === person && p.userId === userId);

    if (!personExists) {
      return res.status(400).json({ error: 'Pessoa não encontrada' });
    }

    // 3. Criar a nova entrada
    // CORREÇÃO: Usando a propriedade 'person' em vez de 'personId'
    const newEntry: FinanceEntry = {
      id: uuidv4(),
      type: type as EntryType,
      person: person, // A ID da pessoa é atribuída à propriedade 'person'
      date: new Date(date).toISOString(),
      value: Number(value),
      description: description.trim(),
      userId: userId,
      createdAt: new Date().toISOString()
    };

    // 4. Adicionar a nova entrada e salvar no banco de dados
    db.entries.push(newEntry);
    writeDB(db);

    const personRef = { id: personExists.id, name: personExists.name };
    const entryWithPersonRef = { ...newEntry, personRef };

    res.status(201).json({
      message: 'Entrada criada com sucesso',
      entry: entryWithPersonRef
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro ao criar entrada:', errorMessage);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar entrada
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { type, person, date, value, description } = req.body;
    const userId = req.userId!;

    // Validações (lógica mantida)
    if (!type || !person || !date || !value || !description) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    if (!['receita', 'despesa_fixa', 'despesa_variavel'].includes(type)) {
      return res.status(400).json({ error: 'Tipo de entrada inválido' });
    }
    if (isNaN(Number(value)) || Number(value) <= 0) {
      return res.status(400).json({ error: 'Valor deve ser um número positivo' });
    }

    const db = readDB();
    
    // 4. Encontrar o índice da entrada a ser atualizada
    const entryIndex = db.entries.findIndex(entry => entry.id === id && entry.userId === userId);

    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Entrada não encontrada ou você não tem permissão' });
    }

    // 5. Verificar se a pessoa existe e pertence ao usuário
    const personExists = db.people.find(p => p.id === person && p.userId === userId);

    if (!personExists) {
      return res.status(400).json({ error: 'Pessoa não encontrada' });
    }

    // 6. Atualizar a entrada no array
    // CORREÇÃO: Usando a propriedade 'person' em vez de 'personId'
    db.entries[entryIndex] = {
      ...db.entries[entryIndex], // Manter as propriedades existentes
      type: type as EntryType,
      person: person, // A ID da pessoa é atribuída à propriedade 'person'
      date: new Date(date).toISOString(),
      value: Number(value),
      description: description.trim(),
    };
    
    writeDB(db);

    res.json({
      message: 'Entrada atualizada com sucesso',
      entry: db.entries[entryIndex]
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro ao atualizar entrada:', errorMessage);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar entrada
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const db = readDB();

    // 7. Encontrar o índice da entrada a ser deletada
    const entryIndex = db.entries.findIndex(entry => entry.id === id && entry.userId === userId);
    
    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Entrada não encontrada ou você não tem permissão' });
    }

    // Remover a entrada do array
    db.entries.splice(entryIndex, 1);
    
    writeDB(db);

    res.json({ message: 'Entrada deletada com sucesso' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro ao deletar entrada:', errorMessage);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
