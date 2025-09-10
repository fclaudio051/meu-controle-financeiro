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
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-40 w-full">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16 sm:h-20">
        {/* Logo e título */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg sm:text-xl">💰</span>
          </div>

          {/* Título Desktop */}
          <h1 className="hidden sm:block text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Controle Financeiro
          </h1>

          {/* Título Mobile */}
          <h1 className="sm:hidden text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Finanças
          </h1>
        </div>

        {/* Área do usuário */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Info do usuário */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-white/20 max-w-[140px] sm:max-w-[240px]">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="text-white text-sm sm:text-base" />
            </div>

            {/* Nome e email (Desktop) */}
            <div className="hidden sm:block truncate">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>

            {/* Apenas nome no mobile */}
            <div className="sm:hidden truncate">
              <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
            </div>
          </div>

          {/* Botão de logout */}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-1 sm:gap-2 font-semibold text-sm"
            title="Sair"
          >
            <FaSignOutAlt className="text-xs sm:text-sm" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
