import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { container } from '../container/DIContainer';

const router = express.Router();
const entryController = container.entryController;

// Aplique o middleware de autenticação a todas as rotas
router.use(authMiddleware);

// Listar entradas do usuário
router.get('/', entryController.getAll);

// Criar entrada
router.post('/', entryController.create);

// Atualizar entrada
router.put('/:id', entryController.update);

// Deletar entrada
router.delete('/:id', entryController.delete);

export default router;