'use client';

import { useEffect, useState } from 'react';
import { FinanceEntry, EntryType } from '../types/Entry';
import { Person } from '../types/person';

type Props = {
  onAdd: (entry: FinanceEntry) => void;
  visible: boolean;
  onClose: () => void;
  people: Person[];
  initialEntry?: FinanceEntry | null;
};

export function EntryForm({ onAdd, visible, onClose, people, initialEntry }: Props) {
  const [entry, setEntry] = useState<Omit<FinanceEntry, 'id'>>({
    type: 'receita',
    person: '',
    date: new Date().toISOString().split('T')[0],
    value: 0,
    description: ''
  });

  const [repeatMonth, setRepeatMonth] = useState<number>(1);

  useEffect(() => {
    if (initialEntry) {
      setEntry({
        type: initialEntry.type,
        person: initialEntry.person,
        date: initialEntry.date,
        value: initialEntry.value,
        description: initialEntry.description
      });
      setRepeatMonth(1);
    } else {
      setEntry({
        type: 'receita',
        person: '',
        date: new Date().toISOString().split('T')[0],
        value: 0,
        description: ''
      });
      setRepeatMonth(1);
    }
  }, [initialEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!entry.value || isNaN(Number(entry.value))) return alert('Informe um valor válido!');
    if (!entry.person) return alert('Selecione uma pessoa.');
    if (!entry.description.trim()) return alert('A descrição é obrigatória.');

    const baseDate = new Date(entry.date);

    const createEntryWithDate = (monthsToAdd: number): FinanceEntry => {
      const newDate = new Date(baseDate);
      newDate.setMonth(baseDate.getMonth() + monthsToAdd);
      return {
        ...entry,
        id: crypto.randomUUID(),
        value: parseFloat(entry.value.toString()),
        date: newDate.toISOString().split('T')[0]
      };
    };

    if (entry.type === 'despesa_fixa' && repeatMonth > 1) {
      const repeatedEntries = Array.from({ length: repeatMonth }).map((_, i) =>
        createEntryWithDate(i + 1)
      );
      repeatedEntries.forEach(onAdd);
    } else {
      const newEntry: FinanceEntry = {
        ...entry,
        id: initialEntry?.id || crypto.randomUUID(),
        value: parseFloat(entry.value.toString())
      };
      onAdd(newEntry);
    }

    onClose();
  };

  if (!visible) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {initialEntry ? 'Editar Lançamento' : 'Adicionar Lançamento'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
          <select
            value={entry.type}
            onChange={e => setEntry({ ...entry, type: e.target.value as EntryType })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="receita">Receita</option>
            <option value="despesa_fixa">Despesa Fixa</option>
            <option value="despesa_variavel">Despesa Variável</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pessoa:</label>
          <select
            value={entry.person}
            onChange={e => setEntry({ ...entry, person: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Selecione uma pessoa</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data:</label>
          <input
            type="date"
            value={entry.date}
            onChange={e => setEntry({ ...entry, date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor:</label>
          <input
            type="number"
            step="0.01"
            value={isNaN(entry.value) ? '' : entry.value}
            onChange={e => {
              const value = e.target.value;
              setEntry({ ...entry, value: value === '' ? 0 : parseFloat(value) });
            }}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="0,00"
          />
        </div>

        {entry.type === 'despesa_fixa' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repetir por quantos meses?
            </label>
            <input
              type="number"
              min={1}
              value={isNaN(repeatMonth) ? '' : repeatMonth}
              onChange={(e) => {
                const value = e.target.value;
                setRepeatMonth(value === '' ? 1 : parseInt(value));
              }}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Ex: 3"
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
          <input
            type="text"
            value={entry.description}
            onChange={e => setEntry({ ...entry, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Descrição do lançamento"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        {initialEntry ? (
          <>
            <button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
            >
              Atualizar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          >
            Adicionar
          </button>
        )}
      </div>
    </form>
  );
}
