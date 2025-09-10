import { FinanceEntry } from '../../types';

export interface IEntryRepository {
  findById(id: string): Promise<FinanceEntry | null>;
  findByUserId(userId: string): Promise<FinanceEntry[]>;
  findByPersonId(personId: string): Promise<FinanceEntry[]>;
  create(entry: Omit<FinanceEntry, 'id' | 'createdAt'>): Promise<FinanceEntry>;
  update(id: string, entry: Partial<FinanceEntry>): Promise<FinanceEntry | null>;
  delete(id: string): Promise<boolean>;
}