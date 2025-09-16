"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDB = exports.writeDB = exports.readDB = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.join(__dirname, '../../data');
const DB_FILE = path_1.default.join(DB_PATH, 'database.json');
// Criar diretório se não existir
if (!fs_1.default.existsSync(DB_PATH)) {
    fs_1.default.mkdirSync(DB_PATH, { recursive: true });
}
// Estrutura inicial do banco
const initialDB = {
    users: [],
    people: [],
    entries: []
};
// Inicializar arquivo se não existir
if (!fs_1.default.existsSync(DB_FILE)) {
    fs_1.default.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
}
const readDB = () => {
    try {
        const data = fs_1.default.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Erro ao ler banco de dados:', error);
        return initialDB;
    }
};
exports.readDB = readDB;
const writeDB = (data) => {
    try {
        fs_1.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    }
    catch (error) {
        console.error('Erro ao escrever banco de dados:', error);
    }
};
exports.writeDB = writeDB;
const resetDB = () => {
    (0, exports.writeDB)(initialDB);
};
exports.resetDB = resetDB;
