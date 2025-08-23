import { Transaction, TransactionProps } from '../../domain/entities/Transaction';
import { ITransactionRepository, TransactionFilters } from '../../domain/repositories/ITransactionRepository';
import { ApiClient } from '../api/ApiClient';

export class TransactionRepository implements ITransactionRepository {
  constructor(private apiClient: ApiClient) {}

  async findByUserId(userId: number, filters?: TransactionFilters): Promise<Transaction[]> {
    try {
      let url = `/transactions?userId=${userId}`;

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

      const transactions = await this.apiClient.get<TransactionProps[]>(url);

      if (filters?.sortBy) {
        transactions.sort((a, b) => {
          const order = filters.sortOrder === 'desc' ? -1 : 1;
          if (filters.sortBy === 'date') {
            return order * (new Date(a.date).getTime() - new Date(b.date).getTime());
          }
          return order * (a.amount - b.amount);
        });
      }

      return transactions.map(transaction => new Transaction(transaction));
    } catch (error) {
      throw new Error('Erro ao buscar transações');
    }
  }

  async create(transaction: Transaction): Promise<Transaction> {
    try {
      const transactionData = await this.apiClient.post<TransactionProps>('/transactions', transaction.toJSON());
      return new Transaction(transactionData);
    } catch (error) {
      throw new Error('Erro ao criar transação');
    }
  }

  async findById(id: number): Promise<Transaction | null> {
    try {
      const transactionData = await this.apiClient.get<TransactionProps>(`/transactions/${id}`);
      return new Transaction(transactionData);
    } catch (error) {
      return null;
    }
  }
}
