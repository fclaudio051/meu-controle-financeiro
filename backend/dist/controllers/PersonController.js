"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonController = void 0;
class PersonController {
    constructor(personService) {
        this.personService = personService;
        this.getAll = async (req, res) => {
            try {
                const userId = req.userId;
                const people = await this.personService.getPersonsByUserId(userId);
                res.json(people);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
                console.error("Erro ao buscar pessoas:", errorMessage);
                res.status(500).json({ error: "Erro interno do servidor" });
            }
        };
        this.create = async (req, res) => {
            try {
                const { name } = req.body;
                const userId = req.userId;
                const person = await this.personService.createPerson({ name, userId });
                res.status(201).json({
                    message: "Pessoa criada com sucesso",
                    person,
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
                console.error("Erro ao criar pessoa:", errorMessage);
                if (errorMessage.includes("obrigatório") ||
                    errorMessage.includes("já existe")) {
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
                await this.personService.deletePerson(id, userId);
                res.json({ message: "Pessoa deletada com sucesso" });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor";
                console.error("Erro ao deletar pessoa:", errorMessage);
                if (errorMessage.includes("não encontrada") ||
                    errorMessage.includes("permissão")) {
                    res.status(404).json({ error: errorMessage });
                }
                else if (errorMessage.includes("lançamentos vinculados")) {
                    res.status(400).json({ error: errorMessage });
                }
                else {
                    res.status(500).json({ error: "Erro interno do servidor" });
                }
            }
        };
    }
}
exports.PersonController = PersonController;
