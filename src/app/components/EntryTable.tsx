'use client';

import { FinanceEntry } from '../types/Entry';
import { Person } from '../types/person';
import { FaTrash, FaEdit } from 'react-icons/fa';

type Props = {
  entries: FinanceEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: FinanceEntry) => void;
  people: Person[];
};

export function EntryTable({ entries, onDelete, onEdit, people }: Props) {
  const peopleMap = people.reduce((acc, person) => {
    acc[person.id] = person.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="overflow-hidden mt-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="py-4 px-6 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">Data</th>
            <th className="py-4 px-6 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">Descrição</th>
            <th className="py-4 px-6 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">Tipo</th>
            <th className="py-4 px-6 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">Valor</th>
            <th className="py-4 px-6 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">Pessoa</th>
            <th className="py-4 px-6 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((entry, idx) => (
            <tr
              key={entry.id}
              className="hover:bg-white/80 transition-all duration-200 hover:shadow-lg"
            >
              <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-800">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="py-4 px-6 font-medium text-gray-800">{entry.description}</td>
              <td className="py-4 px-6">
                <span
                  className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide shadow-sm ${
                    entry.type === 'receita'
                      ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-300'
                      : entry.type === 'despesa_fixa'
                      ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300'
                      : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border border-amber-300'
                  }`}
                >
                  {entry.type.replace('_', ' ')}
                </span>
              </td>
              <td
                className={`py-4 px-6 font-bold text-lg whitespace-nowrap ${
                  entry.type === 'receita' ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                R$ {entry.value.toFixed(2)}
              </td>
              <td className="py-4 px-6 whitespace-nowrap font-semibold text-gray-700">
                {peopleMap[entry.person] || 'Desconhecido'}
              </td>
              <td className="py-4 px-6 flex gap-3 whitespace-nowrap">
                <button
                  onClick={() => onEdit(entry)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-3 py-2 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg text-sm font-semibold"
                  title="Editar"
                >
                  <FaEdit />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg text-sm font-semibold"
                  title="Excluir"
                >
                  <FaTrash />
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
