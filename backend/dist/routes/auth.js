"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DIContainer_1 = require("../container/DIContainer");
const router = express_1.default.Router();
const authController = DIContainer_1.container.authController;
// Rota de Registro
router.post('/register', authController.register);
// Rota de Login
router.post('/login', authController.login);
// Rota para verificar token
router.get('/me', authController.me);
exports.default = router;
