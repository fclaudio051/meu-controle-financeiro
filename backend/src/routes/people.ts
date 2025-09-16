import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { container } from '../container/DIContainer';

const router = express.Router();
const personController = container.personController;

// Aplique o middleware de autenticação a todas as rotas
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: People
 *   description: Rotas para gerenciar pessoas
 */

/**
 * @swagger
 * /people:
 *   get:
 *     summary: Lista todas as pessoas do usuário
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pessoas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 * 
 */ 
// Listar pessoas do usuário
router.get('/', personController.getAll);

/**
 * @swagger
 * /people:
 *   post:
 *     summary: Cria uma nova pessoa
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pessoa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 */

// Criar pessoa
router.post('/', personController.create);

/**
 * @swagger
 * /people/{id}:
 *   delete:
 *     summary: Deleta uma pessoa pelo ID
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da pessoa a ser deletada
 *     responses:
 *       200:
 *         description: Pessoa deletada com sucesso
 *       404:
 *         description: Pessoa não encontrada
 */

// Deletar pessoa
router.delete('/:id', personController.delete);

export default router;