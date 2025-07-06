'use client';

import { useState } from 'react';
import { Person } from '../types/person';

type Props = {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
};

export function PersonManager({ people, setPeople }: Props) {
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const newPerson: Person = {
      id: crypto.randomUUID(),
      name: trimmedName,
    };

    setPeople(prev => [...prev, newPerson]);
    setName('');
  };

  const handleDelete = (id: string) => {
    setPeople(prev => prev.filter(person => person.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md pb-20">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Gerenciar Pessoas</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nome da pessoa"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Adicionar
        </button>
      </div>

      {people.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhuma pessoa cadastrada.</p>
      ) : (
        <ul className="space-y-2">
          {people.map(person => (
            <li
              key={person.id}
              className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md"
            >
              <span className="text-gray-800">{person.name}</span>
              <button
                onClick={() => handleDelete(person.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
