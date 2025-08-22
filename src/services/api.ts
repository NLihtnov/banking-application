import axios from 'axios';
import { LoginCredentials, RegisterData, TransactionForm, TransactionFilters, User, Transaction } from '../types';

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
    
    // Simular JWT token
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
    
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
    
    // Simular JWT token
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
    
    return { user, token };
  },

  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    try {
      const decoded = JSON.parse(atob(token));
      const response = await api.get(`/users/${decoded.userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Token inválido');
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

    const decoded = JSON.parse(atob(token));
    let url = `/transactions?userId=${decoded.userId}`;

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
  },

  createTransaction: async (transactionData: TransactionForm): Promise<Transaction> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const decoded = JSON.parse(atob(token));
    
    // Verificar senha de transação
    const userResponse = await api.get(`/users/${decoded.userId}`);
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
      userId: decoded.userId,
      ...transactionData,
      date: new Date().toISOString(),
      balance: user.balance - transactionData.amount,
    };

    // Atualizar saldo do usuário
    await api.patch(`/users/${decoded.userId}`, {
      balance: user.balance - transactionData.amount,
    });

    const response = await api.post('/transactions', newTransaction);
    return response.data;
  },
};

export default api;
