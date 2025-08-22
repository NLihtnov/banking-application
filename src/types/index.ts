export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  balance: number;
  transactionPassword: string;
}

export interface Transaction {
  id: number;
  userId: number;
  type: 'TED' | 'PIX';
  amount: number;
  recipientName: string;
  recipientDocument: string;
  bank?: string;
  agency?: string;
  account?: string;
  pixKey?: string;
  date: string;
  balance: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  transactionPassword: string;
}

export interface TransactionForm {
  type: 'TED' | 'PIX';
  recipientName: string;
  recipientDocument: string;
  bank?: string;
  agency?: string;
  account?: string;
  pixKey?: string;
  amount: number;
  transactionPassword: string;
}

export interface TransactionFilters {
  type?: 'TED' | 'PIX';
  period?: 7 | 15 | 30 | 90;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;
}
