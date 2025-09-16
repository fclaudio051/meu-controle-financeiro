"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryController = void 0;
class EntryController {
    constructor(entryService) {
        this.entryService = entryService;
        this.getAll = async (req, res) => {
            try {
                const userId = req.userId;
                const entries = await this.entryService.getEntriesByUserId(userId);
                res.json(entries);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
                console.error("Erro ao buscar entradas:", errorMessage);
                res.status(500).json({ error: "Erro interno do servidor" });
            }
        };
        this.create = async (req, res) => {
            try {
                const { type, person, date, value, description } = req.body;
                const userId = req.userId;
                const entry = await this.entryService.createEntry({
                    type: type,
                    person,
                    date,
                    value: Number(value),
                    description,
                    userId,
                });
                res.status(201).json({
                    message: "Entrada criada com sucesso",
                    entry,
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
                console.error("Erro ao criar entrada:", errorMessage);
                if (errorMessage.includes("obrigatórios") ||
                    errorMessage.includes("inválido") ||
                    errorMessage.includes("não encontrada") ||
                    errorMessage.includes("positivo")) {
                    res.status(400).json({ error: errorMessage });
                }
                else {
                    res.status(500).json({ error: "Erro interno do servidor" });
                }
            }
        };
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                const { type, person, date, value, description } = req.body;
                const userId = req.userId;
                const entry = await this.entryService.updateEntry(id, {
                    type: type,
                    person,
                    date,
                    value: Number(value),
                    description,
                }, userId);
                res.json({
                    message: "Entrada atualizada com sucesso",
                    entry,
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
                console.error("Erro ao atualizar entrada:", errorMessage);
                if (errorMessage.includes("não encontrada") ||
                    errorMessage.includes("permissão")) {
                    res.status(404).json({ error: errorMessage });
                }
                else if (errorMessage.includes("obrigatórios") ||
                    errorMessage.includes("inválido") ||
                    errorMessage.includes("positivo")) {
                    res.status(400).json({ error: errorMessage });
                }
                else {
                    res.status(500).json({ error: "Erro interno do servidor" });
                }
            }
        };
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.userId;
                await this.entryService.deleteEntry(id, userId);
                res.json({ message: "Entrada deletada com sucesso" });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
                console.error("Erro ao deletar entrada:", errorMessage);
                if (errorMessage.includes("não encontrada") ||
                    errorMessage.includes("permissão")) {
                    res.status(404).json({ error: errorMessage });
                }
                else {
                    res.status(500).json({ error: "Erro interno do servidor" });
                }
            }
        };
    }
}
exports.EntryController = EntryController;
