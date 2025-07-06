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
    <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-md">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Data</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Descrição</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Tipo</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Valor</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Pessoa</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr
              key={entry.id}
              className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
            >
              <td className="py-3 px-4 whitespace-nowrap">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">{entry.description}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    entry.type === 'receita'
                      ? 'bg-green-100 text-green-700'
                      : entry.type === 'despesa_fixa'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {entry.type.replace('_', ' ')}
                </span>
              </td>
              <td
                className={`py-3 px-4 font-semibold whitespace-nowrap ${
                  entry.type === 'receita' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                R$ {entry.value.toFixed(2)}
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                {peopleMap[entry.person] || 'Desconhecido'}
              </td>
              <td className="py-3 px-4 flex gap-2 whitespace-nowrap">
                <button
                  onClick={() => onEdit(entry)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition rounded px-2 py-1 text-sm font-medium"
                  title="Editar"
                >
                  <FaEdit />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 transition rounded px-2 py-1 text-sm font-medium"
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
