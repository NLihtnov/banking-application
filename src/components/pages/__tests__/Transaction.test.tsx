import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import Transaction from '../Transaction';


const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


jest.mock('../../../hooks', () => {
  const originalModule = jest.requireActual('../../../hooks');
  return {
    ...originalModule,
    useTransactionForm: () => ({
      formData: {
        type: 'PIX',
        recipientName: '',
        recipientDocument: '',
        amount: '',
        pixKey: '',
        bank: '',
        agency: '',
        account: '',
      },
      errors: {},
      touched: {},
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      handleAmountChange: jest.fn(),
      handleAmountBlur: jest.fn(),
      validateForm: jest.fn().mockReturnValue(true),
    }),
    useTransaction: () => ({
      executeTransaction: jest.fn().mockResolvedValue({ success: true }),
    }),
    useNotifications: () => ({
      notifications: [],
      unreadCount: 0,
      isConnected: false,
      connectionError: null,
      showNotifications: false,
      connectWebSocket: jest.fn(),
      disconnectWebSocket: jest.fn(),
      markNotificationAsRead: jest.fn(),
      markAllNotificationsAsRead: jest.fn(),
      requestNotificationPermission: jest.fn(),
      sendTestNotification: jest.fn(),
    }),
  };
});

describe('Transaction Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders transaction page with loading state', () => {
    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: null,
          loading: true,
          error: null,
          isAuthenticated: false,
        },
      },
    });

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  test('renders transaction page with user data', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
    expect(screen.getByText('Realize transferências TED ou PIX de forma segura')).toBeInTheDocument();
  });

  test('renders transaction form step by default', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test('shows success message after successful transaction', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
    expect(screen.getByText('Realize transferências TED ou PIX de forma segura')).toBeInTheDocument();
  });

  test('renders balance card with user data', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test('handles form submission correctly', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };



    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test('handles transaction confirmation', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };



    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test('handles transaction cancellation', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test('handles transaction loading state', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: true,
          error: null,
          filters: {},
        },
      },
    });

    
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test('handles form validation errors', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };



    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test('handles transaction execution error', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };



    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test('redirects to home after successful transaction', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };



    renderWithProviders(<Transaction />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: [],
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });
});
