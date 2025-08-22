import axios from 'axios';
import * as jose from 'jose';
import { LoginCredentials, RegisterData, TransactionForm, TransactionFilters, User, Transaction } from '../types';

// Secret key para assinar JWT (em produção, isso viria do backend)
const JWT_SECRET = new TextEncoder().encode('magnum-bank-secret-key-2024-super-secure');

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviços de autenticação
export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await api.get(`/users?email=${credentials.email}`);
    const users = response.data;
    
    if (users.length === 0) {
      throw new Error('Usuário não encontrado');
    }
    
    const user = users[0];
    if (user.password !== credentials.password) {
      throw new Error('Senha incorreta');
    }
    
    // Criar JWT token real
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000), // Issued at
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expira em 24 horas
    };
    
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    
    return { user, token };
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    // Verificar se email já existe
    const existingUser = await api.get(`/users?email=${data.email}`);
    if (existingUser.data.length > 0) {
      throw new Error('Email já cadastrado');
    }

    const newUser = {
      ...data,
      id: Date.now(),
      balance: 1000.00, // Saldo inicial
    };

    const response = await api.post('/users', newUser);
    const user = response.data;
    
    // Criar JWT token real
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000), // Issued at
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expira em 24 horas
    };
    
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    
    return { user, token };
  },

  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    try {
      // Verificar e decodificar JWT token
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      
      // Verificar se o token expirou
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem('token');
        throw new Error('Token expirado');
      }
      
      const response = await api.get(`/users/${payload.userId}`);
      return response.data;
    } catch (error) {
      if (error instanceof jose.errors.JWTExpired) {
        localStorage.removeItem('token');
        throw new Error('Token expirado');
      }
      if (error instanceof jose.errors.JWTInvalid) {
        localStorage.removeItem('token');
        throw new Error('Token inválido');
      }
      throw error;
    }
  },
};

// Serviços de transações
export const transactionService = {
  getTransactions: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      let url = `/transactions?userId=${payload.userId}`;

      if (filters) {
        if (filters.type) {
          url += `&type=${filters.type}`;
        }
        if (filters.period) {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - filters.period);
          url += `&date_gte=${startDate.toISOString()}`;
        }
        if (filters.startDate) {
          url += `&date_gte=${filters.startDate}`;
        }
        if (filters.endDate) {
          url += `&date_lte=${filters.endDate}`;
        }
        if (filters.minAmount) {
          url += `&amount_gte=${filters.minAmount}`;
        }
        if (filters.maxAmount) {
          url += `&amount_lte=${filters.maxAmount}`;
        }
      }

      const response = await api.get(url);
      let transactions = response.data;

      // Ordenação
      if (filters?.sortBy) {
        transactions.sort((a: Transaction, b: Transaction) => {
          const order = filters.sortOrder === 'desc' ? -1 : 1;
          if (filters.sortBy === 'date') {
            return order * (new Date(a.date).getTime() - new Date(b.date).getTime());
          }
          return order * (a.amount - b.amount);
        });
      }

      return transactions;
    } catch (error) {
      if (error instanceof jose.errors.JWTExpired) {
        localStorage.removeItem('token');
        throw new Error('Token expirado');
      }
      if (error instanceof jose.errors.JWTInvalid) {
        localStorage.removeItem('token');
        throw new Error('Token inválido');
      }
      throw error;
    }
  },

  createTransaction: async (transactionData: TransactionForm): Promise<Transaction> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      
      // Verificar senha de transação
      const userResponse = await api.get(`/users/${payload.userId}`);
      const user = userResponse.data;
      
      if (user.transactionPassword !== transactionData.transactionPassword) {
        throw new Error('Senha de transação incorreta');
      }

      if (user.balance < transactionData.amount) {
        throw new Error('Saldo insuficiente');
      }

      // Criar transação
      const newTransaction = {
        id: Date.now(),
        userId: payload.userId,
        ...transactionData,
        date: new Date().toISOString(),
        balance: user.balance - transactionData.amount,
      };

      // Atualizar saldo do usuário
      await api.patch(`/users/${payload.userId}`, {
        balance: user.balance - transactionData.amount,
      });

      const response = await api.post('/transactions', newTransaction);
      return response.data;
    } catch (error) {
      if (error instanceof jose.errors.JWTExpired) {
        localStorage.removeItem('token');
        throw new Error('Token expirado');
      }
      if (error instanceof jose.errors.JWTInvalid) {
        localStorage.removeItem('token');
        throw new Error('Token inválido');
      }
      throw error;
    }
  },
};

export default api;
