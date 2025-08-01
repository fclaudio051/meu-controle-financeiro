export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Person {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export type EntryType = 'receita' | 'despesa_fixa' | 'despesa_variavel';

export interface FinanceEntry {
  id: string;
  type: EntryType;
  person: string;
  date: string;
  value: number;
  description: string;
  userId: string;
  createdAt: string;
}

export interface Database {
  users: User[];
  people: Person[];
  entries: FinanceEntry[];
}
