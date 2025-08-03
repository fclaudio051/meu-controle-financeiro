'use client';

import { useEffect, useState } from 'react';
import { FinanceEntry, EntryType } from '../types/Entry';
import { Person } from '../types/person';

type Props = {
  onAdd: (entry: FinanceEntry) => void;
  visible: boolean;
  onClose: () => void;
  onOpenPersonManager: () => void;
  people: Person[];
  initialEntry?: FinanceEntry | null;
};

export function EntryForm({ onAdd, visible, onClose, onOpenPersonManager, people, initialEntry }: Props) {
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

  const getTypeColor = (type: EntryType) => {
    switch (type) {
      case 'receita': return 'from-emerald-500 to-green-500';
      case 'despesa_fixa': return 'from-red-500 to-pink-500';
      case 'despesa_variavel': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: EntryType) => {
    switch (type) {
      case 'receita': return '💰';
      case 'despesa_fixa': return '🔒';
      case 'despesa_variavel': return '📊';
      default: return '💼';
    }
  };

  return (
    <div className="modal-responsive">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl card-responsive shadow-2xl border border-white/30 w-full relative overflow-hidden"
      >
        {/* Header com gradiente dinâmico baseado no tipo */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${getTypeColor(entry.type)}`}></div>
        
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(entry.type)} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
              {getTypeIcon(entry.type)}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              {initialEntry ? 'Editar Lançamento' : 'Novo Lançamento'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tipo */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
                TIPO DE LANÇAMENTO
              </label>
              <div className="relative">
                <select
                  value={entry.type}
                  onChange={e => setEntry({ ...entry, type: e.target.value as EntryType })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 text-gray-800 backdrop-blur font-medium shadow-sm text-base appearance-none cursor-pointer hover:border-gray-300"
                >
                  <option value="receita">💰 Receita</option>
                  <option value="despesa_fixa">🔒 Despesa Fixa</option>
                  <option value="despesa_variavel">📊 Despesa Variável</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Pessoa */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full "></span>
                PESSOA
              </label>

              {people.length === 0 ? (
                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-sm text-gray-800">
                  <div className="text-center">
                    <div className="text-4xl mb-3">👤</div>
                    <p className="text-amber-800 font-semibold mb-4 text-gray-800">Nenhuma pessoa cadastrada</p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPersonManager();
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      ➕ Cadastrar Primeira Pessoa
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={entry.person}
                    onChange={e => setEntry({ ...entry, person: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-base appearance-none cursor-pointer hover:border-gray-300"
                  >
                    <option value="">👤 Selecione uma pessoa</option>
                    {people.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></span>
                DATA
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={entry.date}
                  onChange={e => setEntry({ ...entry, date: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-base hover:border-gray-300 text-gray-800"
                />
              </div>
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
                VALOR
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={entry.value === 0 ? '' : entry.value}
                  onChange={e => {
                    const value = e.target.value;
                    const numValue = value === '' ? 0 : parseFloat(value);
                    if (numValue >= 0) {
                      setEntry({ ...entry, value: numValue });
                    }
                  }}
                  className="w-full p-4 pl-12 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-base hover:border-gray-300 text-gray-800"
                  placeholder="0,00"
                />
              </div>
            </div>

            {/* Repetir por meses - só para despesa fixa */}
            {entry.type === 'despesa_fixa' && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></span>
                  🔄 REPETIR POR QUANTOS MESES?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={isNaN(repeatMonth) ? '' : repeatMonth}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRepeatMonth(value === '' ? 1 : parseInt(value));
                    }}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-base hover:border-gray-300 text-gray-800"
                    placeholder="Ex: 3 meses"
                  />
                </div>
              </div>
            )}

            {/* Descrição */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></span>
                DESCRIÇÃO
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={entry.description}
                  onChange={e => setEntry({ ...entry, description: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-base hover:border-gray-300 text-gray-800"
                  placeholder="📝 Descreva o lançamento..."
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {initialEntry ? (
              <>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✏️</span>
                  Atualizar Lançamento
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2"
                >
                  <span className="text-xl">❌</span>
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="submit"
                className={`w-full px-6 py-4 bg-gradient-to-r ${getTypeColor(entry.type)} hover:shadow-xl text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3 group`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {getTypeIcon(entry.type)}
                </span>
                <span>Adicionar Lançamento</span>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center ml-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}