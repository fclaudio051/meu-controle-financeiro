'use client';

import { useState } from 'react';
import { Person } from '../types/person';
import { apiService } from '../services/api';

type Props = {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
};

export function PersonManagerWithAPI({ people, setPeople }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setLoading(true);
    try {
      const response = await apiService.createPerson(trimmedName);
      
      if (response.success && response.data?.person) {
        setPeople(prev => [...prev, response.data!.person]);
        setName('');
        
        const updatedPeople = [...people, response.data.person];
        localStorage.setItem('offline_people', JSON.stringify(updatedPeople));
      } else {
        alert(response.error || 'Erro ao criar pessoa');
      }
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
      
      const newPerson: Person = {
        id: crypto.randomUUID(),
        name: trimmedName,
        userId: 'offline_user',
        createdAt: new Date().toISOString()
      };
      
      const updatedPeople = [...people, newPerson];
      setPeople(updatedPeople);
      localStorage.setItem('offline_people', JSON.stringify(updatedPeople));
      setName('');
      
      alert('Pessoa adicionada offline - será sincronizada quando o servidor estiver disponível');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, personName: string) => {
    // Confirmação melhorada com nome da pessoa
    if (!confirm(`Tem certeza que deseja excluir "${personName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.deletePerson(id);
      
      if (response.success) {
        const updatedPeople = people.filter(person => person.id !== id);
        setPeople(updatedPeople);
        localStorage.setItem('offline_people', JSON.stringify(updatedPeople));
        console.log('Pessoa deletada com sucesso:', personName);
      } else {
        console.error('Erro na resposta da API:', response.error);
        alert(response.error || 'Erro ao deletar pessoa');
      }
    } catch (error) {
      console.error('Erro ao deletar pessoa:', error);
      
      // Fallback para modo offline - sempre funciona
      const updatedPeople = people.filter(person => person.id !== id);
      setPeople(updatedPeople);
      localStorage.setItem('offline_people', JSON.stringify(updatedPeople));
      
      alert('Pessoa removida offline - será sincronizada quando o servidor estiver disponível');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 w-full max-w-4xl mx-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
            👥
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
            Gerenciar Pessoas
          </h2>
        </div>

        {/* Formulário de adição - Responsivo */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200/50 mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="👤 Digite o nome da pessoa"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 sm:py-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-sm sm:text-base hover:border-gray-300"
                onKeyPress={e => e.key === 'Enter' && !loading && handleAdd()}
                disabled={loading}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!name.trim() || loading}
              className="w-full sm:w-auto sm:min-w-[140px] px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
            >
              {loading ? '⏳ Criando...' : '➕ Adicionar'}
            </button>
          </div>
        </div>

        {/* Lista de pessoas */}
        {people.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-4xl sm:text-6xl mb-4 opacity-60">👤</div>
            <p className="text-gray-600 text-base sm:text-lg font-semibold mb-2">Nenhuma pessoa cadastrada</p>
            <p className="text-gray-400 text-sm">Adicione a primeira pessoa para começar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
              <h3 className="text-base sm:text-lg font-bold text-slate-700">
                Pessoas Cadastradas ({people.length})
              </h3>
            </div>
            
            <div className="space-y-3">
              {people.map((person, index) => (
                <div
                  key={person.id}
                  className="group bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 rounded-xl overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-800 font-semibold text-base sm:text-lg block truncate">
                          {person.name}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          ID: {person.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full sm:w-auto">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Tentando deletar pessoa:', person.name, 'ID:', person.id);
                          handleDelete(person.id, person.name);
                        }}
                        disabled={loading}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none group-hover:scale-105"
                      >
                        <span className="flex items-center justify-center gap-2">
                          🗑️ <span>Excluir</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}