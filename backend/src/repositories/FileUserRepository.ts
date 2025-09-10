import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../database';
import { User } from '../types';
import { IUserRepository } from './interfaces/IUserRepository';

export class FileUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const db = readDB();
    return db.users.find(user => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = readDB();
    return db.users.find(user => user.email === email) || null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const db = readDB();
    
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);
    
    return newUser;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const db = readDB();
    const userIndex = db.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return null;
    
    db.users[userIndex] = { ...db.users[userIndex], ...userData };
    writeDB(db);
    
    return db.users[userIndex];
  }

  async delete(id: string): Promise<boolean> {
    const db = readDB();
    const userIndex = db.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return false;
    
    db.users.splice(userIndex, 1);
    writeDB(db);
    
    return true;
  }
}