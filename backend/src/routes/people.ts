import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { container } from '../container/DIContainer';

const router = express.Router();
const personController = container.personController;

// Aplique o middleware de autenticação a todas as rotas
router.use(authMiddleware);

// Listar pessoas do usuário
router.get('/', personController.getAll);

// Criar pessoa
router.post('/', personController.create);

// Deletar pessoa
router.delete('/:id', personController.delete);

export default router;