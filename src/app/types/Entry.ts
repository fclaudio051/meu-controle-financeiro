export type EntryType = 'receita' | 'despesa_fixa' | 'despesa_variavel';

export interface FinanceEntry {
    id: string;
    type: EntryType;
    description: string;
    person: string; 
    date: string;
    value: number;
    category?: string; 
    createdAt?: Date;
    updatedAt?: Date; 
}