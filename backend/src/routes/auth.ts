import express from 'express';
import { container } from '../container/DIContainer';

const router = express.Router();
const authController = container.authController;

// Rota de Registro
router.post('/register', authController.register);

// Rota de Login
router.post('/login', authController.login);

// Rota para verificar token
router.get('/me', authController.me);

export default router;