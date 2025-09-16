"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.JWT_SECRET = process.env.JWT_SECRET;
    }
    async register(data) {
        const { name, email, password } = data;
        // Validação básica
        if (!name || !email || !password) {
            throw new Error('Todos os campos são obrigatórios');
        }
        // Verificar se o usuário já existe
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email já está em uso');
        }
        // Hash da senha
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Criar usuário
        const newUser = await this.userRepository.create({
            name,
            email,
            password: hashedPassword
        });
        // Gerar token
        const token = this.generateToken(newUser.id);
        // Retornar sem a senha
        const { password: _, ...userWithoutPassword } = newUser;
        return {
            user: userWithoutPassword,
            token
        };
    }
    async login(data) {
        const { email, password } = data;
        // Validação básica
        if (!email || !password) {
            throw new Error('Email e senha são obrigatórios');
        }
        // Encontrar usuário
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciais inválidas');
        }
        // Verificar senha
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas');
        }
        // Gerar token
        const token = this.generateToken(user.id);
        // Retornar sem a senha
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
    async validateToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            const user = await this.userRepository.findById(decoded.userId);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            throw new Error('Token inválido');
        }
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, this.JWT_SECRET, { expiresIn: '7d' });
    }
}
exports.AuthService = AuthService;
