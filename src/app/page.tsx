"use client";

import { useEffect, useMemo, useState } from 'react';
import { FinanceEntry } from './types/Entry';
import { Person } from './types/person';

import { Summary } from './components/Summary';
import { EntryForm } from './components/EntryForm';
import { EntryTable } from './components/EntryTable';
import { PersonManager } from './components/personManager';
import { Modal } from './components/Modal';

import { FaPlus, FaTimes, FaUserFriends, FaChartPie } from 'react-icons/fa';

import './globals.css';

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function App() {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showResumo, setShowResumo] = useState(false);
  const [showPersonManager, setShowPersonManager] = useState(false);

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const storedEntries = localStorage.getItem('financeEntries');
    const storedPeople = localStorage.getItem('people');

    if (storedEntries) setEntries(JSON.parse(storedEntries));
    if (storedPeople) setPeople(JSON.parse(storedPeople));
  }, []);

  useEffect(() => {
    localStorage.setItem('financeEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
  }, [people]);

  const peopleMap = useMemo(() => {
    const map: Record<string, string> = {};
    people.forEach(p => (map[p.id] = p.name));
    return map;
  }, [people]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === month && entryDate.getFullYear() === year;
    });
  }, [entries, month, year]);

  const resumoPorPessoa = useMemo(() => {
    const base: Record<string, { receita: number; despesa: number }> = {};
    filteredEntries.forEach(entry => {
      if (!entry.person) return;
      if (!base[entry.person]) base[entry.person] = { receita: 0, despesa: 0 };
      if (entry.type === 'receita') {
        base[entry.person].receita += entry.value;
      } else {
        base[entry.person].despesa += entry.value;
      }
    });
    return base;
  }, [filteredEntries]);

  const handleAddEntry = (entry: FinanceEntry) => {
    if (editingEntry) {
      setEntries(prev => prev.map(e => (e.id === entry.id ? entry : e)));
    } else {
      setEntries(prev => [...prev, entry]);
    }
    setEditingEntry(null);
    setShowForm(false);
  };

  const handleEditEntry = (entry: FinanceEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Controle Financeiro</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => {
              setEditingEntry(null);
              setShowForm(!showForm);
            }}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              showForm ? 'bg-red-600 hover:bg-red-800' : 'bg-green-600 hover:bg-green-800'
            } text-white`}
          >
            {showForm ? (
              <>
                <FaTimes />
                <span>Fechar Formulário</span>
              </>
            ) : (
              <>
                <FaPlus />
                <span>Adicionar Lançamento</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowPersonManager(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-800 text-white flex items-center gap-2"
          >
            <FaUserFriends />
            Gerenciar Pessoas
          </button>

          <button
            onClick={() => setShowResumo(true)}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-800 text-white flex items-center gap-2"
          >
            <FaChartPie />
            Resumo por Pessoa
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Modal isOpen={showForm} onClose={handleCloseForm}>
            <EntryForm
              onAdd={handleAddEntry}
              visible={true}
              onClose={handleCloseForm}
              people={people}
              initialEntry={editingEntry}
            />
          </Modal>

          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Filtros</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={month}
                  onChange={e => setMonth(parseInt(e.target.value))}
                  className="p-2 border border-gray-300 rounded"
                >
                  {monthNames.map((name, index) => (
                    <option key={index} value={index}>
                      {name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={year}
                  onChange={e => setYear(parseInt(e.target.value))}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <Summary entries={filteredEntries} />

            <EntryTable
              entries={filteredEntries}
              onDelete={handleDeleteEntry}
              people={people}
              onEdit={handleEditEntry}
            />
          </div>
        </div>
      </div>

      <Modal isOpen={showPersonManager} onClose={() => setShowPersonManager(false)}>
        <PersonManager people={people} setPeople={setPeople} />
      </Modal>

      <Modal isOpen={showResumo} onClose={() => setShowResumo(false)}>
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo por Pessoa</h2>
          <table className="w-full text-left border-collapse mt-2">
            <thead>
              <tr>
                <th className="py-2 px-3 border-b font-medium">Pessoa</th>
                <th className="py-2 px-3 border-b font-medium text-green-700">Receitas</th>
                <th className="py-2 px-3 border-b font-medium text-red-700">Despesas</th>
                <th className="py-2 px-3 border-b font-medium">Saldo</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {Object.entries(resumoPorPessoa).map(([personId, { receita, despesa }]) => {
                const saldo = receita - despesa;
                const label = peopleMap[personId] || 'Desconhecido';
                return (
                  <tr key={personId}>
                    <td className="py-2 px-3 border-b">{label}</td>
                    <td className="py-2 px-3 border-b text-green-600">R$ {receita.toFixed(2)}</td>
                    <td className="py-2 px-3 border-b text-red-600">R$ {despesa.toFixed(2)}</td>
                    <td
                      className={`py-2 px-3 border-b ${
                        saldo >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      R$ {saldo.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

export default App;
