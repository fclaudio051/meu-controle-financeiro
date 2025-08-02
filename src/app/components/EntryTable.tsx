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
    <div className="table-responsive bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-bold text-gray-700 text-xs sm:text-sm uppercase tracking-wider">
              Data
            </th>
            <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-bold text-gray-700 text-xs sm:text-sm uppercase tracking-wider">
              Descrição
            </th>
            <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-bold text-gray-700 text-xs sm:text-sm uppercase tracking-wider hide-mobile">
              Tipo
            </th>
            <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-bold text-gray-700 text-xs sm:text-sm uppercase tracking-wider">
              Valor
            </th>
            <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-bold text-gray-700 text-xs sm:text-sm uppercase tracking-wider hide-mobile">
              Pessoa
            </th>
            <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-bold text-gray-700 text-xs sm:text-sm uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="hover:bg-white/80 transition-all duration-200 hover:shadow-lg"
            >
              <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap font-medium text-gray-800 text-xs sm:text-sm">
                <div className="flex flex-col">
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  {/* Mostrar tipo em mobile */}
                  <span className="sm:hidden text-xs text-gray-500 mt-1">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                        entry.type === 'receita'
                          ? 'bg-emerald-100 text-emerald-700'
                          : entry.type === 'despesa_fixa'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {entry.type.replace('_', ' ')}
                    </span>
                  </span>
                </div>
              </td>
              
              <td className="py-3 sm:py-4 px-3 sm:px-6 font-medium text-gray-800 text-xs sm:text-sm">
                <div className="flex flex-col">
                  <span className="truncate max-w-32 sm:max-w-none">{entry.description}</span>
                  {/* Mostrar pessoa em mobile */}
                  <span className="sm:hidden text-xs text-gray-500 mt-1">
                    {peopleMap[entry.person] || 'Desconhecido'}
                  </span>
                </div>
              </td>
              
              {/* Tipo - oculto em mobile */}
              <td className="hide-mobile py-3 sm:py-4 px-3 sm:px-6">
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
                className={`py-3 sm:py-4 px-3 sm:px-6 font-bold text-sm sm:text-lg whitespace-nowrap ${
                  entry.type === 'receita' ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                R$ {entry.value.toFixed(2)}
              </td>
              
              {/* Pessoa - oculto em mobile */}
              <td className="hide-mobile py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap font-semibold text-gray-700 text-sm">
                {peopleMap[entry.person] || 'Desconhecido'}
              </td>
              
              <td className="py-3 sm:py-4 px-3 sm:px-6">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => onEdit(entry)}
                    className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg text-xs sm:text-sm font-semibold min-h-8 sm:min-h-auto"
                    title="Editar"
                  >
                    <FaEdit className="text-xs sm:text-sm" />
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg text-xs sm:text-sm font-semibold min-h-8 sm:min-h-auto"
                    title="Excluir"
                  >
                    <FaTrash className="text-xs sm:text-sm" />
                    <span className="hidden sm:inline">Excluir</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Caso não haja entradas */}
      {entries.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-4xl sm:text-6xl mb-4">📊</div>
          <p className="text-gray-500 text-base sm:text-lg font-medium">Nenhum lançamento encontrado.</p>
          <p className="text-gray-400 text-sm mt-2">Adicione seu primeiro lançamento!</p>
        </div>
      )}
    </div>
  );
}