import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NotificationPanel } from '../NotificationPanel';
import notificationReducer from '../../../store/notificationSlice';
import authReducer from '../../../store/authSlice';
import { NotificationData } from '../../../services/WebSocketService';


const mockMarkNotificationAsRead = jest.fn();
const mockMarkAllNotificationsAsRead = jest.fn();
const mockSendTestNotification = jest.fn();

jest.mock('../../../hooks/useNotifications', () => ({
  useNotifications: jest.fn(() => ({
    notifications: [],
    unreadCount: 0,
    isConnected: false,
    markNotificationAsRead: mockMarkNotificationAsRead,
    markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
    sendTestNotification: mockSendTestNotification,
  })),
}));

const mockUseNotifications = require('../../../hooks/useNotifications').useNotifications;


const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock('../../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => mockSelector(selector),
}));

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      notifications: notificationReducer,
      auth: authReducer,
    },
    preloadedState,
  });
};

const createWrapper = (store: any) => {
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(Provider, { store }, children);
  };
};

const mockNotification: NotificationData = {
  id: 'test-1',
  type: 'transaction',
  title: 'Test Transaction',
  message: 'This is a test notification',
  timestamp: '2024-01-01T10:00:00.000Z',
  priority: 'medium',
  read: false,
};

const mockReadNotification: NotificationData = {
  id: 'test-2',
  type: 'system_message',
  title: 'Read Message',
  message: 'This notification is already read',
  timestamp: '2024-01-01T09:00:00.000Z',
  priority: 'low',
  read: true,
};

