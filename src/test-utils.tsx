import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/authSlice';
import notificationReducer from './store/notificationSlice';
import transactionReducer from './store/transactionSlice';
import { setupApiMocks, clearApiMocks, resetApiMocks } from './__mocks__/api';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      notification: notificationReducer,
      transaction: transactionReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      },
      transaction: {
        transactions: [],
        loading: false,
        error: null,
        filters: {},
      },
      notification: {
        notifications: [],
        unreadCount: 0,
        isConnected: false,
        connectionError: null,
        showNotifications: false,
      },
      ...preloadedState,
    },
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: any;
  route?: string;
}

const AllTheProviders: React.FC<{ children: React.ReactNode; store: any; route?: string }> = ({ 
  children, 
  store,
  route = '/'
}) => {
  const mockPushState = jest.fn();
  Object.defineProperty(window, 'history', {
    value: {
      pushState: mockPushState,
      replaceState: jest.fn(),
      go: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    },
    writable: true,
  });

  Object.defineProperty(window, 'location', {
    value: {
      pathname: route,
      href: `http://localhost${route}`,
      search: '',
      hash: '',
    },
    writable: true,
  });

  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    preloadedState = {},
    store = createTestStore(preloadedState),
    route = '/',
    ...renderOptions
  } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AllTheProviders store={store} route={route}>
      {children}
    </AllTheProviders>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

export * from '@testing-library/react';

export { customRender as render };

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => customRender(ui, options);

export { createTestStore as createTestStore };

export const mockNavigate = (route: string) => {
  Object.defineProperty(window, 'location', {
    value: {
      pathname: route,
      href: `http://localhost${route}`,
      search: '',
      hash: '',
    },
    writable: true,
  });
};

export const clearNavigationMocks = () => {
  jest.clearAllMocks();
};

export const setupTestEnvironment = () => {
  setupApiMocks();
  
  beforeAll(() => {
          setupApiMocks();
  });
  
      beforeEach(() => {
      clearApiMocks();
    });
  
      afterEach(() => {
      clearApiMocks();
    });
  
      afterAll(() => {
      resetApiMocks();
    });
};

export const setupTestData = (customData?: {
  users?: any[];
  transactions?: any[];
}) => {
  if (customData) {
  }
};

export const mockApiError = (endpoint: string, error: { status: number; message: string }) => {
};

export const mockApiDelay = (delay: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const verifyApiCalls = (expectedCalls: { endpoint: string; times: number }[]) => {
};
