'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState } from '../types/User';
import { apiService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  isOffline: boolean;
  lastError: string | null;
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

  const [isOffline, setIsOffline] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('currentUser');
      
      if (token && storedUser) {
        try {
          const response = await apiService.verifyToken();
          
          if (response.success && response.data?.user) {
            setAuthState({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            setIsOffline(false);
          } else {
            // Se falhou a verificação online, tentar modo offline
            if (response.isOffline) {
              try {
                const user: User = JSON.parse(storedUser);
                setAuthState({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                });
                setIsOffline(true);
              } catch {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('currentUser');
                setAuthState({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                });
                setIsOffline(false);
              }
            } else {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('currentUser');
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
              setIsOffline(false);
            }
          }
        } catch (error) {
          console.error('Erro na verificação do token:', error);
          // Fallback para modo offline
          try {
            const user: User = JSON.parse(storedUser);
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            setIsOffline(true);
          } catch {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('currentUser');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            setIsOffline(false);
          }
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        setIsOffline(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    setLastError(null);

    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data?.user && response.data?.token) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        setIsOffline(false);
        return true;
      } else {
        // Fallback para modo offline com credenciais de teste
        if (response.isOffline || response.error?.includes('offline') || response.error?.includes('Timeout') || response.error?.includes('conexão')) {
          console.log('Tentando login offline...');
          
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
            setIsOffline(true);
            return true;
          } else {
            setLastError('Credenciais inválidas para modo offline');
          }
        } else {
          setLastError(response.error || 'Erro no login');
        }

        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        setIsOffline(response.isOffline || false);
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setLastError('Erro de conexão');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      setIsOffline(true);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    setLastError(null);

    try {
      const response = await apiService.register(name, email, password);
      
      if (response.success && response.data?.user && response.data?.token) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        setIsOffline(false);
        return true;
      } else {
        setLastError(response.error || 'Erro no registro');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setIsOffline(response.isOffline || false);
        return false;
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      setLastError('Erro de conexão');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      setIsOffline(true);
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
    setIsOffline(false);
    setLastError(null);
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      register,
      isOffline,
      lastError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}