describe('NotificationPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    
    mockUseNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });
    
    
    mockSelector.mockImplementation((selector: any) => {
      const mockState = {
        notifications: {
          notifications: [],
          unreadCount: 0,
          isConnected: false,
          connectionError: null,
          showNotifications: true,
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

  it('should not render when showNotifications is false', () => {
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

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.queryByText('Notificações')).not.toBeInTheDocument();
  });

  it('should render notification panel when showNotifications is true', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.getByText('Notificações')).toBeInTheDocument();
    expect(screen.getByText('Desconectado')).toBeInTheDocument();
  });

  it('should show connected status when isConnected is true', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isConnected: true,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.getByText('Conectado')).toBeInTheDocument();
  });

  it('should show empty state when no notifications', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.getByText('Nenhuma notificação')).toBeInTheDocument();
    expect(screen.getByText('Você receberá notificações sobre transações e atualizações aqui.')).toBeInTheDocument();
    expect(screen.getByText('📭')).toBeInTheDocument();
  });

  it('should show notifications when they exist', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.getByText('Test Transaction')).toBeInTheDocument();
    expect(screen.getByText('This is a test notification')).toBeInTheDocument();
  });

  it('should show mark all read button when unread count > 0', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.getByText('Marcar todas como lidas')).toBeInTheDocument();
  });

  it('should not show mark all read button when unread count is 0', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.queryByText('Marcar todas como lidas')).not.toBeInTheDocument();
  });

  it('should call markAllNotificationsAsRead when mark all read button is clicked', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    const markAllReadButton = screen.getByText('Marcar todas como lidas');
    fireEvent.click(markAllReadButton);
    
    expect(mockMarkAllNotificationsAsRead).toHaveBeenCalledTimes(1);
  });

  it('should call sendTestNotification when test button is clicked', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    const testButton = screen.getByTitle('Enviar notificação de teste');
    fireEvent.click(testButton);
    
    expect(mockSendTestNotification).toHaveBeenCalledTimes(1);
  });

  it('should call hideNotifications when close button is clicked', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    const closeButton = screen.getByTitle('Fechar painel');
    fireEvent.click(closeButton);
    
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should call hideNotifications when backdrop is clicked', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    const backdrop = screen.getByText('Notificações').closest('.notification-backdrop');
    fireEvent.click(backdrop!);
    
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should not call hideNotifications when panel is clicked', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    const panel = screen.getByText('Notificações').closest('.notification-panel');
    fireEvent.click(panel!);
    
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should call markNotificationAsRead when unread notification is clicked', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    const notificationItem = screen.getByText('Test Transaction').closest('.notification-item');
    fireEvent.click(notificationItem!);
    
    expect(mockMarkNotificationAsRead).toHaveBeenCalledWith('test-1');
  });

  it('should not call markNotificationAsRead when read notification is clicked', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [mockReadNotification],
      unreadCount: 0,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    const notificationItem = screen.getByText('Read Message').closest('.notification-item');
    fireEvent.click(notificationItem!);
    
    expect(mockMarkNotificationAsRead).not.toHaveBeenCalled();
  });

  it('should call removeNotification when remove button is clicked', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    const removeButton = screen.getByTitle('Remover notificação');
    fireEvent.click(removeButton);
    
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should show correct priority icons', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [
        { ...mockNotification, priority: 'urgent' },
        { ...mockNotification, id: 'high-1', priority: 'high' },
        { ...mockNotification, id: 'medium-1', priority: 'medium' },
        { ...mockNotification, id: 'low-1', priority: 'low' },
      ],
      unreadCount: 4,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.getByText('🚨')).toBeInTheDocument(); 
    expect(screen.getByText('❗')).toBeInTheDocument(); 
    expect(screen.getByText('📢')).toBeInTheDocument(); 
    expect(screen.getByText('💡')).toBeInTheDocument(); 
  });

  it('should show correct type icons', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [
        { ...mockNotification, type: 'transaction' },
        { ...mockNotification, id: 'balance-1', type: 'balance_update' },
        { ...mockNotification, id: 'security-1', type: 'security_alert' },
        { ...mockNotification, id: 'system-1', type: 'system_message' },
      ],
      unreadCount: 4,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.getByText('💸')).toBeInTheDocument(); 
    expect(screen.getByText('💰')).toBeInTheDocument(); 
    expect(screen.getByText('🔒')).toBeInTheDocument(); 
    expect(screen.getByText('⚙️')).toBeInTheDocument(); 
  });

  it('should show correct time ago format', () => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    
    mockUseNotifications.mockReturnValue({
      notifications: [
        { ...mockNotification, timestamp: now.toISOString() },
        { ...mockNotification, id: 'min-1', timestamp: oneMinuteAgo.toISOString() },
        { ...mockNotification, id: 'hour-1', timestamp: oneHourAgo.toISOString() },
        { ...mockNotification, id: 'day-1', timestamp: oneDayAgo.toISOString() },
      ],
      unreadCount: 4,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.getByText('Agora')).toBeInTheDocument();
    expect(screen.getByText('1m atrás')).toBeInTheDocument();
    expect(screen.getByText('1h atrás')).toBeInTheDocument();
    expect(screen.getByText('1d atrás')).toBeInTheDocument();
  });

  it('should show unread count summary', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [mockNotification],
      unreadCount: 1,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    expect(screen.getByText('1 notificação não lida')).toBeInTheDocument();
  });

  it('should show plural form for multiple unread notifications', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [mockNotification, { ...mockNotification, id: 'test-2' }],
      unreadCount: 2,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    
    const summaryElement = screen.getByText((content, element) => {
      return !!element && element.classList.contains('notification-summary') && /2/.test(content);
    });
    expect(summaryElement).toBeInTheDocument();
    
    expect(summaryElement.textContent).toContain('notificação');
    expect(summaryElement.textContent).toContain('ões');
    expect(summaryElement.textContent).toContain('não lidas');
  });

  it('should apply correct CSS classes for notification items', () => {
    
    mockUseNotifications.mockReturnValue({
      notifications: [mockNotification, mockReadNotification],
      unreadCount: 1,
      isConnected: false,
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
      sendTestNotification: mockSendTestNotification,
    });

    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationPanel />, { wrapper });
    
    const unreadItem = screen.getByText('Test Transaction').closest('.notification-item');
    const readItem = screen.getByText('Read Message').closest('.notification-item');
    
    expect(unreadItem).toHaveClass('unread', 'priority-medium');
    expect(readItem).toHaveClass('priority-low');
    expect(readItem).not.toHaveClass('unread');
  });
});
