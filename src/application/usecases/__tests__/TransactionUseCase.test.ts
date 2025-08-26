import { TransactionUseCase, CreateTransactionData } from '../TransactionUseCase';
import { Transaction } from '../../../domain/entities/Transaction';
import { User } from '../../../domain/entities/User';
import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

describe('TransactionUseCase', () => {
  let transactionUseCase: TransactionUseCase;
  let mockTransactionRepository: jest.Mocked<ITransactionRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockTransactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      updateBalance: jest.fn(),
    };

    transactionUseCase = new TransactionUseCase(mockTransactionRepository, mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    const mockUser = new User({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      balance: 1000,
      transactionPassword: '123456',
    });

    const createTransactionData: CreateTransactionData = {
      type: 'PIX',
      amount: 100,
      recipientName: 'Recipient User',
      recipientDocument: '12345678901',
      pixKey: 'recipient@example.com',
      transactionPassword: '123456',
    };

    const mockTransaction = new Transaction({
      id: 1,
      userId: 1,
      type: 'PIX',
      amount: 100,
      recipientName: 'Recipient User',
      recipientDocument: '12345678901',
      pixKey: 'recipient@example.com',
      date: new Date().toISOString(),
      balance: 900,
    });

    it('should successfully create a transaction with valid data', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);

      const result = await transactionUseCase.createTransaction(1, createTransactionData);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.updateBalance).toHaveBeenCalledWith(1, 900);
             expect(mockTransactionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
         userId: 1,
         type: 'PIX',
         amount: 100,
         recipientName: 'Recipient User',
         recipientDocument: '12345678901',
         pixKey: 'recipient@example.com',
         balance: 900,
       }));
      expect(result).toEqual(mockTransaction);
    });

    it('should throw error when user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(transactionUseCase.createTransaction(999, createTransactionData)).rejects.toThrow(
        'Usuário não encontrado'
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
      expect(mockUserRepository.updateBalance).not.toHaveBeenCalled();
      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when transaction password is incorrect', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const wrongPasswordData: CreateTransactionData = {
        ...createTransactionData,
        transactionPassword: 'wrongpassword',
      };

      await expect(transactionUseCase.createTransaction(1, wrongPasswordData)).rejects.toThrow(
        'Senha de transação incorreta'
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.updateBalance).not.toHaveBeenCalled();
      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when user has insufficient balance', async () => {
      const userWithLowBalance = new User({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        balance: 50,
        transactionPassword: '123456',
      });

      mockUserRepository.findById.mockResolvedValue(userWithLowBalance);

      await expect(transactionUseCase.createTransaction(1, createTransactionData)).rejects.toThrow(
        'Saldo insuficiente'
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.updateBalance).not.toHaveBeenCalled();
      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
    });

         it('should create transaction with bank transfer data', async () => {
       const bankTransferData: CreateTransactionData = {
         type: 'TED',
         amount: 200,
         recipientName: 'Bank Recipient',
         recipientDocument: '98765432100',
         bank: 'Test Bank',
         agency: '1234',
         account: '56789-0',
         transactionPassword: '123456',
       };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);

      await transactionUseCase.createTransaction(1, bankTransferData);

             expect(mockTransactionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
         type: 'TED',
         bank: 'Test Bank',
         agency: '1234',
         account: '56789-0',
       }));
    });
  });

  describe('getUserTransactions', () => {
    const mockUser = new User({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      balance: 1000,
      transactionPassword: '123456',
    });

         const mockTransactions = [
       new Transaction({
         id: 1,
         userId: 1,
         type: 'PIX',
         amount: 100,
         recipientName: 'Recipient 1',
         recipientDocument: '12345678901',
         date: new Date().toISOString(),
         balance: 900,
       }),
       new Transaction({
         id: 2,
         userId: 1,
         type: 'TED',
         amount: 200,
         recipientName: 'Recipient 2',
         recipientDocument: '98765432100',
         date: new Date().toISOString(),
         balance: 700,
       }),
     ];

    it('should successfully get user transactions without filters', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTransactionRepository.findByUserId.mockResolvedValue(mockTransactions);

      const result = await transactionUseCase.getUserTransactions(1);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockTransactionRepository.findByUserId).toHaveBeenCalledWith(1, undefined);
      expect(result).toEqual(mockTransactions);
    });

         it('should successfully get user transactions with filters', async () => {
       const filters = {
         type: 'PIX',
         startDate: '2024-01-01',
         endDate: '2024-12-31',
       };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTransactionRepository.findByUserId.mockResolvedValue([mockTransactions[0]]);

      const result = await transactionUseCase.getUserTransactions(1, filters);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockTransactionRepository.findByUserId).toHaveBeenCalledWith(1, filters);
      expect(result).toEqual([mockTransactions[0]]);
    });

    it('should throw error when user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(transactionUseCase.getUserTransactions(999)).rejects.toThrow(
        'Usuário não encontrado'
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
      expect(mockTransactionRepository.findByUserId).not.toHaveBeenCalled();
    });
  });

  describe('getTransactionById', () => {
         const mockTransaction = new Transaction({
       id: 1,
       userId: 1,
       type: 'PIX',
       amount: 100,
       recipientName: 'Recipient User',
       recipientDocument: '12345678901',
       date: new Date().toISOString(),
       balance: 900,
     });

    it('should successfully get transaction by id', async () => {
      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);

      const result = await transactionUseCase.getTransactionById(1);

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTransaction);
    });

    it('should return null when transaction is not found', async () => {
      mockTransactionRepository.findById.mockResolvedValue(null);

      const result = await transactionUseCase.getTransactionById(999);

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
});
