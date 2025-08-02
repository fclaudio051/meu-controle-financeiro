import express from 'express';
import prisma from '../database'; // Importamos a instância do Prisma
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { FinanceEntry, EntryType } from '../types';

const router = express.Router();

// Aplique o middleware de autenticação a todas as rotas deste arquivo
router.use(authMiddleware);

// Listar entradas do usuário
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // 1. Buscar todas as entradas do usuário usando o Prisma
    // O 'include' faz um JOIN com a tabela 'Person'
    const userEntries = await prisma.financeEntry.findMany({
      where: { userId },
      include: {
        personRef: {
          select: { id: true, name: true } // Selecionamos apenas os campos necessários da pessoa
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(userEntries);
  } catch (error) {
    console.error('Erro ao buscar entradas:', error);
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

    // 2. Verificar se a pessoa existe e pertence ao usuário com Prisma
    const personExists = await prisma.person.findFirst({
      where: {
        id: person,
        userId: userId,
      },
    });

    if (!personExists) {
      return res.status(400).json({ error: 'Pessoa não encontrada' });
    }

    // 3. Criar a nova entrada no banco de dados com Prisma
    const newEntry = await prisma.financeEntry.create({
      data: {
        type: type as EntryType,
        personId: person, // Conexão com o ID da pessoa
        date: new Date(date),
        value: Number(value),
        description: description.trim(),
        userId: userId,
      },
      include: {
        personRef: true
      }
    });

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

    // 4. Verificar se a entrada existe e pertence ao usuário com Prisma
    const entryToUpdate = await prisma.financeEntry.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!entryToUpdate) {
      return res.status(404).json({ error: 'Entrada não encontrada ou você não tem permissão' });
    }

    // 5. Verificar se a pessoa existe e pertence ao usuário com Prisma
    const personExists = await prisma.person.findFirst({
      where: {
        id: person,
        userId: userId,
      },
    });

    if (!personExists) {
      return res.status(400).json({ error: 'Pessoa não encontrada' });
    }

    // 6. Atualizar a entrada no banco de dados com Prisma
    const updatedEntry = await prisma.financeEntry.update({
      where: {
        id,
      },
      data: {
        type: type as EntryType,
        personId: person,
        date: new Date(date),
        value: Number(value),
        description: description.trim(),
      },
    });

    res.json({
      message: 'Entrada atualizada com sucesso',
      entry: updatedEntry
    });
  } catch (error) {
    console.error('Erro ao atualizar entrada:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar entrada
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // 7. Deletar a entrada do banco de dados com Prisma
    // O 'where' com userId garante que apenas o dono pode deletar
    const deletedEntry = await prisma.financeEntry.delete({
      where: {
        id,
        userId,
      },
    });

    res.json({ message: 'Entrada deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar entrada:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;