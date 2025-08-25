import { TransactionRepository } from '../TransactionRepository';
import { ApiClient } from '../../api/ApiClient';
import { Transaction } from '../../../domain/entities/Transaction';
import { TransactionFilters } from '../../../domain/repositories/ITransactionRepository';

// Mock do ApiClient
jest.mock('../../api/ApiClient');

describe('TransactionRepository', () => {
  let transactionRepository: TransactionRepository;
  let mockApiClient: jest.Mocked<ApiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiClient = new ApiClient() as jest.Mocked<ApiClient>;
    transactionRepository = new TransactionRepository(mockApiClient);
  });

  describe('findByUserId', () => {
    test('should fetch transactions without filters', async () => {
      const mockTransactions = [
        {
          id: 1,
          type: 'PIX',
          amount: 100.00,
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          date: '2024-01-15T10:30:00Z',
          balance: 4900.00,
          pixKey: 'maria@email.com',
        },
        {
          id: 2,
          type: 'TED',
          amount: 250.00,
          recipientName: 'Pedro Costa',
          recipientDocument: '987.654.321-00',
          date: '2024-01-14T14:20:00Z',
          balance: 5150.00,
          bank: 'Banco do Brasil',
          agency: '1234',
          account: '12345-6',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockTransactions);

      const result = await transactionRepository.findByUserId(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/transactions?userId=1');
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Transaction);
      expect(result[1]).toBeInstanceOf(Transaction);
    });

    test('should fetch transactions with type filter', async () => {
      const mockTransactions = [
        {
          id: 1,
          type: 'PIX',
          amount: 100.00,
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          date: '2024-01-15T10:30:00Z',
          balance: 4900.00,
          pixKey: 'maria@email.com',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockTransactions);

      const filters: TransactionFilters = { type: 'PIX' };
      const result = await transactionRepository.findByUserId(1, filters);

      expect(mockApiClient.get).toHaveBeenCalledWith('/transactions?userId=1&type=PIX');
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Transaction);
    });

    test('should fetch transactions with period filter', async () => {
      const mockTransactions = [
        {
          id: 1,
          type: 'PIX',
          amount: 100.00,
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          date: '2024-01-15T10:30:00Z',
          balance: 4900.00,
          pixKey: 'maria@email.com',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockTransactions);

      const filters: TransactionFilters = { period: 7 };
      const result = await transactionRepository.findByUserId(1, filters);

      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - 7);
      const expectedDateString = expectedDate.toISOString();

      expect(mockApiClient.get).toHaveBeenCalledWith(`/transactions?userId=1&date_gte=${expectedDateString}`);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Transaction);
    });

    test('should fetch transactions with date range filters', async () => {
      const mockTransactions = [
        {
          id: 1,
          type: 'PIX',
          amount: 100.00,
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          date: '2024-01-15T10:30:00Z',
          balance: 4900.00,
          pixKey: 'maria@email.com',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockTransactions);

      const filters: TransactionFilters = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const result = await transactionRepository.findByUserId(1, filters);

      expect(mockApiClient.get).toHaveBeenCalledWith('/transactions?userId=1&date_gte=2024-01-01&date_lte=2024-01-31');
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Transaction);
    });

    test('should fetch transactions with amount filters', async () => {
      const mockTransactions = [
        {
          id: 1,
          type: 'PIX',
          amount: 100.00,
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          date: '2024-01-15T10:30:00Z',
          balance: 4900.00,
          pixKey: 'maria@email.com',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockTransactions);

      const filters: TransactionFilters = {
        minAmount: 50,
        maxAmount: 200,
      };
      const result = await transactionRepository.findByUserId(1, filters);

      expect(mockApiClient.get).toHaveBeenCalledWith('/transactions?userId=1&amount_gte=50&amount_lte=200');
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Transaction);
    });

    test.skip('should fetch transactions with all filters', async () => {
      const mockTransactions = [
        {
          id: 1,
          type: 'PIX' as const,
          amount: 100.00,
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          date: '2024-01-15T10:30:00Z',
          balance: 4900.00,
          pixKey: 'maria@email.com',
          userId: 1,
        },
      ];

      mockApiClient.get.mockResolvedValue({ data: mockTransactions });

      const filters: TransactionFilters = {
        type: 'PIX',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        minAmount: 50,
        maxAmount: 200,
      };

      const result = await transactionRepository.findByUserId(1, filters);

      // Verifica se a chamada foi feita com os parâmetros corretos
      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringMatching(/\/transactions\?userId=1&type=PIX&date_gte=.*&date_gte=2024-01-01&date_lte=2024-01-31&amount_gte=50&amount_lte=200/)
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({
        id: 1,
        type: 'PIX',
        amount: 100.00,
        recipientName: 'Maria Santos',
      }));
    });

    test('should sort transactions by date ascending', async () => {
      const mockTransactions = [
        {
          id: 2,
          type: 'TED',
          amount: 250.00,
          recipientName: 'Pedro Costa',
          recipientDocument: '987.654.321-00',
          date: '2024-01-14T14:20:00Z',
          balance: 5150.00,
          bank: 'Banco do Brasil',
          agency: '1234',
          account: '12345-6',
        },
        {
          id: 1,
          type: 'PIX',
          amount: 100.00,
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          date: '2024-01-15T10:30:00Z',
          balance: 4900.00,
          pixKey: 'maria@email.com',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockTransactions);

      const filters: TransactionFilters = {
        sortBy: 'date',
        sortOrder: 'asc',
      };
      const result = await transactionRepository.findByUserId(1, filters);

      expect(result[0].id).toBe(2); // Pedro Costa (data mais antiga)
      expect(result[1].id).toBe(1); // Maria Santos (data mais recente)
    });

    test('should sort transactions by date descending', async () => {
      const mockTransactions = [
        {
          id: 2,
          type: 'TED',
          amount: 250.00,
          recipientName: 'Pedro Costa',
          recipientDocument: '987.654.321-00',
          date: '2024-01-14T14:20:00Z',
          balance: 5150.00,
          bank: 'Banco do Brasil',
          agency: '1234',
          account: '12345-6',
        },
        {
          id: 1,
          type: 'PIX',
          amount: 100.00,
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          date: '2024-01-15T10:30:00Z',
          balance: 4900.00,
          pixKey: 'maria@email.com',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockTransactions);

      const filters: TransactionFilters = {
        sortBy: 'date',
        sortOrder: 'desc',
      };
      const result = await transactionRepository.findByUserId(1, filters);

      expect(result[0].id).toBe(1); // Maria Santos (data mais recente)
      expect(result[1].id).toBe(2); // Pedro Costa (data mais antiga)
    });

    test('should sort transactions by amount ascending', async () => {
      const mockTransactions = [
        {
          id: 1,
          type: 'PIX',
          amount: 100.00,
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          date: '2024-01-15T10:30:00Z',
          balance: 4900.00,
          pixKey: 'maria@email.com',
        },
        {
          id: 2,
          type: 'TED',
          amount: 250.00,
          recipientName: 'Pedro Costa',
          recipientDocument: '987.654.321-00',
          date: '2024-01-14T14:20:00Z',
          balance: 5150.00,
          bank: 'Banco do Brasil',
          agency: '1234',
          account: '12345-6',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockTransactions);

      const filters: TransactionFilters = {
        sortBy: 'amount',
        sortOrder: 'asc',
      };
      const result = await transactionRepository.findByUserId(1, filters);

      expect(result[0].amount).toBe(100.00);
      expect(result[1].amount).toBe(250.00);
    });

    test('should sort transactions by amount descending', async () => {
      const mockTransactions = [
        {
          id: 1,
          type: 'PIX',
          amount: 100.00,
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          date: '2024-01-15T10:30:00Z',
          balance: 4900.00,
          pixKey: 'maria@email.com',
        },
        {
          id: 2,
          type: 'TED',
          amount: 250.00,
          recipientName: 'Pedro Costa',
          recipientDocument: '987.654.321-00',
          date: '2024-01-14T14:20:00Z',
          balance: 5150.00,
          bank: 'Banco do Brasil',
          agency: '1234',
          account: '12345-6',
        },
      ];

      mockApiClient.get.mockResolvedValue(mockTransactions);

      const filters: TransactionFilters = {
        sortBy: 'amount',
        sortOrder: 'desc',
      };
      const result = await transactionRepository.findByUserId(1, filters);

      expect(result[0].amount).toBe(250.00);
      expect(result[1].amount).toBe(100.00);
    });

    test('should handle API error', async () => {
      mockApiClient.get.mockRejectedValue(new Error('API Error'));

      await expect(transactionRepository.findByUserId(1)).rejects.toThrow('Erro ao buscar transações');
    });
  });

  describe('create', () => {
    test('should create a new transaction', async () => {
      const transactionData = {
        id: 1,
        type: 'PIX',
        amount: 100.00,
        recipientName: 'Maria Santos',
        recipientDocument: '123.456.789-00',
        date: '2024-01-15T10:30:00Z',
        balance: 4900.00,
        pixKey: 'maria@email.com',
      };

      const transaction = new Transaction(transactionData);
      mockApiClient.post.mockResolvedValue(transactionData);

      const result = await transactionRepository.create(transaction);

      expect(mockApiClient.post).toHaveBeenCalledWith('/transactions', transactionData);
      expect(result).toBeInstanceOf(Transaction);
      expect(result.id).toBe(1);
      expect(result.type).toBe('PIX');
    });

    test('should handle API error when creating transaction', async () => {
      const transactionData = {
        id: 1,
        type: 'PIX',
        amount: 100.00,
        recipientName: 'Maria Santos',
        recipientDocument: '123.456.789-00',
        date: '2024-01-15T10:30:00Z',
        balance: 4900.00,
        pixKey: 'maria@email.com',
      };

      const transaction = new Transaction(transactionData);
      mockApiClient.post.mockRejectedValue(new Error('API Error'));

      await expect(transactionRepository.create(transaction)).rejects.toThrow('Erro ao criar transação');
    });
  });

  describe('findById', () => {
    test('should find transaction by id', async () => {
      const transactionData = {
        id: 1,
        type: 'PIX',
        amount: 100.00,
        recipientName: 'Maria Santos',
        recipientDocument: '123.456.789-00',
        date: '2024-01-15T10:30:00Z',
        balance: 4900.00,
        pixKey: 'maria@email.com',
      };

      mockApiClient.get.mockResolvedValue(transactionData);

      const result = await transactionRepository.findById(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/transactions/1');
      expect(result).toBeInstanceOf(Transaction);
      expect(result?.id).toBe(1);
    });

    test('should return null when transaction not found', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Not Found'));

      const result = await transactionRepository.findById(999);

      expect(mockApiClient.get).toHaveBeenCalledWith('/transactions/999');
      expect(result).toBeNull();
    });

    test('should handle API error when finding transaction by id', async () => {
      mockApiClient.get.mockRejectedValue(new Error('API Error'));

      const result = await transactionRepository.findById(1);

      expect(result).toBeNull();
    });
  });
});
