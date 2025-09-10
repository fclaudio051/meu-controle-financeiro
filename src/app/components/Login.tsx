'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner, FaArrowRight, FaWifi, FaTimes } from 'react-icons/fa';

interface LoginProps {
  onToggleMode: () => void;
  isRegisterMode: boolean;
}

export function Login({ onToggleMode, isRegisterMode }: LoginProps) {
  const { login, register, isLoading, isOffline, lastError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    if (isRegisterMode) {
      if (!formData.name.trim()) {
        return;
      }
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        setSuccess('Conta criada com sucesso!');
      }
    } else {
      const success = await login(formData.email, formData.password);
      if (success) {
        setSuccess(isOffline ? 'Login offline realizado!' : 'Login realizado com sucesso!');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md">
        {/* Status de Conectividade */}
        <div className="text-center mb-4">
          <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
            isOffline 
              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {isOffline ? (
              <>
                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Modo Offline</span>
                <span className="sm:hidden">Offline</span>
              </>
            ) : (
              <>
                <FaWifi className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Online</span>
              </>
            )}
          </div>
        </div>

        {/* Logo/Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <span className="text-2xl sm:text-3xl text-white">💰</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Controle Financeiro
          </h1>
          <p className="text-gray-600 font-medium text-sm sm:text-base">
            {isRegisterMode ? 'Crie sua conta para começar' : 'Faça login para continuar'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {isRegisterMode ? '✨ Criar Conta' : '🔐 Entrar'}
          </h2>

          {/* Nome (apenas no registro) */}
          {isRegisterMode && (
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                👤 Nome Completo
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-sm sm:text-base"
                  placeholder="Seu nome completo"
                  required={isRegisterMode}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
              📧 Email
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-sm sm:text-base"
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Senha */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
              🔒 Senha
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white/90 backdrop-blur font-medium shadow-sm text-sm sm:text-base"
                placeholder="Sua senha"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
          </div>

          {/* Mensagens de erro/sucesso */}
          {lastError && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl text-center font-medium text-sm sm:text-base">
              ❌ {lastError}
            </div>
          )}

          {success && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl text-center font-medium text-sm sm:text-base">
              ✅ {success}
            </div>
          )}

          {/* Aviso sobre modo offline */}
          {isOffline && !isRegisterMode && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-2 sm:gap-3 text-amber-800">
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-semibold">Modo Offline Ativo</p>
                  <p>Use as credenciais de teste abaixo para entrar.</p>
                </div>
              </div>
            </div>
          )}

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 min-h-12 sm:min-h-14"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin text-sm sm:text-base" />
                <span className="text-sm sm:text-base">
                  {isRegisterMode ? 'Criando conta...' : 'Entrando...'}
                </span>
              </>
            ) : (
              <>
                <span className="text-sm sm:text-base">
                  {isRegisterMode ? '✨ Criar Conta' : '🚀 Entrar'}
                </span>
                <FaArrowRight className="text-sm sm:text-base" />
              </>
            )}
          </button>

          {/* Link para alternar modo */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              {isRegisterMode ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
            </p>
            <button
              type="button"
              onClick={onToggleMode}
              disabled={isLoading}
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors underline decoration-2 underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isRegisterMode ? '🔐 Fazer Login' : '✨ Criar Conta'}
            </button>
          </div>

          {/* Credenciais de teste */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <span>🧪</span>
              {isOffline ? 'Credenciais para Modo Offline:' : 'Credenciais para teste:'}
            </h4>
            <div className="text-xs sm:text-sm text-blue-700 space-y-1">
              <p><strong>Admin:</strong> admin@exemplo.com / admin123</p>
              <p><strong>User:</strong> user@exemplo.com / user123</p>
              <p><strong>Teste:</strong> teste@teste.com / 123456</p>
            </div>
            {isOffline && (
              <p className="text-xs text-blue-600 mt-2 italic">
                * No modo offline, apenas essas credenciais funcionam
              </p>
            )}
          </div>

          {/* Instruções adicionais para modo offline */}
          {isOffline && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs text-gray-600 text-center">
                💡 <strong>Dica:</strong> Seus dados serão salvos localmente e sincronizados quando a conexão for restaurada.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}