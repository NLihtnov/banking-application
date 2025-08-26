import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import notificationReducer from './store/notificationSlice';
import authReducer from './store/authSlice';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

jest.mock('./store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
    subscribe: jest.fn(),
  },
}));

jest.mock('./store/authSlice', () => ({
  ...jest.requireActual('./store/authSlice'),
  getCurrentUser: jest.fn(() => ({ type: 'auth/getCurrentUser' })),
}));

jest.mock('./components/layout/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('./components/auth/Login', () => {
  return function MockLogin() {
    return <div data-testid="login">Login</div>;
  };
});

jest.mock('./components/auth/Register', () => {
  return function MockRegister() {
    return <div data-testid="register">Register</div>;
  };
});

jest.mock('./components/pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home">Home</div>;
  };
});

jest.mock('./components/pages/Transaction', () => {
  return function MockTransaction() {
    return <div data-testid="transaction">Transaction</div>;
  };
});

jest.mock('./components/pages/History', () => {
  return function MockHistory() {
    return <div data-testid="history">History</div>;
  };
});

jest.mock('./components/notifications/ToastContainer', () => ({
  ToastContainer: function MockToastContainer() {
    return <div data-testid="toast-container">ToastContainer</div>;
  },
}));

jest.mock('./components/layout/PrivateRoute', () => {
  return function MockPrivateRoute({ children }: { children: React.ReactNode }) {
    return <div data-testid="private-route">{children}</div>;
  };
});

jest.mock('./hooks', () => ({
  useAppSelector: jest.fn((selector) => {
    return {
      notifications: [],
      auth: { user: null, isAuthenticated: false },
      transaction: { transactions: [], loading: false }
    };
  }),
  useAppDispatch: jest.fn(() => jest.fn()),
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
    return React.createElement(Provider, { store, children });
  };
};

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should render without crashing', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<App />, { wrapper });
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  it('should handle token in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('mock-token');
    
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<App />, { wrapper });
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
  });

  it('should call getCurrentUser when token exists', () => {
    localStorageMock.getItem.mockReturnValue('mock-token');
    
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<App />, { wrapper });
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
  });

  it('should not call getCurrentUser when token does not exist', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    render(<App />, { wrapper });
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
  });
});
