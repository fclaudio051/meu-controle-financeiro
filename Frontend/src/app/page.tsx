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

import { FaPlus, FaTimes, FaUserFriends, FaChartPie, FaSync, FaExclamationTriangle } from 'react-icons/fa';
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
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  const checkOfflineMode = () => {
    const offline = apiService.isOfflineMode();
    setIsOfflineMode(offline);
    return offline;
  };

  const loadData = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) setLoading(true);

      const [peopleResponse, entriesResponse] = await Promise.all([
        apiService.getPeople(),
        apiService.getEntries()
      ]);

      const offline = !!(peopleResponse.isOffline || entriesResponse.isOffline);
      setIsOfflineMode(offline);

      if (peopleResponse.success && peopleResponse.data) {
        const peopleData = Array.isArray(peopleResponse.data)
          ? peopleResponse.data
          : peopleResponse.data;

        setPeople(peopleData);

        if (!peopleResponse.isOffline) {
          localStorage.setItem('offline_people', JSON.stringify(peopleData));
        }
      }

      if (entriesResponse.success && entriesResponse.data) {
        const entriesData = Array.isArray(entriesResponse.data)
          ? entriesResponse.data
          : entriesResponse.data;

        setEntries(entriesData);

        if (!entriesResponse.isOffline) {
          localStorage.setItem('offline_entries', JSON.stringify(entriesData));
        }
      }
    } catch {
      console.error('Erro ao carregar dados:',);
      setIsOfflineMode(true);

      const localPeople = localStorage.getItem('offline_people');
      const localEntries = localStorage.getItem('offline_entries');

      if (localPeople) setPeople(JSON.parse(localPeople));
      if (localEntries) setEntries(JSON.parse(localEntries));
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  const attemptSync = async () => {
    setSyncStatus('syncing');

    try {
      const isServerOnline = await apiService.forceHealthCheck();

      if (isServerOnline) {
        await loadData(false);
        setSyncStatus('idle');
        setIsOfflineMode(false);

        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = '✅ Dados sincronizados com sucesso!';
        document.body.appendChild(notification);

        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 2000);
      }
    } catch  {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const handleSuccess = () => {
    setShowForm(false);
    setEditingEntry(null);
    loadData(false);
  };

  const handleAddEntry = async (entry: FinanceEntry) => {
    try {
      if (editingEntry) {
        const response = await apiService.updateEntry(entry.id, {
          type: entry.type,
          person: entry.person,
          date: entry.date,
          value: entry.value,
          description: entry.description
        });

        if (response.success) {
          if (response.isOffline) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-20 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            notification.textContent = '💾 Entrada atualizada offline';
            document.body.appendChild(notification);
            setTimeout(() => document.body.removeChild(notification), 3000);
          }
          handleSuccess();
        } else {
          alert(response.error || 'Erro ao atualizar entrada');
        }
      } else {
        const response = await apiService.createEntry({
          type: entry.type,
          person: entry.person,
          date: entry.date,
          value: entry.value,
          description: entry.description
        });

        if (response.success) {
          if (response.isOffline) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-20 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            notification.textContent = '💾 Entrada criada offline';
            document.body.appendChild(notification);
            setTimeout(() => document.body.removeChild(notification), 3000);
          }
          handleSuccess();
        } else {
          alert(response.error || 'Erro ao criar entrada');
        }
      }

      checkOfflineMode();
    } catch {
      console.error('Erro ao salvar entrada:');
      alert('Erro ao salvar entrada');
    }
  };

  const handleEditEntry = (entry: FinanceEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta entrada?')) {
      return;
    }

    try {
      const response = await apiService.deleteEntry(id);

      if (response.success) {
        if (response.isOffline) {
          const notification = document.createElement('div');
          notification.className = 'fixed top-20 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
          notification.textContent = '💾 Entrada removida offline';
          document.body.appendChild(notification);
          setTimeout(() => document.body.removeChild(notification), 3000);
        }
        loadData(false);
      } else {
        alert(response.error || 'Erro ao deletar entrada');
      }

      checkOfflineMode();
    } catch {
      console.error('Erro ao deletar entrada:');
      alert('Erro ao deletar entrada');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

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
            
            {isOfflineMode && (
              <div className="mt-4 inline-flex items-center gap-3 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg border border-amber-200">
                <FaExclamationTriangle className="w-4 h-4" />
                <span className="font-medium">Modo Offline - Dados serão sincronizados quando possível</span>
                <button
                  onClick={attemptSync}
                  disabled={syncStatus === 'syncing'}
                  className="ml-2 p-1 hover:bg-amber-200 rounded transition-colors disabled:opacity-50"
                  title="Tentar sincronizar"
                >
                  <FaSync className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
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

            {isOfflineMode && (
              <button
                onClick={attemptSync}
                disabled={syncStatus === 'syncing'}
                className={`px-6 py-3 rounded-xl text-white flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-semibold ${
                  syncStatus === 'error' 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                <FaSync className={`text-lg ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>
                  {syncStatus === 'syncing' ? 'Sincronizando...' : 
                  syncStatus === 'error' ? 'Erro na Sinc.' : 'Sincronizar'}
                </span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Modal isOpen={showForm} onClose={handleCloseForm}>
              <EntryForm
                onAdd={handleAddEntry}
                visible={true}
                onClose={handleCloseForm}
                people={people}
                initialEntry={editingEntry}
                onOpenPersonManager={() => setShowPersonManager(true)}
              />
            </Modal>

            <div className="lg:col-span-3">
              <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 mb-8 text-gray-800">
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
                      className="w-full sm:w-40 p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium"
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
                        <td className={`py-4 px-6 font-bold ${saldo >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
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
    <>
      <Login
        onToggleMode={() => setIsRegisterMode(!isRegisterMode)}
        isRegisterMode={isRegisterMode}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGuard fallback={<LoginPage />}>
        <FinancialApp />
      </AuthGuard>
    </AuthProvider>
  );
}

export default App;
