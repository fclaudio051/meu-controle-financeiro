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
      
      // Corrigido: tratamento da resposta da API
      if (response.success && response.data?.person) {
        setPeople(prev => [...prev, response.data!.person]);
        setName('');
        
        // Atualizar cache local
        const updatedPeople = [...people, response.data.person];
        localStorage.setItem('offline_people', JSON.stringify(updatedPeople));
      } else {
        alert(response.error || 'Erro ao criar pessoa');
      }
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
      
      // Fallback para modo offline
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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pessoa?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.deletePerson(id);
      
      // Corrigido: tratamento da resposta da API
      if (response.success) {
        const updatedPeople = people.filter(person => person.id !== id);
        setPeople(updatedPeople);
        localStorage.setItem('offline_people', JSON.stringify(updatedPeople));
      } else {
        alert(response.error || 'Erro ao deletar pessoa');
      }
    } catch (error) {
      console.error('Erro ao deletar pessoa:', error);
      
      // Fallback para modo offline
      const updatedPeople = people.filter(person => person.id !== id);
      setPeople(updatedPeople);
      localStorage.setItem('offline_people', JSON.stringify(updatedPeople));
      
      alert('Pessoa removida offline - será sincronizada quando o servidor estiver disponível');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 pb-20">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8 text-center">
        👥 Gerenciar Pessoas
      </h2>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="👤 Nome da pessoa"
          className="flex-1 border-2 border-gray-200 rounded-xl px-5 py-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm"
          onKeyPress={e => e.key === 'Enter' && !loading && handleAdd()}
          disabled={loading}
        />
        <button
          onClick={handleAdd}
          disabled={!name.trim() || loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg font-bold shadow-lg disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? '⏳ Criando...' : '➕ Adicionar'}
        </button>
      </div>

      {people.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-gray-500 text-lg font-medium">Nenhuma pessoa cadastrada ainda.</p>
          <p className="text-gray-400 text-sm mt-2">Adicione a primeira pessoa para começar!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-blue-500">📋</span>
            Pessoas Cadastradas ({people.length})
          </h3>
          <ul className="space-y-3">
            {people.map((person, index) => (
              <li
                key={person.id}
                className="flex justify-between items-center bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-800 font-semibold text-lg">{person.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(person.id)}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none"
                >
                  🗑️ Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}