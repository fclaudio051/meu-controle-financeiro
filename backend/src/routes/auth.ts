import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // Adicionado para gerar IDs únicos
import { readDB, writeDB } from '../database'; // Importação corrigida para as funções do DB de arquivo
import { Database, User } from '../types';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// Rota de Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // 1. Ler o banco de dados
    const db = readDB();

    // 2. Verificar se o usuário já existe
    const existingUser = db.users.find(u => u.email === email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Criar o novo usuário com a sintaxe de objeto correta
    // CORREÇÃO: Adicionada a propriedade 'createdAt' com a data e hora atuais
    const newUser: User = {
      id: uuidv4(), // Gerar um novo ID único
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(), // Adicionada a data de criação
    };

    // 4. Adicionar o novo usuário e salvar no banco de dados
    db.users.push(newUser);
    writeDB(db);

    // 5. Gerar token
    const token = jwt.sign(
      { userId: newUser.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro no registro:', errorMessage);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // 1. Ler o banco de dados
    const db = readDB();

    // 2. Encontrar o usuário
    const user = db.users.find(u => u.email === email);

    // 3. Verificar se o usuário existe e se a senha está correta
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 4. Gerar token
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro no login:', errorMessage);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para verificar token
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // 1. Ler o banco de dados
    const db = readDB();

    // 2. Encontrar o usuário
    const user = db.users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Token inválido';
    res.status(401).json({ error: errorMessage });
  }
});

export default router;
