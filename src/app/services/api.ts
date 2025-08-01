import { User } from '../types/User';
import { Person } from '../types/person';
import { FinanceEntry } from '../types/Entry';

const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
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
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Erro na requisição',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Erro na API:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Timeout - servidor não responde',
          };
        }
        if (error.message.includes('fetch')) {
          return {
            success: false,
            error: 'Servidor offline - usando dados locais',
          };
        }
      }

      return {
        success: false,
        error: 'Erro de conexão com o servidor',
      };
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
  }

  // Pessoas
  async getPeople() {
    return this.request<Person[]>('/people');
  }

  async createPerson(name: string) {
    return this.request<{ person: Person }>('/people', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async deletePerson(id: string) {
    return this.request<{ message: string }>(`/people/${id}`, {
      method: 'DELETE',
    });
  }

  // Entradas financeiras
  async getEntries() {
    return this.request<FinanceEntry[]>('/entries');
  }

  async createEntry(entry: {
    type: string;
    person: string;
    date: string;
    value: number;
    description: string;
  }) {
    return this.request<{ entry: FinanceEntry }>('/entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async updateEntry(id: string, entry: {
    type: string;
    person: string;
    date: string;
    value: number;
    description: string;
  }) {
    return this.request<{ entry: FinanceEntry }>(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  }

  async deleteEntry(id: string) {
    return this.request<{ message: string }>(`/entries/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string }>('/health');
  }
}

export const apiService = new ApiService();
