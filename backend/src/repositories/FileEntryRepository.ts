import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../database';
import { FinanceEntry } from '../types';
import { IEntryRepository } from './interfaces/IEntryRepository';

export class FileEntryRepository implements IEntryRepository {
  async findById(id: string): Promise<FinanceEntry | null> {
    const db = readDB();
    return db.entries.find(entry => entry.id === id) || null;
  }

  async findByUserId(userId: string): Promise<FinanceEntry[]> {
    const db = readDB();
    return db.entries
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findByPersonId(personId: string): Promise<FinanceEntry[]> {
    const db = readDB();
    return db.entries.filter(entry => entry.person === personId);
  }

  async create(entryData: Omit<FinanceEntry, 'id' | 'createdAt'>): Promise<FinanceEntry> {
    const db = readDB();
    
    const newEntry: FinanceEntry = {
      id: uuidv4(),
      ...entryData,
      date: new Date(entryData.date).toISOString(),
      description: entryData.description.trim(),
      createdAt: new Date().toISOString()
    };

    db.entries.push(newEntry);
    writeDB(db);
    
    return newEntry;
  }

  async update(id: string, entryData: Partial<FinanceEntry>): Promise<FinanceEntry | null> {
    const db = readDB();
    const entryIndex = db.entries.findIndex(entry => entry.id === id);
    
    if (entryIndex === -1) return null;
    
    const updatedEntry = {
      ...db.entries[entryIndex],
      ...entryData,
      ...(entryData.date && { date: new Date(entryData.date).toISOString() }),
      ...(entryData.description && { description: entryData.description.trim() })
    };
    
    db.entries[entryIndex] = updatedEntry;
    writeDB(db);
    
    return updatedEntry;
  }

  async delete(id: string): Promise<boolean> {
    const db = readDB();
    const entryIndex = db.entries.findIndex(entry => entry.id === id);
    
    if (entryIndex === -1) return false;
    
    db.entries.splice(entryIndex, 1);
    writeDB(db);
    
    return true;
  }
}