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
    if (Number(entry.value) <= 0) return alert('O valor deve ser maior que zero!');
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
    <div className="modal-responsive">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-md card-responsive shadow-2xl border border-white/20 w-full"
      >
        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 sm:mb-8 text-center">
          {initialEntry ? 'Editar Lançamento' : 'Adicionar Lançamento'}
        </h3>

        <div className="form-responsive">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Tipo:</label>
            <select
              value={entry.type}
              onChange={e => setEntry({ ...entry, type: e.target.value as EntryType })}
              className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-sm sm:text-base"
            >
              <option value="receita">💰 Receita</option>
              <option value="despesa_fixa">🔒 Despesa Fixa</option>
              <option value="despesa_variavel">📊 Despesa Variável</option>
            </select>
          </div>

          {/* Pessoa */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Pessoa:</label>
            <select
              value={entry.person}
              onChange={e => setEntry({ ...entry, person: e.target.value })}
              className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-sm sm:text-base"
            >
              <option value="">👤 Selecione uma pessoa</option>
              {people.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Data:</label>
            <input
              type="date"
              value={entry.date}
              onChange={e => setEntry({ ...entry, date: e.target.value })}
              className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-sm sm:text-base"
            />
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Valor:</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={isNaN(entry.value) ? '' : entry.value}
              onChange={e => {
                const value = e.target.value;
                const numValue = value === '' ? 0 : parseFloat(value);
                if (numValue >= 0) {
                  setEntry({ ...entry, value: numValue });
                }
              }}
              className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-sm sm:text-base"
              placeholder="💰 0,00"
            />
          </div>

          {/* Repetir por meses - só para despesa fixa */}
          {entry.type === 'despesa_fixa' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                🔄 Repetir por quantos meses?
              </label>
              <input
                type="number"
                min={1}
                value={isNaN(repeatMonth) ? '' : repeatMonth}
                onChange={(e) => {
                  const value = e.target.value;
                  setRepeatMonth(value === '' ? 1 : parseInt(value));
                }}
                className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-sm sm:text-base"
                placeholder="Ex: 3 meses"
              />
            </div>
          )}

          {/* Descrição - largura total */}
          <div className="full-width">
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Descrição:</label>
            <input
              type="text"
              value={entry.description}
              onChange={e => setEntry({ ...entry, description: e.target.value })}
              className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-sm sm:text-base"
              placeholder="📝 Descrição do lançamento"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          {initialEntry ? (
            <>
              <button
                type="submit"
                className="btn-responsive flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                ✏️ Atualizar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-responsive flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                ❌ Cancelar
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="btn-responsive w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              ➕ Adicionar Lançamento
            </button>
          )}
        </div>
      </form>
    </div>
  );
}