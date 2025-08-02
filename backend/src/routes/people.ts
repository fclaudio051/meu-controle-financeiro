import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../database'; // Importação corrigida para as funções do DB de arquivo
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Person } from '../types';

const router = express.Router();

// Aplique o middleware de autenticação a todas as rotas deste arquivo
router.use(authMiddleware);

// Listar pessoas do usuário
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const db = readDB();

    // 1. Filtrar as pessoas do usuário
    const userPeople = db.people
      .filter(person => person.userId === userId)
      .sort((a, b) => a.name.localeCompare(b.name)); // Ordena por nome

    res.json(userPeople);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro ao buscar pessoas:', errorMessage);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar pessoa
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId!;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const db = readDB();

    // 2. Verificar se já existe uma pessoa com o mesmo nome para o usuário
    const existingPerson = db.people.find(
      person => person.userId === userId && person.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existingPerson) {
      return res.status(400).json({ error: 'Já existe uma pessoa com este nome' });
    }

    // 3. Criar a nova pessoa
    const newPerson: Person = {
      id: uuidv4(),
      name: name.trim(),
      userId,
      createdAt: new Date().toISOString()
    };

    // 4. Adicionar a nova pessoa e salvar no banco de dados
    db.people.push(newPerson);
    writeDB(db);

    res.status(201).json({
      message: 'Pessoa criada com sucesso',
      person: newPerson
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro ao criar pessoa:', errorMessage);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar pessoa
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const db = readDB();

    // 4. Verificar se há entradas vinculadas a esta pessoa
    const entriesWithPerson = db.entries.filter(entry => entry.person === id);

    if (entriesWithPerson.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível deletar pessoa que possui lançamentos vinculados' 
      });
    }

    // 5. Encontrar o índice da pessoa a ser deletada
    const personIndex = db.people.findIndex(person => person.id === id && person.userId === userId);

    if (personIndex === -1) {
      return res.status(404).json({ error: 'Pessoa não encontrada ou você não tem permissão para deletá-la' });
    }

    // Remover a pessoa do array
    db.people.splice(personIndex, 1);
    
    writeDB(db);

    res.json({ message: 'Pessoa deletada com sucesso' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro ao deletar pessoa:', errorMessage);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
