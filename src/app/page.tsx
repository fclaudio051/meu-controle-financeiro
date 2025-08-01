'use client';

import { useEffect, useMemo, useState } from 'react';
import { FinanceEntry } from './types/Entry';
import { Person } from './types/person';

import { Summary } from './components/Summary';
import { EntryForm } from './components/EntryForm';
import { EntryTable } from './components/EntryTable';
import { PersonManagerWithAPI } from './components/PersonManagerWithAPI';
import { Modal } from './components/Modal';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { Login } from './components/Login';
import { Header } from './components/Header';

import { FaPlus, FaTimes, FaUserFriends, FaChartPie } from 'react-icons/fa';
import { apiService } from './services/api';

import './globals.css';

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function FinancialApp() {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showResumo, setShowResumo] = useState(false);
  const [showPersonManager, setShowPersonManager] = useState(false);

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // Função para carregar todos os dados do servidor ou do cache local
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Tentar carregar da API primeiro
      const [peopleResponse, entriesResponse] = await Promise.all([
        apiService.getPeople(),
        apiService.getEntries()
      ]);

      if (peopleResponse.success && peopleResponse.data) {
        setPeople(peopleResponse.data);
        localStorage.setItem('offline_people', JSON.stringify(peopleResponse.data));
      } else {
        console.log('API indisponível, carregando dados locais...');
        const localPeople = localStorage.getItem('offline_people');
        if (localPeople) {
          setPeople(JSON.parse(localPeople));
        }
      }

      if (entriesResponse.success && entriesResponse.data) {
        setEntries(entriesResponse.data);
        localStorage.setItem('offline_entries', JSON.stringify(entriesResponse.data));
      } else {
        const localEntries = localStorage.getItem('offline_entries');
        if (localEntries) {
          setEntries(JSON.parse(localEntries));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      
      const localPeople = localStorage.getItem('offline_people');
      const localEntries = localStorage.getItem('offline_entries');
      
      if (localPeople) setPeople(JSON.parse(localPeople));
      if (localEntries) setEntries(JSON.parse(localEntries));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Mapeia pessoas para facilitar a busca por nome
  const peopleMap = useMemo(() => {
    const map: Record<string, string> = {};
    people.forEach(p => (map[p.id] = p.name));
    return map;
  }, [people]);

  // Filtra as entradas pelo mês e ano selecionados
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === month && entryDate.getFullYear() === year;
    });
  }, [entries, month, year]);

  // Calcula o resumo financeiro por pessoa
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

  // Função utilitária para fechar o formulário e recarregar os dados
  const handleSuccess = () => {
    setShowForm(false);
    setEditingEntry(null);
    loadData(); // Garante que a tabela é atualizada com os dados mais recentes do servidor
  };

  // Lógica de adição/edição de entrada
  const handleAddEntry = async (entry: FinanceEntry) => {
    try {
      if (editingEntry) {
        // Lógica de atualização
        const response = await apiService.updateEntry(entry.id, {
          type: entry.type,
          person: entry.person,
          date: entry.date,
          value: entry.value,
          description: entry.description
        });

        if (response.success) {
          handleSuccess();
        } else {
          alert(response.error || 'Erro ao atualizar entrada');
        }
      } else {
        // Lógica de criação
        const response = await apiService.createEntry({
          type: entry.type,
          person: entry.person,
          date: entry.date,
          value: entry.value,
          description: entry.description
        });

        if (response.success) {
          handleSuccess();
        } else {
          alert(response.error || 'Erro ao criar entrada');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
      alert('Erro ao salvar entrada');
    }
  };

  const handleEditEntry = (entry: FinanceEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  // Lógica de exclusão de entrada
  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta entrada?')) {
      return;
    }

    try {
      const response = await apiService.deleteEntry(id);
      
      if (response.success) {
        loadData(); // Recarrega os dados para refletir a exclusão
      } else {
        alert(response.error || 'Erro ao deletar entrada');
      }
    } catch (error) {
      console.error('Erro ao deletar entrada:', error);
      alert('Erro ao deletar entrada');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  // Renderiza a tela de carregamento
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </>
    );
  }

  // Renderiza a aplicação principal
  return (
    <>
      <Header />
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
        <PersonManagerWithAPI people={people} setPeople={setPeople} />
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
    </>
  );
}

function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  return (
    <Login 
      onToggleMode={() => setIsRegisterMode(!isRegisterMode)}
      isRegisterMode={isRegisterMode}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGuard
        fallback={<LoginPage />}
      >
        <FinancialApp />
      </AuthGuard>
    </AuthProvider>
  );
}

export default App;
