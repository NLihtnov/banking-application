import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useNotifications } from '../useNotifications';
import { webSocketService } from '../../services/WebSocketService';
import notificationReducer from '../../store/notificationSlice';
import authReducer from '../../store/authSlice';


jest.mock('../../services/WebSocketService', () => ({
  webSocketService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    send: jest.fn(),
    markNotificationAsRead: jest.fn(),
  },
}));


Object.defineProperty(window, 'Notification', {
  value: {
    requestPermission: jest.fn(),
    permission: 'granted',
  },
  writable: true,
});


const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      notifications: notificationReducer,
      auth: authReducer,
    },
    preloadedState: initialState,
  });
};

const createWrapper = (store: any) => {
  return ({ children }: { children: React.ReactNode }) => 
    React.createElement(Provider, { store, children });
};

describe('useNotifications', () => {
  let mockWebSocketService: jest.Mocked<typeof webSocketService>;
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWebSocketService = webSocketService as jest.Mocked<typeof webSocketService>;
    
    store = createTestStore({
      auth: {
        token: 'test-token',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          balance: 1000,
        },
      },
      notifications: {
        notifications: [],
        unreadCount: 0,
        isConnected: false,
        connectionError: null,
        showNotifications: false,
      },
    });
  });

  test('should be defined', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });
    expect(result.current).toBeDefined();
  });

  test('should connect to WebSocket when token and user are available', async () => {
    mockWebSocketService.connect.mockResolvedValue(undefined);

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.connectWebSocket();
    });

    expect(mockWebSocketService.connect).toHaveBeenCalledWith('test-token');
    expect(mockWebSocketService.on).toHaveBeenCalledWith('connected', expect.any(Function));
    expect(mockWebSocketService.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockWebSocketService.on).toHaveBeenCalledWith('notification', expect.any(Function));
    expect(mockWebSocketService.on).toHaveBeenCalledWith('transaction_update', expect.any(Function));
    expect(mockWebSocketService.on).toHaveBeenCalledWith('balance_update', expect.any(Function));
  });

  test('should not connect to WebSocket when token is not available', async () => {
    store = createTestStore({
      auth: {
        token: null,
        user: null,
      },
      notifications: {
        notifications: [],
        unreadCount: 0,
        isConnected: false,
        connectionError: null,
        showNotifications: false,
      },
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.connectWebSocket();
    });

    expect(mockWebSocketService.connect).not.toHaveBeenCalled();
  });

  test('should handle WebSocket connection error', async () => {
    const errorMessage = 'Connection failed';
    mockWebSocketService.connect.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.connectWebSocket();
    });

    expect(mockWebSocketService.connect).toHaveBeenCalledWith('test-token');
  });

  test('should disconnect from WebSocket', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current.disconnectWebSocket();
    });

    expect(mockWebSocketService.disconnect).toHaveBeenCalled();
  });

  test('should mark notification as read', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });

    const notificationId = 'test-notification-id';

    act(() => {
      result.current.markNotificationAsRead(notificationId);
    });

    expect(mockWebSocketService.markNotificationAsRead).toHaveBeenCalledWith(notificationId);
  });

  test('should mark all notifications as read', () => {
    store = createTestStore({
      auth: {
        token: 'test-token',
        user: { id: 1, name: 'Test User', email: 'test@example.com', balance: 1000 },
      },
      notifications: {
        notifications: [
          { id: '1', read: false, title: 'Test 1', message: 'Message 1' },
          { id: '2', read: true, title: 'Test 2', message: 'Message 2' },
          { id: '3', read: false, title: 'Test 3', message: 'Message 3' },
        ],
        unreadCount: 2,
        isConnected: false,
        connectionError: null,
        showNotifications: false,
      },
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current.markAllNotificationsAsRead();
    });

    expect(mockWebSocketService.markNotificationAsRead).toHaveBeenCalledWith('1');
    expect(mockWebSocketService.markNotificationAsRead).toHaveBeenCalledWith('3');
    expect(mockWebSocketService.markNotificationAsRead).toHaveBeenCalledTimes(2);
  });

  test('should request notification permission when available', async () => {
    const mockRequestPermission = jest.fn().mockResolvedValue('granted');
    Object.defineProperty(window, 'Notification', {
      value: {
        requestPermission: mockRequestPermission,
        permission: 'default',
      },
      writable: true,
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });

    let permissionResult;
    await act(async () => {
      permissionResult = await result.current.requestNotificationPermission();
    });

    expect(mockRequestPermission).toHaveBeenCalled();
    expect(permissionResult).toBe(true);
  });

  test('should return false when notification permission is not available', async () => {
    
    const originalNotification = window.Notification;
    delete (window as any).Notification;

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });

    let permissionResult;
    await act(async () => {
      permissionResult = await result.current.requestNotificationPermission();
    });

    expect(permissionResult).toBe(false);

    
    (window as any).Notification = originalNotification;
  });

  test('should send test notification', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current.sendTestNotification();
    });

    
    const state = store.getState();
    expect(state.notifications.notifications).toHaveLength(1);
    expect(state.notifications.notifications[0].title).toBe('Teste de Notificação');
  });

  test('should handle WebSocket event handlers', async () => {
    mockWebSocketService.connect.mockResolvedValue(undefined);
    let eventHandlers: any = {};

    mockWebSocketService.on.mockImplementation((event, handler) => {
      eventHandlers[event] = handler;
    });

    
    const mockNotification = {
      close: jest.fn(),
      onclick: null as any,
    };
    const mockNotificationConstructor = jest.fn().mockReturnValue(mockNotification);
    
    Object.defineProperty(window, 'Notification', {
      value: mockNotificationConstructor,
      writable: true,
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(store),
    });

    await act(async () => {
      await result.current.connectWebSocket();
    });

    
    act(() => {
      eventHandlers.connected(true);
    });

    
    act(() => {
      eventHandlers.error(new Error('Test error'));
    });

    
    const testNotification = {
      id: 'test-1',
      type: 'system_message',
      title: 'Test',
      message: 'Test message',
      timestamp: new Date().toISOString(),
      priority: 'high' as const,
      read: false,
    };

    act(() => {
      eventHandlers.notification(testNotification);
    });

    
    const transactionData = { id: 1, type: 'transfer', amount: 100 };
    act(() => {
      eventHandlers.transaction_update(transactionData);
    });

    
    const balanceData = { newBalance: 900 };
    act(() => {
      eventHandlers.balance_update(balanceData);
    });

    expect(mockWebSocketService.on).toHaveBeenCalledTimes(10);
  });
});
