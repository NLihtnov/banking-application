import { renderHook } from '@testing-library/react';
import { useSerializableData } from '../useSerializableData';

describe('useSerializableData', () => {
  describe('serializeUser', () => {
    it('should serialize user with standard properties', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        balance: 1000,
      };

      const serialized = result.current.serializeUser(user);

      expect(serialized).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        balance: 1000,
      });
    });

    it('should serialize user with underscore properties', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const user = {
        _id: 1,
        _name: 'Test User',
        _email: 'test@example.com',
        _balance: 1000,
      };

      const serialized = result.current.serializeUser(user);

      expect(serialized).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        balance: 1000,
      });
    });

    it('should handle mixed property formats', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const user = {
        id: 1,
        _name: 'Test User',
        email: 'test@example.com',
        _balance: 1000,
      };

      const serialized = result.current.serializeUser(user);

      expect(serialized).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        balance: 1000,
      });
    });

    it('should handle null/undefined user', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const serializedNull = result.current.serializeUser(null);
      const serializedUndefined = result.current.serializeUser(undefined);

      expect(serializedNull).toEqual({
        id: 0,
        name: '',
        email: '',
        balance: 0,
      });

      expect(serializedUndefined).toEqual({
        id: 0,
        name: '',
        email: '',
        balance: 0,
      });
    });

    it('should handle user with missing properties', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const user = {
        id: 1,
        name: 'Test User',
        
      };

      const serialized = result.current.serializeUser(user);

      expect(serialized).toEqual({
        id: 1,
        name: 'Test User',
        email: '',
        balance: 0,
      });
    });
  });

  describe('serializeTransaction', () => {
    it('should serialize transaction with standard properties', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const transaction = {
        id: 1,
        userId: 1,
        type: 'PIX',
        amount: 100,
        recipientName: 'Test User',
        date: '2024-01-01T10:00:00.000Z',
        description: 'Test transaction',
        recipientDocument: '123456789',
        bank: 'Test Bank',
        agency: '1234',
        account: '12345-6',
        pixKey: 'test@example.com',
        balance: 900,
      };

      const serialized = result.current.serializeTransaction(transaction);

      expect(serialized).toEqual(transaction);
    });

    it('should serialize transaction with underscore properties', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const transaction = {
        _id: 1,
        _userId: 1,
        _type: 'PIX',
        _amount: 100,
        _recipientName: 'Test User',
        date: '2024-01-01T10:00:00.000Z', 
        _description: 'Test transaction',
        _recipientDocument: '123456789',
        _bank: 'Test Bank',
        _agency: '1234',
        _account: '12345-6',
        _pixKey: 'test@example.com',
        _balance: 900,
      };

      const serialized = result.current.serializeTransaction(transaction);

      expect(serialized.id).toBe(1);
      expect(serialized.userId).toBe(1);
      expect(serialized.type).toBe('PIX');
      expect(serialized.amount).toBe(100);
      expect(serialized.recipientName).toBe('Test User');
      expect(serialized.date).toBe('2024-01-01T10:00:00.000Z');
      expect(serialized.description).toBe('Test transaction');
      expect(serialized.recipientDocument).toBe('123456789');
      expect(serialized.bank).toBe('Test Bank');
      expect(serialized.agency).toBe('1234');
      expect(serialized.account).toBe('12345-6');
      expect(serialized.pixKey).toBe('test@example.com');
      expect(serialized.balance).toBe(900);
    });

    it('should handle Date object conversion', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const mockDate = new Date('2024-01-01T10:00:00.000Z');
      const transaction = {
        id: 1,
        userId: 1,
        type: 'PIX',
        amount: 100,
        recipientName: 'Test User',
        date: mockDate,
      };

      const serialized = result.current.serializeTransaction(transaction);

      expect(serialized.date).toBe('2024-01-01T10:00:00.000Z');
      expect(typeof serialized.date).toBe('string');
    });

    it('should handle missing date by using current date', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const transaction = {
        id: 1,
        userId: 1,
        type: 'PIX',
        amount: 100,
        recipientName: 'Test User',
        
      };

      const beforeTime = Date.now();
      const serialized = result.current.serializeTransaction(transaction);
      const afterTime = Date.now();

      expect(serialized.date).toBeDefined();
      expect(typeof serialized.date).toBe('string');
      
      const serializedTime = new Date(serialized.date).getTime();
      expect(serializedTime).toBeGreaterThanOrEqual(beforeTime);
      expect(serializedTime).toBeLessThanOrEqual(afterTime);
    });

    it('should handle null/undefined transaction', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const serializedNull = result.current.serializeTransaction(null);
      const serializedUndefined = result.current.serializeTransaction(undefined);

      expect(serializedNull.id).toBe(0);
      expect(serializedNull.userId).toBe(0);
      expect(serializedNull.type).toBe('');
      expect(serializedNull.amount).toBe(0);
      expect(serializedNull.recipientName).toBe('');

      expect(serializedUndefined.id).toBe(0);
      expect(serializedUndefined.userId).toBe(0);
      expect(serializedUndefined.type).toBe('');
      expect(serializedUndefined.amount).toBe(0);
      expect(serializedUndefined.recipientName).toBe('');
    });
  });

  describe('serializeTransactions', () => {
    it('should serialize array of transactions', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const transactions = [
        {
          id: 1,
          userId: 1,
          type: 'PIX',
          amount: 100,
          recipientName: 'User 1',
          date: '2024-01-01T10:00:00.000Z',
        },
        {
          _id: 2,
          _userId: 1,
          _type: 'TED',
          _amount: 200,
          _recipientName: 'User 2',
          _date: '2024-01-02T10:00:00.000Z',
        },
      ];

      const serialized = result.current.serializeTransactions(transactions);

      expect(serialized).toHaveLength(2);
      expect(serialized[0].id).toBe(1);
      expect(serialized[0].type).toBe('PIX');
      expect(serialized[1].id).toBe(2);
      expect(serialized[1].type).toBe('TED');
    });

    it('should handle empty array', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const serialized = result.current.serializeTransactions([]);

      expect(serialized).toEqual([]);
    });

    it('should handle non-array input', () => {
      const { result } = renderHook(() => useSerializableData());
      
      const serializedNull = result.current.serializeTransactions(null as any);
      const serializedUndefined = result.current.serializeTransactions(undefined as any);
      const serializedObject = result.current.serializeTransactions({} as any);

      expect(serializedNull).toEqual([]);
      expect(serializedUndefined).toEqual([]);
      expect(serializedObject).toEqual([]);
    });
  });

  describe('memoization', () => {
    it('should return the same function reference on re-renders', () => {
      const { result, rerender } = renderHook(() => useSerializableData());
      
      const firstSerializeUser = result.current.serializeUser;
      const firstSerializeTransaction = result.current.serializeTransaction;
      const firstSerializeTransactions = result.current.serializeTransactions;

      rerender();

      expect(result.current.serializeUser).toBe(firstSerializeUser);
      expect(result.current.serializeTransaction).toBe(firstSerializeTransaction);
      expect(result.current.serializeTransactions).toBe(firstSerializeTransactions);
    });
  });
});
