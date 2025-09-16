"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryService = void 0;
class EntryService {
    constructor(entryRepository, personRepository) {
        this.entryRepository = entryRepository;
        this.personRepository = personRepository;
    }
    async getEntriesByUserId(userId) {
        const entries = await this.entryRepository.findByUserId(userId);
        // Enriquecer com dados da pessoa
        const entriesWithPersonRef = [];
        for (const entry of entries) {
            const person = await this.personRepository.findById(entry.person);
            entriesWithPersonRef.push({
                ...entry,
                personRef: person && person.userId === userId
                    ? { id: person.id, name: person.name }
                    : null
            });
        }
        return entriesWithPersonRef;
    }
    async createEntry(data) {
        this.validateEntryData(data);
        // Verificar se a pessoa existe e pertence ao usuário
        const person = await this.personRepository.findById(data.person);
        if (!person || person.userId !== data.userId) {
            throw new Error('Pessoa não encontrada');
        }
        const newEntry = await this.entryRepository.create(data);
        return {
            ...newEntry,
            personRef: { id: person.id, name: person.name }
        };
    }
    async updateEntry(id, data, userId) {
        this.validateEntryData(data);
        // Verificar se a entrada existe e pertence ao usuário
        const entry = await this.entryRepository.findById(id);
        if (!entry || entry.userId !== userId) {
            throw new Error('Entrada não encontrada ou você não tem permissão');
        }
        // Verificar se a pessoa existe e pertence ao usuário
        const person = await this.personRepository.findById(data.person);
        if (!person || person.userId !== userId) {
            throw new Error('Pessoa não encontrada');
        }
        const updatedEntry = await this.entryRepository.update(id, data);
        if (!updatedEntry) {
            throw new Error('Erro ao atualizar entrada');
        }
        return updatedEntry;
    }
    async deleteEntry(id, userId) {
        // Verificar se a entrada existe e pertence ao usuário
        const entry = await this.entryRepository.findById(id);
        if (!entry || entry.userId !== userId) {
            throw new Error('Entrada não encontrada ou você não tem permissão');
        }
        const deleted = await this.entryRepository.delete(id);
        if (!deleted) {
            throw new Error('Erro ao deletar entrada');
        }
    }
    validateEntryData(data) {
        const { type, person, date, value, description } = data;
        if (!type || !person || !date || !value || !description) {
            throw new Error('Todos os campos são obrigatórios');
        }
        if (!['receita', 'despesa_fixa', 'despesa_variavel'].includes(type)) {
            throw new Error('Tipo de entrada inválido');
        }
        if (isNaN(Number(value)) || Number(value) <= 0) {
            throw new Error('Valor deve ser um número positivo');
        }
        if (!description.trim()) {
            throw new Error('Descrição é obrigatória');
        }
    }
}
exports.EntryService = EntryService;
