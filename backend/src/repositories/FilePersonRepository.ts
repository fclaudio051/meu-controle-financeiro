import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../database';
import { Person } from '../types';
import { IPersonRepository } from './interfaces/IPersonRepository';

export class FilePersonRepository implements IPersonRepository {
  async findById(id: string): Promise<Person | null> {
    const db = readDB();
    return db.people.find(person => person.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Person[]> {
    const db = readDB();
    return db.people
      .filter(person => person.userId === userId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async findByName(name: string, userId: string): Promise<Person | null> {
    const db = readDB();
    return db.people.find(
      person => person.userId === userId && 
                person.name.toLowerCase() === name.trim().toLowerCase()
    ) || null;
  }

  async create(personData: Omit<Person, 'id' | 'createdAt'>): Promise<Person> {
    const db = readDB();
    
    const newPerson: Person = {
      id: uuidv4(),
      ...personData,
      name: personData.name.trim(),
      createdAt: new Date().toISOString()
    };

    db.people.push(newPerson);
    writeDB(db);
    
    return newPerson;
  }

  async delete(id: string): Promise<boolean> {
    const db = readDB();
    const personIndex = db.people.findIndex(person => person.id === id);
    
    if (personIndex === -1) return false;
    
    db.people.splice(personIndex, 1);
    writeDB(db);
    
    return true;
  }
}