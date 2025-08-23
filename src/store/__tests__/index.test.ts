import { configureStore } from '@reduxjs/toolkit';
import { store, RootState, AppDispatch } from '../index';
import authReducer from '../authSlice';
import transactionReducer from '../transactionSlice';
import notificationReducer from '../notificationSlice';

describe('Store Configuration', () => {

  describe('Store Structure', () => {
    it('should have correct reducer structure', () => {
      const initialState = store.getState();
      
      expect(initialState).toHaveProperty('auth');
      expect(initialState).toHaveProperty('transaction');
      expect(initialState).toHaveProperty('notifications');
    });

    it('should have correct store configuration', () => {
      expect(store).toBeDefined();
      expect(typeof store.dispatch).toBe('function');
      expect(typeof store.getState).toBe('function');
      expect(typeof store.subscribe).toBe('function');
    });
  });

  describe('Store Instance', () => {
    it('should export a store instance', () => {
      expect(store).toBeDefined();
      expect(typeof store.dispatch).toBe('function');
      expect(typeof store.getState).toBe('function');
    });

    it('should have correct store methods', () => {
      expect(store).toHaveProperty('dispatch');
      expect(store).toHaveProperty('getState');
      expect(store).toHaveProperty('subscribe');
      expect(store).toHaveProperty('replaceReducer');
    });
  });

  describe('Type Definitions', () => {
    it('should have valid RootState type structure', () => {
      const state = store.getState();
      
      // Verifica se RootState é um tipo válido testando a estrutura real
      expect(state).toHaveProperty('auth');
      expect(state).toHaveProperty('transaction');
      expect(state).toHaveProperty('notifications');
      
      expect(state.auth).toHaveProperty('user');
      expect(state.auth).toHaveProperty('token');
      expect(state.auth).toHaveProperty('isAuthenticated');
      expect(state.auth).toHaveProperty('loading');
      expect(state.auth).toHaveProperty('error');
    });

    it('should have valid AppDispatch type', () => {
      // Verifica se AppDispatch funciona corretamente
      expect(typeof store.dispatch).toBe('function');
      
      // Testa se pode despachar uma ação
      expect(() => {
        store.dispatch({ type: 'test/action' });
      }).not.toThrow();
    });
  });

  describe('Store State Shape', () => {
    it('should have correct initial state shape', () => {
      const initialState = store.getState();
      
      expect(initialState).toHaveProperty('auth');
      expect(initialState).toHaveProperty('transaction');
      expect(initialState).toHaveProperty('notifications');
      
      // Verifica os valores iniciais do auth
      expect(initialState.auth.user).toBeNull();
      expect(initialState.auth.loading).toBe(false);
      expect(initialState.auth.error).toBeNull();
      expect(initialState.auth.isAuthenticated).toBe(false);
      
      // Verifica os valores iniciais do transaction
      expect(initialState.transaction.transactions).toEqual([]);
      expect(initialState.transaction.loading).toBe(false);
      expect(initialState.transaction.error).toBeNull();
      expect(initialState.transaction.filters).toEqual({});
      
      // Verifica os valores iniciais do notifications
      expect(initialState.notifications.notifications).toEqual([]);
      expect(initialState.notifications.unreadCount).toBe(0);
      expect(initialState.notifications.isConnected).toBe(false);
      expect(initialState.notifications.connectionError).toBeNull();
      expect(initialState.notifications.showNotifications).toBe(false);
    });
  });

  describe('Middleware Configuration', () => {
    it('should handle middleware correctly', () => {
      // Testa se o store consegue processar ações assíncronas
      expect(() => {
        store.dispatch({ type: 'test/async', payload: Promise.resolve() });
      }).not.toThrow();
    });
  });

  describe('Store Integration', () => {
    it('should allow dispatching actions to all slices', () => {
      // Verifica se o store pode receber ações de todos os slices
      expect(() => {
        store.dispatch({ type: 'auth/logout' });
      }).not.toThrow();
      
      expect(() => {
        store.dispatch({ type: 'transaction/clearError' });
      }).not.toThrow();
      
      expect(() => {
        store.dispatch({ type: 'notification/clearNotifications' });
      }).not.toThrow();
    });

    it('should maintain state consistency across slices', () => {
      const initialState = store.getState();
      
      // Verifica se o estado inicial é consistente
      expect(initialState.auth.isAuthenticated).toBe(false);
      expect(initialState.transaction.transactions).toEqual([]);
      expect(initialState.notifications.notifications).toEqual([]);
      
      // Testa uma mudança de estado
      store.dispatch({ type: 'auth/logout' });
      const newState = store.getState();
      expect(newState.auth.isAuthenticated).toBe(false);
    });
  });
});
