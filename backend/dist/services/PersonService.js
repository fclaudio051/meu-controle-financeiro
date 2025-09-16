"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonService = void 0;
class PersonService {
    constructor(personRepository, entryRepository) {
        this.personRepository = personRepository;
        this.entryRepository = entryRepository;
    }
    async getPersonsByUserId(userId) {
        return this.personRepository.findByUserId(userId);
    }
    async createPerson(data) {
        const { name, userId } = data;
        // Validação
        if (!name || !name.trim()) {
            throw new Error('Nome é obrigatório');
        }
        // Verificar se já existe pessoa com o mesmo nome
        const existingPerson = await this.personRepository.findByName(name, userId);
        if (existingPerson) {
            throw new Error('Já existe uma pessoa com este nome');
        }
        return this.personRepository.create({ name, userId });
    }
    async deletePerson(id, userId) {
        // Verificar se a pessoa existe e pertence ao usuário
        const person = await this.personRepository.findById(id);
        if (!person || person.userId !== userId) {
            throw new Error('Pessoa não encontrada ou você não tem permissão para deletá-la');
        }
        // Verificar se há entradas vinculadas
        const entriesWithPerson = await this.entryRepository.findByPersonId(id);
        if (entriesWithPerson.length > 0) {
            throw new Error('Não é possível deletar pessoa que possui lançamentos vinculados');
        }
        const deleted = await this.personRepository.delete(id);
        if (!deleted) {
            throw new Error('Erro ao deletar pessoa');
        }
    }
}
exports.PersonService = PersonService;
