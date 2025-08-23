import React from 'react';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useTransaction } from '../useTransaction';
import authReducer from '../../store/authSlice';
import transactionReducer from '../../store/transactionSlice';
import { webSocketService } from '../../services/WebSocketService';

// Mock the WebSocketService
jest.mock('../../services/WebSocketService', () => ({
  webSocketService: {
    send: jest.fn(),
  },
}));

// Mock the createTransaction action
const mockDispatch = jest.fn();
jest.mock('../index', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
}));

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      transaction: transactionReducer,
    },
    preloadedState,
  });
};

const createWrapper = (store: any) => {
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(Provider, { store }, children);
  };
};

describe('useTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { useAppSelector } = require('../index');
    useAppSelector.mockImplementation((selector: any) => {
      const mockState = {
        auth: {
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            balance: 1000,
          },
        },
      };
      return selector(mockState);
    });
  });

  describe('executeTransaction', () => {
    it('should execute transaction successfully', async () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      const mockTransactionResult = {
        id: 1,
        userId: 1,
        type: 'PIX',
        amount: 100,
        recipientName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        description: 'Test transaction',
        recipientDocument: '12345678901',
        pixKey: 'john@example.com',
        balance: 900,
      };

      mockDispatch.mockReturnValue({
        unwrap: () => Promise.resolve(mockTransactionResult),
      });

      const { result } = renderHook(() => useTransaction(), { wrapper });

      const transactionData = {
        type: 'PIX' as const,
        amount: 100,
        recipientName: 'John Doe',
        recipientDocument: '12345678901',
        bank: '',
        agency: '',
        account: '',
        pixKey: 'john@example.com',
        transactionPassword: '123456',
      };

      const response = await result.current.executeTransaction(transactionData);

      expect(response).toEqual({ success: true });
      expect(mockDispatch).toHaveBeenCalled();
      expect(webSocketService.send).toHaveBeenCalledTimes(2);
    });

    it('should handle transaction failure with no result', async () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      mockDispatch.mockReturnValue({
        unwrap: () => Promise.resolve(null),
      });

      const { result } = renderHook(() => useTransaction(), { wrapper });

      const transactionData = {
        type: 'PIX' as const,
        amount: 100,
        recipientName: 'John Doe',
        recipientDocument: '12345678901',
        bank: '',
        agency: '',
        account: '',
        pixKey: 'john@example.com',
        transactionPassword: '123456',
      };

      const response = await result.current.executeTransaction(transactionData);

      expect(response).toEqual({
        success: false,
        error: 'Falha ao criar transação',
      });
      expect(webSocketService.send).not.toHaveBeenCalled();
    });

    it('should handle transaction error', async () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      const mockError = new Error('Insufficient funds');
      mockDispatch.mockReturnValue({
        unwrap: () => Promise.reject(mockError),
      });

      const { result } = renderHook(() => useTransaction(), { wrapper });

      const transactionData = {
        type: 'PIX' as const,
        amount: 100,
        recipientName: 'John Doe',
        recipientDocument: '12345678901',
        bank: '',
        agency: '',
        account: '',
        pixKey: 'john@example.com',
        transactionPassword: '123456',
      };

      const response = await result.current.executeTransaction(transactionData);

      expect(response).toEqual({
        success: false,
        error: 'Insufficient funds',
      });
      expect(webSocketService.send).not.toHaveBeenCalled();
    });

    it('should handle non-Error thrown objects', async () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      mockDispatch.mockReturnValue({
        unwrap: () => Promise.reject('String error'),
      });

      const { result } = renderHook(() => useTransaction(), { wrapper });

      const transactionData = {
        type: 'PIX' as const,
        amount: 100,
        recipientName: 'John Doe',
        recipientDocument: '12345678901',
        bank: '',
        agency: '',
        account: '',
        pixKey: 'john@example.com',
        transactionPassword: '123456',
      };

      const response = await result.current.executeTransaction(transactionData);

      expect(response).toEqual({
        success: false,
        error: 'Erro desconhecido',
      });
    });

    it('should handle transaction without user', async () => {
      const { useAppSelector } = require('../index');
      useAppSelector.mockImplementation((selector: any) => {
        const mockState = {
          auth: {
            user: null,
          },
        };
        return selector(mockState);
      });

      const store = createTestStore();
      const wrapper = createWrapper(store);

      const mockTransactionResult = {
        id: 1,
        userId: 1,
        type: 'PIX',
        amount: 100,
        recipientName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        description: 'Test transaction',
        recipientDocument: '12345678901',
        pixKey: 'john@example.com',
        balance: 900,
      };

      mockDispatch.mockReturnValue({
        unwrap: () => Promise.resolve(mockTransactionResult),
      });

      const { result } = renderHook(() => useTransaction(), { wrapper });

      const transactionData = {
        type: 'PIX' as const,
        amount: 100,
        recipientName: 'John Doe',
        recipientDocument: '12345678901',
        bank: '',
        agency: '',
        account: '',
        pixKey: 'john@example.com',
        transactionPassword: '123456',
      };

      const response = await result.current.executeTransaction(transactionData);

      expect(response).toEqual({ success: true });
      expect(webSocketService.send).toHaveBeenCalledTimes(1); // Only transaction notification, no balance update
    });
  });
});