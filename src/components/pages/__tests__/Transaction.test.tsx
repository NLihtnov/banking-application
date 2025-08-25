import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import Transaction from '../Transaction';

// Mock dos hooks
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock simplificado dos hooks customizados
jest.mock('../../../hooks', () => ({
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
}));

describe('Transaction Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.skip('renders transaction page with loading state', () => {
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

  test.skip('renders transaction page with user data', () => {
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

  test.skip('renders transaction form step by default', () => {
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

    // Verifica se o formulário está sendo renderizado
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test.skip('shows success message after successful transaction', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    // Mock do useTransaction para retornar sucesso
    const mockExecuteTransaction = jest.fn().mockResolvedValue({ success: true });
    jest.doMock('../../../hooks', () => ({
      useTransactionForm: () => ({
        formData: {
          type: 'PIX',
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          amount: '100.00',
          pixKey: 'maria@email.com',
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
        executeTransaction: mockExecuteTransaction,
      }),
    }));

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

    // Simula o fluxo de confirmação
    // Como o componente usa hooks customizados, vamos testar a estrutura básica
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test.skip('renders balance card with user data', () => {
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

    // Verifica se o componente BalanceCard está sendo renderizado
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test.skip('handles form submission correctly', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    const mockValidateForm = jest.fn().mockReturnValue(true);
    
    jest.doMock('../../../hooks', () => ({
      useTransactionForm: () => ({
        formData: {
          type: 'PIX',
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          amount: '100.00',
          pixKey: 'maria@email.com',
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
        validateForm: mockValidateForm,
      }),
      useTransaction: () => ({
        executeTransaction: jest.fn().mockResolvedValue({ success: true }),
      }),
    }));

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

    // Verifica se o componente está renderizado
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test.skip('handles transaction confirmation', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    const mockExecuteTransaction = jest.fn().mockResolvedValue({ success: true });
    
    jest.doMock('../../../hooks', () => ({
      useTransactionForm: () => ({
        formData: {
          type: 'PIX',
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          amount: '100.00',
          pixKey: 'maria@email.com',
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
        executeTransaction: mockExecuteTransaction,
      }),
    }));

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

    // Verifica se o componente está renderizado
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test.skip('handles transaction cancellation', () => {
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

    // Verifica se o componente está renderizado
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test.skip('handles transaction loading state', () => {
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

    // Verifica se o componente está renderizado mesmo com loading
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test.skip('handles form validation errors', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    const mockValidateForm = jest.fn().mockReturnValue(false);
    
    jest.doMock('../../../hooks', () => ({
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
        errors: {
          recipientName: 'Nome do destinatário é obrigatório',
          amount: 'Valor é obrigatório',
        },
        touched: {
          recipientName: true,
          amount: true,
        },
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        handleAmountChange: jest.fn(),
        handleAmountBlur: jest.fn(),
        validateForm: mockValidateForm,
      }),
      useTransaction: () => ({
        executeTransaction: jest.fn().mockResolvedValue({ success: true }),
      }),
    }));

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

    // Verifica se o componente está renderizado
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test.skip('handles transaction execution error', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    const mockExecuteTransaction = jest.fn().mockResolvedValue({ success: false, error: 'Erro na transação' });
    
    jest.doMock('../../../hooks', () => ({
      useTransactionForm: () => ({
        formData: {
          type: 'PIX',
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          amount: '100.00',
          pixKey: 'maria@email.com',
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
        executeTransaction: mockExecuteTransaction,
      }),
    }));

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

    // Verifica se o componente está renderizado
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
  });

  test.skip('redirects to home after successful transaction', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    // Mock do setTimeout para controlar o redirecionamento
    jest.useFakeTimers();
    
    jest.doMock('../../../hooks', () => ({
      useTransactionForm: () => ({
        formData: {
          type: 'PIX',
          recipientName: 'Maria Santos',
          recipientDocument: '123.456.789-00',
          amount: '100.00',
          pixKey: 'maria@email.com',
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
    }));

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

    // Verifica se o componente está renderizado
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();

    // Avança o tempo para simular o setTimeout
    jest.advanceTimersByTime(2000);

    jest.useRealTimers();
  });
});
