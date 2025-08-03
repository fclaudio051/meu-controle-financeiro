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

  const handleDelete = async (id: string) => {
  if (!confirm('Tem certeza que deseja excluir esta pessoa?')) {
    return;
  }

  setLoading(true);
  try {
    const response = await apiService.deletePerson(id);
    
    if (response.success) {
      const updatedPeople = people.filter(person => person.id !== id);
      setPeople(updatedPeople);
      localStorage.setItem('offline_people', JSON.stringify(updatedPeople));
    } else {
      if (response.error?.includes('lançamentos vinculados')) {
        alert('❌ Não é possível excluir essa pessoa porque ela possui lançamentos vinculados. Exclua os lançamentos primeiro.');
      } else {
        alert(response.error || 'Erro ao deletar pessoa');
      }
    }
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error);
    
    alert('Erro inesperado ao tentar excluir.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="modal-responsive">
      <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-md card-responsive shadow-2xl border border-white/20 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 sm:mb-8 text-center">
          👥 Gerenciar Pessoas
        </h2>

        {/* Formulário de adição */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="👤 Nome da pessoa"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/90 font-medium shadow-sm text-sm sm:text-base text-gray-800"
            onKeyPress={e => e.key === 'Enter' && !loading && handleAdd()}
            disabled={loading}
          />
          <button
            onClick={handleAdd}
            disabled={!name.trim() || loading}
            className="sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold shadow-lg rounded-xl disabled:cursor-not-allowed disabled:transform-none text-center"
          >
            {loading ? '⏳ Criando...' : '➕ Adicionar'}
          </button>
        </div>

        {/* Lista de pessoas */}
        {people.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-4">👤</div>
            <p className="text-gray-500 text-base sm:text-lg font-medium">Nenhuma pessoa cadastrada ainda.</p>
            <p className="text-gray-400 text-sm mt-2">Adicione a primeira pessoa para começar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-blue-500">📋</span>
              Pessoas Cadastradas ({people.length})
            </h3>
            
            <div className="person-list-responsive">
              {people.map((person, index) => (
                <div
                  key={person.id}
                  className="person-item bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 flex justify-between items-center px-4 py-3 rounded-xl"
                >
                  <div className="person-info flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {index + 1}
                    </div>
                    <span className="text-gray-800 font-semibold text-base sm:text-lg">{person.name}</span>
                  </div>
                  
                  <div className="person-actions">
                    <button
                      onClick={() => handleDelete(person.id)}
                      disabled={loading}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none"
                    >
                      🗑️ Excluir
                    </button>
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
