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
      <div className="responsive-container header-responsive">
        {/* Logo e título */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-base sm:text-lg">💰</span>
          </div>
          <div className="hidden-mobile">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Controle Financeiro
            </h1>
          </div>
          {/* Versão mobile do título */}
          <div className="sm:hidden">
            <h1 className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Finanças
            </h1>
          </div>
        </div>

        {/* Área do usuário */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Info do usuário */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/60 backdrop-blur-sm px-2 sm:px-4 py-2 rounded-xl border border-white/20">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-xs sm:text-sm" />
            </div>
            <div className="hidden sm:block user-info">
              <p className="text-sm font-semibold text-gray-800 truncate max-w-32">{user?.name}</p>
              <p className="text-xs text-gray-600 truncate max-w-32">{user?.email}</p>
            </div>
            {/* Versão mobile - só o nome */}
            <div className="sm:hidden">
              <p className="text-xs font-semibold text-gray-800 truncate max-w-20">{user?.name}</p>
            </div>
          </div>

          {/* Botão de logout */}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-2 sm:px-4 py-2 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-1 sm:gap-2 font-semibold text-sm"
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