"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const DIContainer_1 = require("../container/DIContainer");
const router = express_1.default.Router();
const entryController = DIContainer_1.container.entryController;
// Aplique o middleware de autenticação a todas as rotas
router.use(auth_1.authMiddleware);
// Listar entradas do usuário
router.get('/', entryController.getAll);
// Criar entrada
router.post('/', entryController.create);
// Atualizar entrada
router.put('/:id', entryController.update);
// Deletar entrada
router.delete('/:id', entryController.delete);
exports.default = router;
