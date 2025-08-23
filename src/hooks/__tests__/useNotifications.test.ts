import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useNotifications } from '../useNotifications';
import authReducer from '../../store/authSlice';
import notificationReducer from '../../store/notificationSlice';

// Mock the WebSocketService
jest.mock('../../services/WebSocketService', () => ({
  webSocketService: {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn(),
    on: jest.fn(),
    markNotificationAsRead: jest.fn(),
    send: jest.fn(),
  },
}));

// Mock the hooks
const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock('../index', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => mockSelector(selector),
}));

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  value: jest.fn().mockImplementation(() => ({
    close: jest.fn(),
    onclick: null,
  })),
  configurable: true,
});

Object.defineProperty(window.Notification, 'permission', {
  value: 'granted',
  configurable: true,
});

Object.defineProperty(window.Notification, 'requestPermission', {
  value: jest.fn().mockResolvedValue('granted'),
  configurable: true,
});

// Mock focus
Object.defineProperty(window, 'focus', {
  value: jest.fn(),
  configurable: true,
});

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      notifications: notificationReducer,
    },
    preloadedState,
  });
};

const createWrapper = (store: any) => {
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(Provider, { store }, children);
  };
};

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    mockSelector.mockImplementation((selector: any) => {
      const mockState = {
        notifications: {
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: false,
        },
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      };
      return selector(mockState);
    });
  });

  describe('initialization', () => {
    it('should return initial notification state', () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useNotifications(), { wrapper });

      expect(result.current.notifications).toEqual([]);
      expect(result.current.unreadCount).toBe(0);
      expect(result.current.isConnected).toBe(false);
      expect(result.current.connectionError).toBeNull();
      expect(result.current.showNotifications).toBe(false);
    });

    it('should provide all required functions', () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useNotifications(), { wrapper });

      expect(typeof result.current.connectWebSocket).toBe('function');
      expect(typeof result.current.disconnectWebSocket).toBe('function');
      expect(typeof result.current.markNotificationAsRead).toBe('function');
      expect(typeof result.current.markAllNotificationsAsRead).toBe('function');
      expect(typeof result.current.requestNotificationPermission).toBe('function');
      expect(typeof result.current.sendTestNotification).toBe('function');
    });
  });

  describe('notification functions', () => {
    it('should mark notification as read', () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.markNotificationAsRead('notification-1');
      });

      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should mark all notifications as read', () => {
      // Mock with notifications
      mockSelector.mockImplementation((selector: any) => {
        const mockState = {
          notifications: {
            notifications: [
              {
                id: 'notif-1',
                type: 'info' as const,
                title: 'Test 1',
                message: 'Message 1',
                timestamp: '2024-01-01T10:00:00.000Z',
                priority: 'low' as const,
                read: false,
              },
              {
                id: 'notif-2',
                type: 'info' as const,
                title: 'Test 2',
                message: 'Message 2',
                timestamp: '2024-01-01T10:00:00.000Z',
                priority: 'low' as const,
                read: true,
              },
            ],
            unreadCount: 1,
            isConnected: true,
            connectionError: null,
            showNotifications: false,
          },
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          },
        };
        return selector(mockState);
      });

      const store = createTestStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.markAllNotificationsAsRead();
      });

      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should disconnect WebSocket', () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.disconnectWebSocket();
      });

      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe('browser notifications', () => {
    it('should request notification permission', async () => {
      // Reset the mock to ensure it returns 'granted'
      (window.Notification.requestPermission as jest.Mock).mockResolvedValue('granted');
      
      const store = createTestStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useNotifications(), { wrapper });

      const permission = await result.current.requestNotificationPermission();

      expect(window.Notification.requestPermission).toHaveBeenCalled();
      expect(permission).toBe(true);
    });

    it('should handle permission denied', async () => {
      (window.Notification.requestPermission as jest.Mock).mockResolvedValue('denied');

      const store = createTestStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useNotifications(), { wrapper });

      const permission = await result.current.requestNotificationPermission();

      expect(permission).toBe(false);
    });

    it('should handle missing Notification API', async () => {
      const originalNotification = window.Notification;
      delete (window as any).Notification;

      const store = createTestStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useNotifications(), { wrapper });

      const permission = await result.current.requestNotificationPermission();

      expect(permission).toBe(false);

      // Restore
      (window as any).Notification = originalNotification;
    });
  });

  describe('test notification', () => {
    it('should send test notification', () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.sendTestNotification();
      });

      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty notifications array in markAllAsRead', () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useNotifications(), { wrapper });

      act(() => {
        result.current.markAllNotificationsAsRead();
      });

      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});