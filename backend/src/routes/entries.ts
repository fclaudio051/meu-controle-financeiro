import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { FinanceEntry, EntryType } from '../types';

const router = express.Router();

// Listar entradas do usuário
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const db = readDB();
    const userEntries = db.entries.filter(entry => entry.userId === req.userId);
    res.json(userEntries);
  } catch (error) {
    console.error('Erro ao buscar entradas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar entrada
router.post('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { type, person, date, value, description } = req.body;

    // Validações
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

    // Verificar se a pessoa existe e pertence ao usuário
    const personExists = db.people.find(
      p => p.id === person && p.userId === req.userId
    );

    if (!personExists) {
      return res.status(400).json({ error: 'Pessoa não encontrada' });
    }

    const newEntry: FinanceEntry = {
      id: uuidv4(),
      type: type as EntryType,
      person,
      date,
      value: Number(value),
      description: description.trim(),
      userId: req.userId!,
      createdAt: new Date().toISOString()
    };

    db.entries.push(newEntry);
    writeDB(db);

    res.status(201).json({
      message: 'Entrada criada com sucesso',
      entry: newEntry
    });
  } catch (error) {
    console.error('Erro ao criar entrada:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar entrada
router.put('/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { type, person, date, value, description } = req.body;

    // Validações
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

    const entryIndex = db.entries.findIndex(
      entry => entry.id === id && entry.userId === req.userId
    );

    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Entrada não encontrada' });
    }

    // Verificar se a pessoa existe e pertence ao usuário
    const personExists = db.people.find(
      p => p.id === person && p.userId === req.userId
    );

    if (!personExists) {
      return res.status(400).json({ error: 'Pessoa não encontrada' });
    }

    // Atualizar entrada
    db.entries[entryIndex] = {
      ...db.entries[entryIndex],
      type: type as EntryType,
      person,
      date,
      value: Number(value),
      description: description.trim()
    };

    writeDB(db);

    res.json({
      message: 'Entrada atualizada com sucesso',
      entry: db.entries[entryIndex]
    });
  } catch (error) {
    console.error('Erro ao atualizar entrada:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar entrada
router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const entryIndex = db.entries.findIndex(
      entry => entry.id === id && entry.userId === req.userId
    );

    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Entrada não encontrada' });
    }

    db.entries.splice(entryIndex, 1);
    writeDB(db);

    res.json({ message: 'Entrada deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar entrada:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
