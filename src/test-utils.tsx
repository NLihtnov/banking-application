import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/authSlice';
import notificationReducer from './store/notificationSlice';
import transactionReducer from './store/transactionSlice';
import { setupApiMocks, clearApiMocks, resetApiMocks } from './__mocks__/api';

// Configuração do store de teste
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

// Interface para opções de renderização customizadas
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: any;
  route?: string;
}

// Wrapper customizado para renderizar componentes com providers
const AllTheProviders: React.FC<{ children: React.ReactNode; store: any; route?: string }> = ({ 
  children, 
  store,
  route = '/'
}) => {
  // Mock da função window.history.pushState para simular navegação
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

  // Mock da função window.location
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

// Função customizada de renderização
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

// Re-exportação de tudo do testing-library
export * from '@testing-library/react';

// Exportação da função customizada de renderização
export { customRender as render };

// Função específica para renderizar com providers (mantém compatibilidade)
export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => customRender(ui, options);

// Função para criar um store de teste
export { createTestStore as createTestStore };

// Função para simular navegação
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

// Função para limpar mocks de navegação
export const clearNavigationMocks = () => {
  jest.clearAllMocks();
};

// Configuração automática dos mocks da API para testes
export const setupTestEnvironment = () => {
  // Configura os mocks da API simulada
  setupApiMocks();
  
  // Configura o ambiente de teste
  beforeAll(() => {
    // Setup inicial dos mocks
    setupApiMocks();
  });
  
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    clearApiMocks();
  });
  
  afterEach(() => {
    // Limpa os mocks após cada teste
    clearApiMocks();
  });
  
  afterAll(() => {
    // Reset dos mocks após todos os testes
    resetApiMocks();
  });
};

// Função para configurar dados de teste específicos
export const setupTestData = (customData?: {
  users?: any[];
  transactions?: any[];
}) => {
  if (customData) {
    // Aqui você pode configurar dados customizados para testes específicos
    // Por exemplo, para testar cenários de erro ou dados específicos
  }
};

// Função para simular respostas de erro da API
export const mockApiError = (endpoint: string, error: { status: number; message: string }) => {
  // Implementar mock de erro para endpoints específicos
  // Isso permite testar cenários de erro de forma controlada
};

// Função para simular delay da API (para testar loading states)
export const mockApiDelay = (delay: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Função para verificar se os mocks da API foram chamados
export const verifyApiCalls = (expectedCalls: { endpoint: string; times: number }[]) => {
  // Implementar verificação de chamadas da API
  // Útil para verificar se os componentes estão fazendo as chamadas corretas
};
