import { User } from '../types/User';
import { Person } from '../types/person';
import { FinanceEntry } from '../types/Entry';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  isOffline?: boolean;
}

class ApiService {
  private isServerOnline = true;

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = this.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      console.log(`🌐 API Request: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        console.error(`❌ API Error ${response.status}:`, errorData);
        
        return {
          success: false,
          error: errorData.error || `Erro ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      console.log(`✅ API Success: ${endpoint}`, data);

      this.isServerOnline = true;
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('❌ API Request failed:', error);
      this.isServerOnline = false;
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Timeout - servidor não responde',
            isOffline: true,
          };
        }
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          return {
            success: false,
            error: 'Servidor offline - usando dados locais',
            isOffline: true,
          };
        }
      }

      return {
        success: false,
        error: 'Erro de conexão com o servidor',
        isOffline: true,
      };
    }
  }

  // Método para verificar se está no modo offline
  isOfflineMode(): boolean {
    return !this.isServerOnline;
  }

  // Método para forçar verificação de conectividade
  async forceHealthCheck(): Promise<boolean> {
    try {
      const response = await this.healthCheck();
      this.isServerOnline = response.success;
      return response.success;
    } catch {
      this.isServerOnline = false;
      return false;
    }
  }

  // Autenticação
  async login(email: string, password: string) {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }

    return response;
  }

  async verifyToken() {
    return this.request<{ user: User }>('/auth/me');
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('offline_people');
    localStorage.removeItem('offline_entries');
  }

  // Pessoas com fallback offline
  async getPeople(): Promise<ApiResponse<Person[]>> {
    const response = await this.request<Person[]>('/people');
    
    if (!response.success && response.isOffline) {
      // Fallback para dados locais
      const localPeople = localStorage.getItem('offline_people');
      if (localPeople) {
        try {
          const people = JSON.parse(localPeople);
          return {
            success: true,
            data: people,
            isOffline: true,
          };
        } catch {
          return { success: true, data: [], isOffline: true };
        }
      }
      return { success: true, data: [], isOffline: true };
    }

    return response;
  }

  async createPerson(name: string) {
    const response = await this.request<{ person: Person; message: string }>('/people', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });

    if (!response.success && response.isOffline) {
      // Fallback offline
      const newPerson: Person = {
        id: crypto.randomUUID(),
        name,
        userId: 'offline_user',
        createdAt: new Date().toISOString(),
      };

      const localPeople = localStorage.getItem('offline_people');
      const people = localPeople ? JSON.parse(localPeople) : [];
      people.push(newPerson);
      localStorage.setItem('offline_people', JSON.stringify(people));

      return {
        success: true,
        data: { person: newPerson, message: 'Pessoa criada offline' },
        isOffline: true,
      };
    }

    return response;
  }

  async deletePerson(id: string) {
    const response = await this.request<{ message: string }>(`/people/${id}`, {
      method: 'DELETE',
    });

    if (!response.success && response.isOffline) {
      // Fallback offline
      const localPeople = localStorage.getItem('offline_people');
      if (localPeople) {
        const people = JSON.parse(localPeople);
        const filteredPeople = people.filter((p: Person) => p.id !== id);
        localStorage.setItem('offline_people', JSON.stringify(filteredPeople));
      }

      return {
        success: true,
        data: { message: 'Pessoa removida offline' },
        isOffline: true,
      };
    }

    return response;
  }

  // Entradas financeiras com fallback offline
  async getEntries(): Promise<ApiResponse<FinanceEntry[]>> {
    const response = await this.request<FinanceEntry[]>('/entries');
    
    if (!response.success && response.isOffline) {
      // Fallback para dados locais
      const localEntries = localStorage.getItem('offline_entries');
      if (localEntries) {
        try {
          const entries = JSON.parse(localEntries);
          return {
            success: true,
            data: entries,
            isOffline: true,
          };
        } catch {
          return { success: true, data: [], isOffline: true };
        }
      }
      return { success: true, data: [], isOffline: true };
    }

    return response;
  }

  async createEntry(entry: Omit<FinanceEntry, 'id' | 'createdAt'>) {
  const response = await this.request<{ entry: FinanceEntry; message: string }>('/entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  });

  if (!response.success && response.isOffline) {
    // Fallback offline
    const newEntry: FinanceEntry = {
      id: crypto.randomUUID(),
      ...entry,
      createdAt: new Date(),
    };

    const localEntries = localStorage.getItem('offline_entries');
    const entries = localEntries ? JSON.parse(localEntries) : [];
    entries.push(newEntry);
    localStorage.setItem('offline_entries', JSON.stringify(entries));

    return {
      success: true,
      data: { entry: newEntry, message: 'Entrada criada offline' },
      isOffline: true,
    };
  }

  return response;
}


  async updateEntry(id: string, entry: Omit<FinanceEntry, 'id' | 'createdAt'>) {
  const response = await this.request<{ entry: FinanceEntry; message: string }>(`/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  });

  if (!response.success && response.isOffline) {
    // Fallback offline
    const localEntries = localStorage.getItem('offline_entries');
    if (localEntries) {
      const entries = JSON.parse(localEntries);
      const entryIndex = entries.findIndex((e: FinanceEntry) => e.id === id);
      if (entryIndex !== -1) {
        entries[entryIndex] = { ...entries[entryIndex], ...entry };
        localStorage.setItem('offline_entries', JSON.stringify(entries));
      }
    }

    return {
      success: true,
      data: { entry: { id, ...entry } as FinanceEntry, message: 'Entrada atualizada offline' },
      isOffline: true,
    };
  }

  return response;
}
  async deleteEntry(id: string) {
    const response = await this.request<{ message: string }>(`/entries/${id}`, {
      method: 'DELETE',
    });

    if (!response.success && response.isOffline) {
      // Fallback offline
      const localEntries = localStorage.getItem('offline_entries');
      if (localEntries) {
        const entries = JSON.parse(localEntries);
        const filteredEntries = entries.filter((e: FinanceEntry) => e.id !== id);
        localStorage.setItem('offline_entries', JSON.stringify(filteredEntries));
      }

      return {
        success: true,
        data: { message: 'Entrada removida offline' },
        isOffline: true,
      };
    }

    return response;
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string; timestamp: string }>('/api/health');
  }
}

export const apiService = new ApiService();