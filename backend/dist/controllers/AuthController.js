"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.register = async (req, res) => {
            try {
                const { name, email, password } = req.body;
                const result = await this.authService.register({ name, email, password });
                res.status(201).json({
                    message: 'Usuário criado com sucesso',
                    user: result.user,
                    token: result.token
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
                console.error('Erro no registro:', errorMessage);
                // Retornar status apropriado baseado no erro
                if (errorMessage.includes('Email já está em uso')) {
                    res.status(400).json({ error: errorMessage });
                }
                else if (errorMessage.includes('obrigatórios')) {
                    res.status(400).json({ error: errorMessage });
                }
                else {
                    res.status(500).json({ error: 'Erro interno do servidor' });
                }
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const result = await this.authService.login({ email, password });
                res.json({
                    message: 'Login realizado com sucesso',
                    user: result.user,
                    token: result.token
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
                console.error('Erro no login:', errorMessage);
                if (errorMessage.includes('obrigatórios')) {
                    res.status(400).json({ error: errorMessage });
                }
                else if (errorMessage.includes('Credenciais inválidas')) {
                    res.status(401).json({ error: errorMessage });
                }
                else {
                    res.status(500).json({ error: 'Erro interno do servidor' });
                }
            }
        };
        this.me = async (req, res) => {
            try {
                const token = req.header('Authorization')?.replace('Bearer ', '');
                if (!token) {
                    res.status(401).json({ error: 'Token de acesso requerido' });
                    return;
                }
                const user = await this.authService.validateToken(token);
                res.json({ user });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Token inválido';
                res.status(401).json({ error: errorMessage });
            }
        };
    }
}
exports.AuthController = AuthController;
