import fs from 'fs';
import path from 'path';
import { Database } from '../types';

const DB_PATH = path.join(__dirname, '../../data');
const DB_FILE = path.join(DB_PATH, 'database.json');

// Criar diretório se não existir
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Estrutura inicial do banco
const initialDB: Database = {
  users: [],
  people: [],
  entries: []
};

// Inicializar arquivo se não existir
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
}

export const readDB = (): Database => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler banco de dados:', error);
    return initialDB;
  }
};

export const writeDB = (data: Database): void => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao escrever banco de dados:', error);
  }
};

export const resetDB = (): void => {
  writeDB(initialDB);
};
