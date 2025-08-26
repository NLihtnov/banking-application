import React from 'react';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../index';
import authReducer from '../../store/authSlice';
import transactionReducer from '../../store/transactionSlice';
import notificationReducer from '../../store/notificationSlice';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      transaction: transactionReducer,
      notification: notificationReducer,
    },
    preloadedState,
  });
};

const createWrapper = (store: any) => {
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(Provider, { store }, children);
  };
};

describe('Redux Hooks', () => {
  describe('useAppDispatch', () => {
    it('should return a dispatch function', () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      const { result } = renderHook(() => useAppDispatch(), { wrapper });

      expect(typeof result.current).toBe('function');
    });

    it('should dispatch actions correctly', () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      const { result } = renderHook(() => useAppDispatch(), { wrapper });
      
      const action = { type: 'auth/logout' };
      result.current(action);
      
      
      const state = store.getState();
      expect(state.auth.isAuthenticated).toBe(false);
    });
  });

  describe('useAppSelector', () => {
    it('should select state correctly', () => {
      const store = createTestStore({
        auth: {
          user: { id: 1, name: 'Test User', email: 'test@example.com', balance: 1000 },
          token: 'test-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      });
      const wrapper = createWrapper(store);

      const { result } = renderHook(
        () => useAppSelector(state => state.auth.user),
        { wrapper }
      );

      expect(result.current).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        balance: 1000,
      });
    });

    it('should return updated state when store changes', () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      const { result } = renderHook(
        () => useAppSelector(state => state.auth.isAuthenticated),
        { wrapper }
      );

      expect(result.current).toBe(false);

      
      store.dispatch({
        type: 'auth/login/fulfilled',
        payload: {
          user: { id: 1, name: 'Test', email: 'test@test.com', balance: 1000 },
          token: 'test-token',
        },
      });

      
      const { result: updatedResult } = renderHook(
        () => useAppSelector(state => state.auth.isAuthenticated),
        { wrapper }
      );

      
      expect(updatedResult.current).toBe(true);
    });

    it('should work with complex selectors', () => {
      const store = createTestStore({
        auth: {
          user: { id: 1, name: 'Test User', email: 'test@example.com', balance: 1000 },
          token: 'test-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
        transaction: {
          transactions: [
            { id: 1, amount: 100, type: 'PIX' },
            { id: 2, amount: 200, type: 'TED' },
          ],
          loading: false,
          error: null,
          filters: {},
        },
      });
      const wrapper = createWrapper(store);

      const { result } = renderHook(
        () => useAppSelector(state => ({
          userName: state.auth.user?.name,
          transactionCount: state.transaction.transactions.length,
          totalAmount: state.transaction.transactions.reduce((sum, t) => sum + t.amount, 0),
        })),
        { wrapper }
      );

      expect(result.current).toEqual({
        userName: 'Test User',
        transactionCount: 2,
        totalAmount: 300,
      });
    });
  });
});
