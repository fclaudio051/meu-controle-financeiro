import { FinanceEntry, EntryType } from '../../types';

export interface CreateEntryRequest {
  type: EntryType;
  person: string;
  date: string;
  value: number;
  description: string;
  userId: string;
}

export interface UpdateEntryRequest {
  type: EntryType;
  person: string;
  date: string;
  value: number;
  description: string;
}

export interface EntryWithPersonRef extends FinanceEntry {
  personRef: { id: string; name: string } | null;
}

export interface IEntryService {
  getEntriesByUserId(userId: string): Promise<EntryWithPersonRef[]>;
  createEntry(data: CreateEntryRequest): Promise<EntryWithPersonRef>;
  updateEntry(id: string, data: UpdateEntryRequest, userId: string): Promise<FinanceEntry>;
  deleteEntry(id: string, userId: string): Promise<void>;
}
