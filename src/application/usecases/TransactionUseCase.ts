import { Transaction, TransactionType } from '../../domain/entities/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { TransactionFilters } from '../../domain/repositories/ITransactionRepository';

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

export class TransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private userRepository: IUserRepository
  ) {}

  async createTransaction(userId: number, data: CreateTransactionData): Promise<Transaction> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (!user.validateTransactionPassword(data.transactionPassword)) {
      throw new Error('Senha de transação incorreta');
    }

    if (!user.canMakeTransaction(data.amount)) {
      throw new Error('Saldo insuficiente');
    }

    const transaction = new Transaction({
      id: Date.now(),
      userId,
      type: data.type,
      amount: data.amount,
      recipientName: data.recipientName,
      recipientDocument: data.recipientDocument,
      bank: data.bank,
      agency: data.agency,
      account: data.account,
      pixKey: data.pixKey,
      date: new Date().toISOString(),
      balance: user.balance - data.amount,
    });

    transaction.validate();

    const newBalance = user.balance - data.amount;
    await this.userRepository.updateBalance(userId, newBalance);

    return await this.transactionRepository.create(transaction);
  }

  async getUserTransactions(userId: number, filters?: TransactionFilters): Promise<Transaction[]> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return await this.transactionRepository.findByUserId(userId, filters);
  }

  async getTransactionById(transactionId: number): Promise<Transaction | null> {
    return await this.transactionRepository.findById(transactionId);
  }
}
