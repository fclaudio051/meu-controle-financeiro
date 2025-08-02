import express from 'express';
import prisma from '../database'; // Importamos a instância do Prisma
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Person } from '../types';

const router = express.Router();

// Aplique o middleware de autenticação a todas as rotas deste arquivo
router.use(authMiddleware);

// Listar pessoas do usuário
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // 1. Buscar todas as pessoas do usuário usando o Prisma
    const userPeople = await prisma.person.findMany({
      where: { userId },
      orderBy: { name: 'asc' } // Boa prática: ordenar por nome
    });

    res.json(userPeople);
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
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

    // 2. Verificar se já existe uma pessoa com o mesmo nome para o usuário com Prisma
    const existingPerson = await prisma.person.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive', // Permite busca case-insensitive
        },
        userId,
      },
    });

    if (existingPerson) {
      return res.status(400).json({ error: 'Já existe uma pessoa com este nome' });
    }

    // 3. Criar a nova pessoa no banco de dados com Prisma
    const newPerson = await prisma.person.create({
      data: {
        name: name.trim(),
        userId,
      },
    });

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
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // 4. Verificar se há entradas vinculadas a esta pessoa com o Prisma
    const entriesCount = await prisma.financeEntry.count({
      where: {
        personId: id,
      },
    });

    if (entriesCount > 0) {
      return res.status(400).json({ 
        error: 'Não é possível deletar pessoa que possui lançamentos vinculados' 
      });
    }

    // 5. Deletar a pessoa do banco de dados com Prisma
    // O 'where' com userId garante que apenas o dono pode deletar
    const deletedPerson = await prisma.person.delete({
      where: {
        id,
        userId,
      },
    });

    res.json({ message: 'Pessoa deletada com sucesso' });
  } catch (error) {
    // Trata o erro caso a pessoa não seja encontrada (P2025)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pessoa não encontrada ou você não tem permissão para deletá-la' });
    }
    
    console.error('Erro ao deletar pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;