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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Meu Controle Financeiro
          </h1>
          <p className="text-lg text-gray-600 font-medium">Gerencie suas finanças com estilo e simplicidade</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => {
              setEditingEntry(null);
              setShowForm(!showForm);
            }}
            className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold ${
              showForm 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
            } text-white`}
          >
            {showForm ? (
              <>
                <FaTimes className="text-lg" />
                <span>Fechar Formulário</span>
              </>
            ) : (
              <>
                <FaPlus className="text-lg" />
                <span>Adicionar Lançamento</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowPersonManager(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-semibold"
          >
            <FaUserFriends className="text-lg" />
            Gerenciar Pessoas
          </button>

          <button
            onClick={() => setShowResumo(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-semibold"
          >
            <FaChartPie className="text-lg" />
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
            <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-6">Filtros</h2>
              <div className="flex items-center space-x-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">Mês</label>
                  <select
                    value={month}
                    onChange={e => setMonth(parseInt(e.target.value))}
                    className="p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium"
                  >
                    {monthNames.map((name, index) => (
                      <option key={index} value={index}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600">Ano</label>
                  <input
                    type="number"
                    value={year}
                    onChange={e => setYear(parseInt(e.target.value))}
                    className="p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium"
                  />
                </div>
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
        <div className="p-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 text-center">Resumo por Pessoa</h2>
          <div className="overflow-hidden rounded-2xl shadow-2xl border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wider">Pessoa</th>
                  <th className="py-4 px-6 font-bold text-emerald-700 text-sm uppercase tracking-wider">Receitas</th>
                  <th className="py-4 px-6 font-bold text-red-600 text-sm uppercase tracking-wider">Despesas</th>
                  <th className="py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wider">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(resumoPorPessoa).map(([personId, { receita, despesa }]) => {
                  const saldo = receita - despesa;
                  const label = peopleMap[personId] || 'Desconhecido';
                  return (
                    <tr key={personId} className="hover:bg-gray-50/70 transition-colors duration-200">
                      <td className="py-4 px-6 font-semibold text-gray-800">{label}</td>
                      <td className="py-4 px-6 font-bold text-emerald-600">R$ {receita.toFixed(2)}</td>
                      <td className="py-4 px-6 font-bold text-red-500">R$ {despesa.toFixed(2)}</td>
                      <td
                        className={`py-4 px-6 font-bold ${
                          saldo >= 0 ? 'text-emerald-600' : 'text-red-500'
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
        </div>
      </Modal>
    </div>
  );
}

export default App;
