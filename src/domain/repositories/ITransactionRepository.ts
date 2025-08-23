import { Transaction } from '../entities/Transaction';

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

export interface ITransactionRepository {
  findByUserId(userId: number, filters?: TransactionFilters): Promise<Transaction[]>;
  create(transaction: Transaction): Promise<Transaction>;
  findById(id: number): Promise<Transaction | null>;
}
