import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NotificationBell } from '../NotificationBell';
import notificationReducer from '../../../store/notificationSlice';
import authReducer from '../../../store/authSlice';


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

describe('NotificationBell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    
    mockSelector.mockImplementation((selector: any) => {
      const mockState = {
        notifications: {
          notifications: [],
          unreadCount: 0,
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
  });

  it('should render notification bell with connected state', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationBell />, { wrapper });
    
    expect(screen.getByText('🔔')).toBeInTheDocument();
    expect(screen.getByText('🔔')).toHaveClass('bell-icon');
    expect(screen.getByText('🔔')).not.toHaveClass('disconnected');
  });

  it('should render notification bell with disconnected state', () => {
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
    
    render(<NotificationBell />, { wrapper });
    
    expect(screen.getByText('🔔')).toHaveClass('disconnected');
  });

  it('should show notification badge when unread count > 0', () => {
    mockSelector.mockImplementation((selector: any) => {
      const mockState = {
        notifications: {
          notifications: [],
          unreadCount: 5,
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
    
    render(<NotificationBell />, { wrapper });
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('5')).toHaveClass('notification-badge');
  });

  it('should show 99+ when unread count > 99', () => {
    mockSelector.mockImplementation((selector: any) => {
      const mockState = {
        notifications: {
          notifications: [],
          unreadCount: 150,
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
    
    render(<NotificationBell />, { wrapper });
    
    expect(screen.getByText('99+')).toBeInTheDocument();
    expect(screen.getByText('99+')).toHaveClass('notification-badge');
  });

  it('should not show notification badge when unread count is 0', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationBell />, { wrapper });
    
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.queryByText('99+')).not.toBeInTheDocument();
  });

  it('should dispatch toggleNotifications when clicked', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationBell />, { wrapper });
    
    const bellElement = screen.getByText('🔔').closest('.notification-bell');
    fireEvent.click(bellElement!);
    
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should have correct CSS classes', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<NotificationBell />, { wrapper });
    
    const bellContainer = screen.getByText('🔔').closest('.notification-bell');
    expect(bellContainer).toHaveClass('notification-bell');
    
    const bellIcon = screen.getByText('🔔');
    expect(bellIcon).toHaveClass('bell-icon');
  });
});

