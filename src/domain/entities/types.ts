import { TransactionType } from './Transaction';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  balance: number;
}

export interface TransactionDTO {
  id: number;
  userId: number;
  type: string;
  amount: number;
  recipientName: string;
  date: string;
  description?: string;
  recipientDocument?: string;
  bank?: string;
  agency?: string;
  account?: string;
  pixKey?: string;
  balance?: number;
}

export interface CreateTransactionData {
  type: TransactionType;
  amount: number;
  recipientName: string;
  recipientDocument: string;
  bank?: string;
  agency?: string;
  account?: string;
  pixKey?: string;
  transactionPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
