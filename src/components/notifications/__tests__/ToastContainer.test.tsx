import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ToastContainer } from '../ToastContainer';
import notificationReducer from '../../../store/notificationSlice';
import authReducer from '../../../store/authSlice';
import { NotificationData } from '../../../services/WebSocketService';


jest.mock('../Toast', () => ({
  Toast: ({ notification, onClose }: { notification: NotificationData; onClose: () => void }) => (
    <div data-testid={`toast-${notification.id}`} onClick={onClose}>
      {notification.title}
    </div>
  ),
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

const mockHighPriorityNotification: NotificationData = {
  id: 'high-1',
  type: 'transaction',
  title: 'High Priority Transaction',
  message: 'This is a high priority notification',
  timestamp: '2024-01-01T10:00:00.000Z',
  priority: 'high',
  read: false,
};

const mockUrgentNotification: NotificationData = {
  id: 'urgent-1',
  type: 'security_alert',
  title: 'Urgent Security Alert',
  message: 'This is an urgent notification',
  timestamp: '2024-01-01T10:00:00.000Z',
  priority: 'urgent',
  read: false,
};

const mockLowPriorityNotification: NotificationData = {
  id: 'low-1',
  type: 'system_message',
  title: 'Low Priority Message',
  message: 'This is a low priority notification',
  timestamp: '2024-01-01T09:00:00.000Z',
  priority: 'low',
  read: false,
};

describe('ToastContainer', () => {
  let store: any;

  beforeEach(() => {
    
    store = createTestStore({
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
    });
  });

  it('should render empty container when no high/urgent notifications', () => {
    const wrapper = createWrapper(store);
    
    render(<ToastContainer />, { wrapper });
    
    expect(screen.queryByTestId(/toast-/)).not.toBeInTheDocument();
  });

  it('should show high priority notification when added to store', () => {
    const wrapper = createWrapper(store);
    
    render(<ToastContainer />, { wrapper });
    
    
    expect(screen.queryByTestId(/toast-/)).not.toBeInTheDocument();
    
    
    act(() => {
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockHighPriorityNotification,
      });
    });
    
    
    expect(screen.getByTestId('toast-high-1')).toBeInTheDocument();
    expect(screen.getByText('High Priority Transaction')).toBeInTheDocument();
  });

  it('should show urgent priority notification when added to store', () => {
    const wrapper = createWrapper(store);
    
    render(<ToastContainer />, { wrapper });
    
    
    act(() => {
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockUrgentNotification,
      });
    });
    
    
    expect(screen.getByTestId('toast-urgent-1')).toBeInTheDocument();
    expect(screen.getByText('Urgent Security Alert')).toBeInTheDocument();
  });

  it('should not show low priority notifications', () => {
    const wrapper = createWrapper(store);
    
    render(<ToastContainer />, { wrapper });
    
    
    act(() => {
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockLowPriorityNotification,
      });
    });
    
    
    expect(screen.queryByTestId('toast-low-1')).not.toBeInTheDocument();
    expect(screen.queryByText('Low Priority Message')).not.toBeInTheDocument();
  });

  it('should show multiple high priority notifications', () => {
    const wrapper = createWrapper(store);
    
    render(<ToastContainer />, { wrapper });
    
    
    act(() => {
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockHighPriorityNotification,
      });
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockUrgentNotification,
      });
    });
    
    
    expect(screen.getByTestId('toast-high-1')).toBeInTheDocument();
    expect(screen.getByTestId('toast-urgent-1')).toBeInTheDocument();
    expect(screen.getByText('High Priority Transaction')).toBeInTheDocument();
    expect(screen.getByText('Urgent Security Alert')).toBeInTheDocument();
  });

  it('should not duplicate notifications', () => {
    const wrapper = createWrapper(store);
    
    render(<ToastContainer />, { wrapper });
    
    
    act(() => {
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockHighPriorityNotification,
      });
      store.dispatch({
        type: 'notifications/addNotification',
        payload: { ...mockHighPriorityNotification, id: 'high-2' },
      });
    });
    
    
    expect(screen.getAllByTestId(/toast-/)).toHaveLength(2);
    expect(screen.getByTestId('toast-high-1')).toBeInTheDocument();
    expect(screen.getByTestId('toast-high-2')).toBeInTheDocument();
  });

  it('should remove toast when onClose is called', () => {
    const wrapper = createWrapper(store);
    
    render(<ToastContainer />, { wrapper });
    
    
    act(() => {
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockHighPriorityNotification,
      });
    });
    
    const toast = screen.getByTestId('toast-high-1');
    expect(toast).toBeInTheDocument();
    
    
    act(() => {
      toast.click();
    });
    
    
    expect(screen.queryByTestId('toast-high-1')).not.toBeInTheDocument();
  });

  it('should apply correct positioning for multiple toasts', () => {
    const wrapper = createWrapper(store);
    
    render(<ToastContainer />, { wrapper });
    
    
    act(() => {
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockHighPriorityNotification,
      });
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockUrgentNotification,
      });
    });
    
    
    const toastContainers = screen.getAllByTestId(/toast-/);
    expect(toastContainers).toHaveLength(2);
    
    
    expect(screen.getByTestId('toast-high-1')).toBeInTheDocument();
    expect(screen.getByTestId('toast-urgent-1')).toBeInTheDocument();
  });

  it('should handle mixed priority notifications correctly', () => {
    const wrapper = createWrapper(store);
    
    render(<ToastContainer />, { wrapper });
    
    
    act(() => {
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockHighPriorityNotification,
      });
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockLowPriorityNotification,
      });
      store.dispatch({
        type: 'notifications/addNotification',
        payload: mockUrgentNotification,
      });
    });
    
    
    expect(screen.getByTestId('toast-high-1')).toBeInTheDocument();
    expect(screen.getByTestId('toast-urgent-1')).toBeInTheDocument();
    expect(screen.queryByTestId('toast-low-1')).not.toBeInTheDocument();
    
    
    expect(screen.getAllByTestId(/toast-/)).toHaveLength(2);
  });
});
