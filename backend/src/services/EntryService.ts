import { IEntryRepository } from '../repositories/interfaces/IEntryRepository';
import { IPersonRepository } from '../repositories/interfaces/IPersonRepository';
import { 
  IEntryService, 
  CreateEntryRequest, 
  UpdateEntryRequest, 
  EntryWithPersonRef 
} from './interfaces/IEntryService';
import { FinanceEntry, EntryType } from '../types';

export class EntryService implements IEntryService {
  constructor(
    private entryRepository: IEntryRepository,
    private personRepository: IPersonRepository
  ) {}

  async getEntriesByUserId(userId: string): Promise<EntryWithPersonRef[]> {
    const entries = await this.entryRepository.findByUserId(userId);
    
    // Enriquecer com dados da pessoa
    const entriesWithPersonRef: EntryWithPersonRef[] = [];
    
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

  async createEntry(data: CreateEntryRequest): Promise<EntryWithPersonRef> {
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

  async updateEntry(id: string, data: UpdateEntryRequest, userId: string): Promise<FinanceEntry> {
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

  async deleteEntry(id: string, userId: string): Promise<void> {
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

  private validateEntryData(data: { type: EntryType; person: string; date: string; value: number; description: string }): void {
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