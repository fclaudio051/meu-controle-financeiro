import { IPersonRepository } from '../repositories/interfaces/IPersonRepository';
import { IEntryRepository } from '../repositories/interfaces/IEntryRepository';
import { IPersonService, CreatePersonRequest } from './interfaces/IPersonService';
import { Person } from '../types';

export class PersonService implements IPersonService {
  constructor(
    private personRepository: IPersonRepository,
    private entryRepository: IEntryRepository
  ) {}

  async getPersonsByUserId(userId: string): Promise<Person[]> {
    return this.personRepository.findByUserId(userId);
  }

  async createPerson(data: CreatePersonRequest): Promise<Person> {
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

  async deletePerson(id: string, userId: string): Promise<void> {
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