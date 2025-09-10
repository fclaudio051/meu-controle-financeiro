import { Person } from '../../types';

export interface CreatePersonRequest {
  name: string;
  userId: string;
}

export interface IPersonService {
  getPersonsByUserId(userId: string): Promise<Person[]>;
  createPerson(data: CreatePersonRequest): Promise<Person>;
  deletePerson(id: string, userId: string): Promise<void>;
}
