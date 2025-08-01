import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Person } from '../types';

const router = express.Router();

// Listar pessoas do usuário
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const db = readDB();
    const userPeople = db.people.filter(person => person.userId === req.userId);
    res.json(userPeople);
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar pessoa
router.post('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const db = readDB();

    // Verificar se já existe pessoa com mesmo nome para o usuário
    const existingPerson = db.people.find(
      person => person.name.toLowerCase() === name.toLowerCase() && person.userId === req.userId
    );

    if (existingPerson) {
      return res.status(400).json({ error: 'Já existe uma pessoa com este nome' });
    }

    const newPerson: Person = {
      id: uuidv4(),
      name: name.trim(),
      userId: req.userId!,
      createdAt: new Date().toISOString()
    };

    db.people.push(newPerson);
    writeDB(db);

    res.status(201).json({
      message: 'Pessoa criada com sucesso',
      person: newPerson
    });
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar pessoa
router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const personIndex = db.people.findIndex(
      person => person.id === id && person.userId === req.userId
    );

    if (personIndex === -1) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    // Verificar se há entradas vinculadas a esta pessoa
    const hasEntries = db.entries.some(entry => entry.person === id);
    if (hasEntries) {
      return res.status(400).json({ 
        error: 'Não é possível deletar pessoa que possui lançamentos vinculados' 
      });
    }

    db.people.splice(personIndex, 1);
    writeDB(db);

    res.json({ message: 'Pessoa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
