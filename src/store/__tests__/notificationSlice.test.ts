import { configureStore } from '@reduxjs/toolkit';
import notificationReducer, {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  setConnectionStatus,
  setConnectionError,
  toggleNotifications,
  hideNotifications,
  updateTransactionNotification,
  updateBalanceNotification,
} from '../notificationSlice';

// Configuração do store de teste
const createTestStore = (preloadedState: any = undefined) => {
  const config: any = {
    reducer: { notifications: notificationReducer },
  };
  
  if (preloadedState !== undefined) {
    config.preloadedState = { notifications: preloadedState };
  }
  
  return configureStore(config);
};

describe('Notification Slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = createTestStore();
      const state = store.getState().notifications;
      
      expect(state.notifications).toEqual([]);
      expect(state.unreadCount).toBe(0);
      expect(state.isConnected).toBe(false);
      expect(state.connectionError).toBeNull();
      expect(state.showNotifications).toBe(false);
    });
  });

  describe('Reducers', () => {
    describe('addNotification', () => {
      it('should add a new notification to the beginning of the list', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        const notification: any = {
          id: '1',
          type: 'info',
          title: 'Test Notification',
          message: 'Test message',
          timestamp: '2024-01-01T10:00:00.000Z',
          userId: '1',
          data: {},
          priority: 'low',
          read: false,
        };
        
        store.dispatch(addNotification(notification));
        
        const state = store.getState().notifications;
        expect(state.notifications).toHaveLength(1);
        expect(state.notifications[0]).toEqual(notification);
        expect(state.unreadCount).toBe(1);
      });

      it('should increment unreadCount for unread notifications', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        const notification: any = {
          id: '1',
          type: 'info',
          title: 'Test Notification',
          message: 'Test message',
          timestamp: '2024-01-01T10:00:00.000Z',
          userId: '1',
          data: {},
          priority: 'low',
          read: false,
        };
        
        store.dispatch(addNotification(notification));
        
        const state = store.getState().notifications;
        expect(state.unreadCount).toBe(1);
      });

      it('should not increment unreadCount for read notifications', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        const notification: any = {
          id: '1',
          type: 'info',
          title: 'Test Notification',
          message: 'Test message',
          timestamp: '2024-01-01T10:00:00.000Z',
          userId: '1',
          data: {},
          priority: 'low',
          read: true,
        };
        
        store.dispatch(addNotification(notification));
        
        const state = store.getState().notifications;
        expect(state.unreadCount).toBe(0);
      });

      it('should limit notifications to 50 and remove oldest when exceeded', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        const notifications = Array.from({ length: 51 }, (_, i) => ({
          id: `${i}`,
          type: 'info' as any,
          title: `Notification ${i}`,
          message: `Message ${i}`,
          timestamp: '2024-01-01T10:00:00.000Z',
          userId: '1',
          data: {},
          priority: 'low' as any,
          read: i < 25, // First 25 are read, last 26 are unread
        }));
        
        // Add 51 notifications
        notifications.forEach(notification => {
          store.dispatch(addNotification(notification as any));
        });
        
        const state = store.getState().notifications;
        expect(state.notifications).toHaveLength(50);
        expect(state.notifications[0].id).toBe('50'); // Most recent first
        expect(state.notifications[49].id).toBe('1'); // Oldest remaining
        expect(state.unreadCount).toBe(26); // 26 unread notifications
      });

      it('should handle removal of unread notification when limit exceeded', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        const notifications = Array.from({ length: 51 }, (_, i) => ({
          id: `${i}`,
          type: 'info' as any,
          title: `Notification ${i}`,
          message: `Message ${i}`,
          timestamp: '2024-01-01T10:00:00.000Z',
          userId: '1',
          data: {},
          priority: 'low' as any,
          read: false, // All unread
        }));
        
        // Add 51 notifications
        notifications.forEach(notification => {
          store.dispatch(addNotification(notification as any));
        });
        
        const state = store.getState().notifications;
        expect(state.notifications).toHaveLength(50);
        expect(state.unreadCount).toBe(50); // One unread notification was removed
      });
    });

    describe('markAsRead', () => {
      it('should mark a specific notification as read', () => {
        const store = createTestStore({
          notifications: [
            {
              id: '1',
              type: 'info',
              title: 'Test Notification',
              message: 'Test message',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: false,
            },
          ],
          unreadCount: 1,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(markAsRead('1'));
        
        const state = store.getState().notifications;
        expect(state.notifications[0].read).toBe(true);
        expect(state.unreadCount).toBe(0);
      });

      it('should not change unreadCount if notification is already read', () => {
        const store = createTestStore({
          notifications: [
            {
              id: '1',
              type: 'info',
              title: 'Test Notification',
              message: 'Test message',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: true,
            },
          ],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(markAsRead('1'));
        
        const state = store.getState().notifications;
        expect(state.unreadCount).toBe(0);
      });

      it('should not change unreadCount if notification is not found', () => {
        const store = createTestStore({
          notifications: [
            {
              id: '1',
              type: 'info',
              title: 'Test Notification',
              message: 'Test message',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: false,
            },
          ],
          unreadCount: 1,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(markAsRead('2'));
        
        const state = store.getState().notifications;
        expect(state.unreadCount).toBe(1);
      });

      it('should not allow unreadCount to go below 0', () => {
        const store = createTestStore({
          notifications: [
            {
              id: '1',
              type: 'info',
              title: 'Test Notification',
              message: 'Test message',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: false,
            },
          ],
          unreadCount: 0, // Already at 0
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(markAsRead('1'));
        
        const state = store.getState().notifications;
        expect(state.unreadCount).toBe(0);
      });
    });

    describe('markAllAsRead', () => {
      it('should mark all notifications as read', () => {
        const store = createTestStore({
          notifications: [
            {
              id: '1',
              type: 'info',
              title: 'Test Notification 1',
              message: 'Test message 1',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: false,
            },
            {
              id: '2',
              type: 'info',
              title: 'Test Notification 2',
              message: 'Test message 2',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: false,
            },
          ],
          unreadCount: 2,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(markAllAsRead());
        
        const state = store.getState().notifications;
        expect(state.notifications[0].read).toBe(true);
        expect(state.notifications[1].read).toBe(true);
        expect(state.unreadCount).toBe(0);
      });

      it('should handle empty notifications array', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(markAllAsRead());
        
        const state = store.getState().notifications;
        expect(state.unreadCount).toBe(0);
      });
    });

    describe('removeNotification', () => {
      it('should remove a specific notification', () => {
        const store = createTestStore({
          notifications: [
            {
              id: '1',
              type: 'info',
              title: 'Test Notification',
              message: 'Test message',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: false,
            },
          ],
          unreadCount: 1,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(removeNotification('1'));
        
        const state = store.getState().notifications;
        expect(state.notifications).toHaveLength(0);
        expect(state.unreadCount).toBe(0);
      });

      it('should decrement unreadCount when removing unread notification', () => {
        const store = createTestStore({
          notifications: [
            {
              id: '1',
              type: 'info',
              title: 'Test Notification',
              message: 'Test message',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: false,
            },
          ],
          unreadCount: 1,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(removeNotification('1'));
        
        const state = store.getState().notifications;
        expect(state.unreadCount).toBe(0);
      });

      it('should not change unreadCount when removing read notification', () => {
        const store = createTestStore({
          notifications: [
            {
              id: '1',
              type: 'info',
              title: 'Test Notification',
              message: 'Test message',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: true,
            },
          ],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(removeNotification('1'));
        
        const state = store.getState().notifications;
        expect(state.unreadCount).toBe(0);
      });

      it('should handle removing non-existent notification', () => {
        const store = createTestStore({
          notifications: [
            {
              id: '1',
              type: 'info',
              title: 'Test Notification',
              message: 'Test message',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: false,
            },
          ],
          unreadCount: 1,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(removeNotification('2'));
        
        const state = store.getState().notifications;
        expect(state.notifications).toHaveLength(1);
        expect(state.unreadCount).toBe(1);
      });
    });

    describe('clearNotifications', () => {
      it('should clear all notifications and reset unreadCount', () => {
        const store = createTestStore({
          notifications: [
            {
              id: '1',
              type: 'info',
              title: 'Test Notification',
              message: 'Test message',
              timestamp: '2024-01-01T10:00:00.000Z',
              userId: '1',
              data: {},
              priority: 'low',
              read: false,
            },
          ],
          unreadCount: 1,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(clearNotifications());
        
        const state = store.getState().notifications;
        expect(state.notifications).toHaveLength(0);
        expect(state.unreadCount).toBe(0);
      });
    });

    describe('setConnectionStatus', () => {
      it('should set connection status to true', () => {
        const store = createTestStore();
        
        store.dispatch(setConnectionStatus(true));
        
        const state = store.getState().notifications;
        expect(state.isConnected).toBe(true);
        expect(state.connectionError).toBeNull();
      });

      it('should set connection status to false', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: true,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(setConnectionStatus(false));
        
        const state = store.getState().notifications;
        expect(state.isConnected).toBe(false);
      });

      it('should clear connection error when setting status to true', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: 'Connection failed',
          showNotifications: false,
        });
        
        store.dispatch(setConnectionStatus(true));
        
        const state = store.getState().notifications;
        expect(state.isConnected).toBe(true);
        expect(state.connectionError).toBeNull();
      });
    });

    describe('setConnectionError', () => {
      it('should set connection error and set isConnected to false', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: true,
          connectionError: null,
          showNotifications: false,
        });
        
        store.dispatch(setConnectionError('Connection failed'));
        
        const state = store.getState().notifications;
        expect(state.connectionError).toBe('Connection failed');
        expect(state.isConnected).toBe(false);
      });
    });

    describe('toggleNotifications', () => {
      it('should toggle showNotifications from false to true', () => {
        const store = createTestStore();
        
        store.dispatch(toggleNotifications());
        
        const state = store.getState().notifications;
        expect(state.showNotifications).toBe(true);
      });

      it('should toggle showNotifications from true to false', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: true,
        });
        
        store.dispatch(toggleNotifications());
        
        const state = store.getState().notifications;
        expect(state.showNotifications).toBe(false);
      });
    });

    describe('hideNotifications', () => {
      it('should set showNotifications to false', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: true,
        });
        
        store.dispatch(hideNotifications());
        
        const state = store.getState().notifications;
        expect(state.showNotifications).toBe(false);
      });
    });

    describe('updateTransactionNotification', () => {
      it('should create and add a transaction notification', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        const transactionData = {
          id: 1,
          type: 'PIX',
          amount: 100,
          recipientName: 'Test User',
          userId: '1',
        };
        
        store.dispatch(updateTransactionNotification(transactionData));
        
        const state = store.getState().notifications;
        expect(state.notifications).toHaveLength(1);
        expect(state.notifications[0].type).toBe('transaction');
        expect(state.notifications[0].title).toBe('Nova Transação');
        expect(state.notifications[0].message).toContain('PIX');
        expect(state.notifications[0].message).toContain('R$');
        expect(state.notifications[0].message).toContain('Test User');
        expect(state.notifications[0].read).toBe(false);
        expect(state.unreadCount).toBe(1);
      });
    });

    describe('updateBalanceNotification', () => {
      it('should create and add a balance increase notification', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        const balanceData = {
          oldBalance: 1000,
          newBalance: 1500,
        };
        
        store.dispatch(updateBalanceNotification(balanceData));
        
        const state = store.getState().notifications;
        expect(state.notifications).toHaveLength(1);
        expect(state.notifications[0].type).toBe('balance_update');
        expect(state.notifications[0].title).toBe('Saldo Atualizado');
        expect(state.notifications[0].message).toContain('aumentou');
        expect(state.notifications[0].message).toContain('R$');
        expect(state.notifications[0].message).toContain('500,00');
        expect(state.notifications[0].read).toBe(false);
        expect(state.unreadCount).toBe(1);
      });

      it('should create and add a balance decrease notification', () => {
        const store = createTestStore({
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        });
        const balanceData = {
          oldBalance: 1500,
          newBalance: 1000,
        };
        
        store.dispatch(updateBalanceNotification(balanceData));
        
        const state = store.getState().notifications;
        expect(state.notifications).toHaveLength(1);
        expect(state.notifications[0].type).toBe('balance_update');
        expect(state.notifications[0].title).toBe('Saldo Atualizado');
        expect(state.notifications[0].message).toContain('reduzido');
        expect(state.notifications[0].message).toContain('R$');
        expect(state.notifications[0].message).toContain('500,00');
        expect(state.notifications[0].read).toBe(false);
        expect(state.unreadCount).toBe(1);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid notifications', () => {
      const store = createTestStore({
        notifications: [],
        unreadCount: 0,
        isConnected: false,
        connectionError: null,
        showNotifications: false,
      });
      const notifications = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        type: 'info' as any,
        title: `Notification ${i}`,
        message: `Message ${i}`,
        timestamp: '2024-01-01T10:00:00.000Z',
        userId: '1',
        data: {},
        priority: 'low' as any,
        read: false,
      }));
      
      notifications.forEach(notification => {
        store.dispatch(addNotification(notification as any));
      });
      
      const state = store.getState().notifications;
      expect(state.notifications).toHaveLength(10);
      expect(state.unreadCount).toBe(10);
    });

    it('should handle notifications with missing optional fields', () => {
      const store = createTestStore({
        notifications: [],
        unreadCount: 0,
        isConnected: false,
        connectionError: null,
        showNotifications: false,
      });
      const notification: any = {
        id: '1',
        type: 'info' as any,
        title: 'Test Notification',
        message: 'Test message',
        timestamp: '2024-01-01T10:00:00.000Z',
        userId: '1',
        data: {},
        priority: 'low' as any,
        read: false,
      };
      
      store.dispatch(addNotification(notification));
      
      const state = store.getState().notifications;
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0]).toEqual(notification);
    });
  });
});
