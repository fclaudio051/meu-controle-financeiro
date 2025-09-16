"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const DIContainer_1 = require("../container/DIContainer");
const router = express_1.default.Router();
const personController = DIContainer_1.container.personController;
// Aplique o middleware de autenticação a todas as rotas
router.use(auth_1.authMiddleware);
// Listar pessoas do usuário
router.get('/', personController.getAll);
// Criar pessoa
router.post('/', personController.create);
// Deletar pessoa
router.delete('/:id', personController.delete);
exports.default = router;
