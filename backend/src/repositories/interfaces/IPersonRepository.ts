import { Person } from '../../types';

export interface IPersonRepository {
  findById(id: string): Promise<Person | null>;
  findByUserId(userId: string): Promise<Person[]>;
  findByName(name: string, userId: string): Promise<Person | null>;
  create(person: Omit<Person, 'id' | 'createdAt'>): Promise<Person>;
  delete(id: string): Promise<boolean>;
}