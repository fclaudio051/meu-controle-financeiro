'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState } from '../types/User';
import { apiService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('currentUser');
      
      if (token && storedUser) {
        try {
          const response = await apiService.verifyToken();
          
          // Corrigido: verificando a estrutura de resposta correta
          if (response.success && response.data?.user) {
            setAuthState({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('currentUser');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch {
          try {
            const user: User = JSON.parse(storedUser);
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('currentUser');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await apiService.login(email, password);
      
      // Corrigido: verificando a estrutura de resposta correta
      if (response.success && response.data?.user && response.data?.token) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } else {
        // Fallback para modo offline com credenciais de teste
        if (response.error?.includes('offline') || response.error?.includes('Timeout') || response.error?.includes('conexão')) {
          console.log('Modo offline - usando autenticação local');
          
          const testUsers = [
            { id: '1', name: 'Admin', email: 'admin@exemplo.com', password: 'admin123' },
            { id: '2', name: 'User', email: 'user@exemplo.com', password: 'user123' },
            { id: '3', name: 'Teste', email: 'teste@teste.com', password: '123456' },
          ];

          const user = testUsers.find(u => u.email === email && u.password === password);
          
          if (user) {
            const userWithoutPassword = { id: user.id, name: user.name, email: user.email };
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            localStorage.setItem('auth_token', 'offline_token_' + user.id);
            
            setAuthState({
              user: userWithoutPassword,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }
        }

        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await apiService.register(name, email, password);
      
      // Corrigido: verificando a estrutura de resposta correta
      if (response.success && response.data?.user && response.data?.token) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
}