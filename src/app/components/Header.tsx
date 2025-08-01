'use client';

import { useAuth } from '../contexts/AuthContext';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">💰</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Controle Financeiro
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2 font-semibold"
            title="Sair"
          >
            <FaSignOutAlt />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
