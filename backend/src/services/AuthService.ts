import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IAuthService, LoginRequest, RegisterRequest, AuthResponse } from './interfaces/IAuthService';
import { User } from '../types';

export class AuthService implements IAuthService {
  private readonly JWT_SECRET: string;
  
  constructor(private userRepository: IUserRepository) {
    this.JWT_SECRET = process.env.JWT_SECRET!;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
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
    const hashedPassword = await bcrypt.hash(password, 10);

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

  async login(data: LoginRequest): Promise<AuthResponse> {
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
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

  async validateToken(token: string): Promise<Omit<User, 'password'>> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
      
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: '7d' });
  }
}