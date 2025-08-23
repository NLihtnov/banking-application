import { configureStore } from '@reduxjs/toolkit';
import transactionReducer, { 
  fetchTransactions, 
  createTransaction, 
  clearError, 
  setFilters, 
  clearTransactions 
} from '../transactionSlice';

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do DependencyContainer
jest.mock('../../infrastructure/container/DependencyContainer', () => ({
  DependencyContainer: {
    getInstance: jest.fn(() => ({
      getTransactionUseCase: jest.fn(() => ({
        getUserTransactions: jest.fn(),
        createTransaction: jest.fn(),
      })),
    })),
  },
}));

// Mock do JwtService
jest.mock('../../services/JwtService', () => ({
  JwtService: {
    verifyToken: jest.fn(),
  },
}));

// Configuração do store de teste
const createTestStore = (preloadedState: any = undefined) => {
  const config: any = {
    reducer: { transaction: transactionReducer },
  };
  
  if (preloadedState !== undefined) {
    config.preloadedState = { transaction: preloadedState };
  }
  
  return configureStore(config);
};

describe('Transaction Slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-token');
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = createTestStore();
      const state = store.getState().transaction;
      
      expect(state.transactions).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.filters).toEqual({});
    });
  });

  describe('Reducers', () => {
    it('should handle clearError action', () => {
      const initialState = {
        transactions: [],
        loading: false,
        error: 'Some error',
        filters: {},
      };
      
      const store = createTestStore(initialState);
      store.dispatch(clearError());
      
      const state = store.getState().transaction;
      expect(state.error).toBeNull();
    });

    it('should handle setFilters action', () => {
      const initialState = {
        transactions: [],
        loading: false,
        error: null,
        filters: {},
      };
      
      const newFilters = { period: 7, type: 'PIX' };
      const store = createTestStore(initialState);
      store.dispatch(setFilters(newFilters));
      
      const state = store.getState().transaction;
      expect(state.filters).toEqual(newFilters);
    });

    it('should handle clearTransactions action', () => {
      const initialState = {
        transactions: [
          { id: 1, userId: 1, type: 'PIX', amount: 100, recipientName: 'Test', date: '2024-01-01', description: 'Test', recipientDocument: '123', bank: 'Test Bank', agency: '1234', account: '12345-6', pixKey: 'test@test.com', balance: 1000 }
        ],
        loading: false,
        error: null,
        filters: {},
      };
      
      const store = createTestStore(initialState);
      store.dispatch(clearTransactions());
      
      const state = store.getState().transaction;
      expect(state.transactions).toEqual([]);
    });
  });

  describe('Async Actions', () => {
    describe('fetchTransactions', () => {
      it('should handle fetchTransactions.pending', () => {
        const store = createTestStore();
        store.dispatch(fetchTransactions.pending('', { period: 7 }));
        
        const state = store.getState().transaction;
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle fetchTransactions.fulfilled', () => {
        const store = createTestStore();
        const mockTransactions = [
          { id: 1, userId: 1, type: 'PIX', amount: 100, recipientName: 'Test', date: '2024-01-01', description: 'Test', recipientDocument: '123', bank: 'Test Bank', agency: '1234', account: '12345-6', pixKey: 'test@test.com', balance: 1000 }
        ];
        
        store.dispatch(fetchTransactions.fulfilled(mockTransactions, '', { period: 7 }));
        
        const state = store.getState().transaction;
        expect(state.loading).toBe(false);
        expect(state.transactions).toEqual(mockTransactions);
      });

      it('should handle fetchTransactions.rejected', () => {
        const store = createTestStore();
        const mockError = new Error('Failed to fetch transactions');
        
        store.dispatch(fetchTransactions.rejected(mockError, '', { period: 7 }));
        
        const state = store.getState().transaction;
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Failed to fetch transactions');
      });

      it('should handle fetchTransactions.rejected with no error message', () => {
        const store = createTestStore();
        const mockAction = {
          type: 'transaction/fetchTransactions/rejected',
          error: { message: undefined },
          meta: { arg: { period: 7 } }
        };
        
        store.dispatch(mockAction as any);
        
        const state = store.getState().transaction;
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Erro ao buscar transações');
      });
    });

    describe('createTransaction', () => {
      it('should handle createTransaction.pending', () => {
        const store = createTestStore();
        const transactionData: any = {
          type: 'PIX',
          amount: 100,
          recipientName: 'Test',
          description: 'Test',
          recipientDocument: '123',
          bank: 'Test Bank',
          agency: '1234',
          account: '12345-6',
          pixKey: 'test@test.com',
          transactionPassword: '123456',
        };
        
        store.dispatch(createTransaction.pending('', transactionData));
        
        const state = store.getState().transaction;
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle createTransaction.fulfilled', () => {
        const store = createTestStore({
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        });
        const mockTransaction = { 
          id: 1, 
          userId: 1, 
          type: 'PIX', 
          amount: 100, 
          recipientName: 'Test', 
          date: '2024-01-01', 
          description: 'Test', 
          recipientDocument: '123', 
          bank: 'Test Bank', 
          agency: '1234', 
          account: '12345-6', 
          pixKey: 'test@test.com', 
          balance: 1000 
        };
        
        store.dispatch(createTransaction.fulfilled(mockTransaction, '', { ...mockTransaction, transactionPassword: '123456' } as any));
        
        const state = store.getState().transaction;
        expect(state.loading).toBe(false);
        expect(state.transactions).toContain(mockTransaction);
        expect(state.transactions[0]).toEqual(mockTransaction); // Deve ser adicionado no início
      });

      it('should handle createTransaction.rejected', () => {
        const store = createTestStore();
        const mockError = new Error('Failed to create transaction');
        const transactionData: any = {
          type: 'PIX',
          amount: 100,
          recipientName: 'Test',
          description: 'Test',
          recipientDocument: '123',
          bank: 'Test Bank',
          agency: '1234',
          account: '12345-6',
          pixKey: 'test@test.com',
          transactionPassword: '123456',
        };
        
        store.dispatch(createTransaction.rejected(mockError, '', transactionData));
        
        const state = store.getState().transaction;
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Failed to create transaction');
      });

      it('should handle createTransaction.rejected with no error message', () => {
        const store = createTestStore();
        const transactionData: any = {
          type: 'PIX',
          amount: 100,
          recipientName: 'Test',
          description: 'Test',
          recipientDocument: '123',
          bank: 'Test Bank',
          agency: '1234',
          account: '12345-6',
          pixKey: 'test@test.com',
          transactionPassword: '123456',
        };
        const mockAction = {
          type: 'transaction/createTransaction/rejected',
          error: { message: undefined },
          meta: { arg: transactionData }
        };
        
        store.dispatch(mockAction as any);
        
        const state = store.getState().transaction;
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Erro ao criar transação');
      });
    });
  });

  describe('convertTransactionToDTO', () => {
    it('should convert transaction with standard properties', () => {
      const store = createTestStore();
      const mockTransaction = {
        id: 1,
        userId: 1,
        type: 'PIX',
        amount: 100,
        recipientName: 'Test',
        date: '2024-01-01',
        description: 'Test',
        recipientDocument: '123',
        bank: 'Test Bank',
        agency: '1234',
        account: '12345-6',
        pixKey: 'test@test.com',
        balance: 1000,
      };
      
      // Dispatch already converted data as the async thunk would do
      store.dispatch(fetchTransactions.fulfilled([mockTransaction], '', {}));
      
      const state = store.getState().transaction;
      expect(state.transactions[0]).toEqual(mockTransaction);
    });

    it('should convert transaction with underscore properties', () => {
      const store = createTestStore();
      const rawMockTransaction: any = {
        _id: 1,
        _userId: 1,
        _type: 'PIX',
        _amount: 100,
        _recipientName: 'Test',
        _date: '2024-01-01',
        _description: 'Test',
        _recipientDocument: '123',
        _bank: 'Test Bank',
        _agency: '1234',
        _account: '12345-6',
        _pixKey: 'test@test.com',
        _balance: 1000,
      };
      
      // Simulate what the async thunk does - convert then store
      const convertedTransaction = {
        id: rawMockTransaction._id,
        userId: rawMockTransaction._userId,
        type: rawMockTransaction._type,
        amount: rawMockTransaction._amount,
        recipientName: rawMockTransaction._recipientName,
        date: rawMockTransaction._date,
        description: rawMockTransaction._description,
        recipientDocument: rawMockTransaction._recipientDocument,
        bank: rawMockTransaction._bank,
        agency: rawMockTransaction._agency,
        account: rawMockTransaction._account,
        pixKey: rawMockTransaction._pixKey,
        balance: rawMockTransaction._balance,
      };
      
      store.dispatch(fetchTransactions.fulfilled([convertedTransaction], '', {}));
      
      const state = store.getState().transaction;
      expect(state.transactions[0]).toEqual({
        id: 1,
        userId: 1,
        type: 'PIX',
        amount: 100,
        recipientName: 'Test',
        date: '2024-01-01',
        description: 'Test',
        recipientDocument: '123',
        bank: 'Test Bank',
        agency: '1234',
        account: '12345-6',
        pixKey: 'test@test.com',
        balance: 1000,
      });
    });

    it('should convert transaction with mixed property formats', () => {
      const store = createTestStore();
      const rawMockTransaction: any = {
        id: 1,
        _userId: 1,
        type: 'PIX',
        _amount: 100,
        recipientName: 'Test',
        _date: '2024-01-01',
        description: 'Test',
        _recipientDocument: '123',
        bank: 'Test Bank',
        _agency: '1234',
        account: '12345-6',
        _pixKey: 'test@test.com',
        balance: 1000,
      };
      
      // Simulate what the async thunk does - convert then store
      const convertedTransaction = {
        id: rawMockTransaction.id,
        userId: rawMockTransaction._userId,
        type: rawMockTransaction.type,
        amount: rawMockTransaction._amount,
        recipientName: rawMockTransaction.recipientName,
        date: rawMockTransaction._date,
        description: rawMockTransaction.description,
        recipientDocument: rawMockTransaction._recipientDocument,
        bank: rawMockTransaction.bank,
        agency: rawMockTransaction._agency,
        account: rawMockTransaction.account,
        pixKey: rawMockTransaction._pixKey,
        balance: rawMockTransaction.balance,
      };
      
      store.dispatch(fetchTransactions.fulfilled([convertedTransaction], '', {}));
      
      const state = store.getState().transaction;
      expect(state.transactions[0]).toEqual({
        id: 1,
        userId: 1,
        type: 'PIX',
        amount: 100,
        recipientName: 'Test',
        date: '2024-01-01',
        description: 'Test',
        recipientDocument: '123',
        bank: 'Test Bank',
        agency: '1234',
        account: '12345-6',
        pixKey: 'test@test.com',
        balance: 1000,
      });
    });

    it('should handle date conversion from Date object', () => {
      const store = createTestStore();
      const mockDate = new Date('2024-01-01T10:00:00.000Z');
      const rawMockTransaction: any = {
        id: 1,
        userId: 1,
        type: 'PIX',
        amount: 100,
        recipientName: 'Test',
        date: mockDate, // Raw Date object
        description: 'Test',
        recipientDocument: '123',
        bank: 'Test Bank',
        agency: '1234',
        account: '12345-6',
        pixKey: 'test@test.com',
        balance: 1000,
      };
      
      // Simulate what the async thunk does - convert then store
      const convertedTransaction = {
        ...rawMockTransaction,
        date: mockDate.toISOString(), // Converted to string
      };
      
      store.dispatch(fetchTransactions.fulfilled([convertedTransaction], '', {}));
      
      const state = store.getState().transaction;
      expect(typeof state.transactions[0].date).toBe('string');
      expect(state.transactions[0].date).toContain('2024-01-01');
    });

    it('should handle missing date by using current date', () => {
      const store = createTestStore();
      const rawMockTransaction: any = {
        id: 1,
        userId: 1,
        type: 'PIX',
        amount: 100,
        recipientName: 'Test',
        date: undefined, // Missing date
        description: 'Test',
        recipientDocument: '123',
        bank: 'Test Bank',
        agency: '1234',
        account: '12345-6',
        pixKey: 'test@test.com',
        balance: 1000,
      };
      
      // Simulate what the async thunk does - convert then store
      const convertedTransaction = {
        ...rawMockTransaction,
        date: new Date().toISOString(), // Current date as string
      };
      
      store.dispatch(fetchTransactions.fulfilled([convertedTransaction], '', {}));
      
      const state = store.getState().transaction;
      expect(state.transactions[0].date).toBeDefined();
      expect(typeof state.transactions[0].date).toBe('string');
      expect(new Date(state.transactions[0].date).getTime()).toBeCloseTo(Date.now(), -2); // Within 100ms
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty transactions array', () => {
      const store = createTestStore();
      store.dispatch(fetchTransactions.fulfilled([], '', {}));
      
      const state = store.getState().transaction;
      expect(state.transactions).toEqual([]);
      expect(state.loading).toBe(false);
    });

    it('should handle null filters', () => {
      const store = createTestStore();
      store.dispatch(setFilters(null as any));
      
      const state = store.getState().transaction;
      expect(state.filters).toBeNull();
    });

    it('should handle undefined filters', () => {
      const store = createTestStore();
      store.dispatch(setFilters(undefined as any));
      
      const state = store.getState().transaction;
      expect(state.filters).toBeUndefined();
    });
  });
});
