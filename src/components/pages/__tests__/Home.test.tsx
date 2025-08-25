import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { renderWithProviders } from '../../../test-utils';
import Home from '../Home';
import { getCurrentUser } from '../../../store/authSlice';
import { fetchTransactions } from '../../../store/transactionSlice';

// Mock dos hooks
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    i18n.changeLanguage('pt');
  });

  test('renders home page with loading state', () => {
    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>,
      {
        preloadedState: {
          auth: {
            user: null,
            loading: true,
            error: null,
            isAuthenticated: false,
          },
        },
      }
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  test('renders home page with user data', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    const mockTransactions = [
      {
        id: 1,
        type: 'PIX',
        amount: 100.00,
        recipientName: 'Maria Santos',
        recipientDocument: '123.456.789-00',
        date: '2024-01-15T10:30:00Z',
        balance: 4900.00,
      },
      {
        id: 2,
        type: 'TED',
        amount: 250.00,
        recipientName: 'Pedro Costa',
        recipientDocument: '987.654.321-00',
        date: '2024-01-14T14:20:00Z',
        balance: 5150.00,
      },
    ];

    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>,
      {
        preloadedState: {
          auth: {
            user: mockUser,
            loading: false,
            error: null,
            isAuthenticated: true,
          },
          transaction: {
            transactions: mockTransactions,
            loading: false,
            error: null,
            filters: {},
          },
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Bem-vindo, João Silva!')).toBeInTheDocument();
      expect(screen.getByText('Gerencie suas finanças de forma simples e segura')).toBeInTheDocument();
    });

    expect(screen.getByText('Saldo Atual')).toBeInTheDocument();
    expect(screen.getByText('R$ 5.000,00')).toBeInTheDocument();
    expect(screen.getByText('Conta Corrente')).toBeInTheDocument();
    expect(screen.getByText('Ações Rápidas')).toBeInTheDocument();
    expect(screen.getByText('Nova Transação')).toBeInTheDocument();
    expect(screen.getByText('Ver Histórico')).toBeInTheDocument();
    expect(screen.getByText('Últimas Transações')).toBeInTheDocument();
    expect(screen.getByText('2 transações no total')).toBeInTheDocument();
  });

  test('renders home page without user data', async () => {
    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>,
      {
        preloadedState: {
          auth: {
            user: null,
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
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Bem-vindo, !')).toBeInTheDocument();
      expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
    });
  });

  test('renders home page with transaction loading state', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>,
      {
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
      }
    );

    expect(screen.getByText('Carregando transações...')).toBeInTheDocument();
  });

  test('renders home page with empty transactions', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>,
      {
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
      }
    );

    await waitFor(() => {
      expect(screen.getByText('0 transações no total')).toBeInTheDocument();
      expect(screen.getByText('Nenhuma transação encontrada')).toBeInTheDocument();
      expect(screen.getByText('Suas transações aparecerão aqui')).toBeInTheDocument();
    });
  });

  test('displays recent transactions correctly', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    const mockTransactions = [
      {
        id: 1,
        type: 'PIX',
        amount: 100.00,
        recipientName: 'Maria Santos',
        recipientDocument: '123.456.789-00',
        date: '2024-01-15T10:30:00Z',
        balance: 4900.00,
      },
      {
        id: 2,
        type: 'TED',
        amount: 250.00,
        recipientName: 'Pedro Costa',
        recipientDocument: '987.654.321-00',
        date: '2024-01-14T14:20:00Z',
        balance: 5150.00,
      },
      {
        id: 3,
        type: 'PIX',
        amount: 75.50,
        recipientName: 'Ana Oliveira',
        recipientDocument: '111.222.333-44',
        date: '2024-01-13T09:15:00Z',
        balance: 5225.50,
      },
      {
        id: 4,
        type: 'TED',
        amount: 300.00,
        recipientName: 'Carlos Lima',
        recipientDocument: '555.666.777-88',
        date: '2024-01-12T16:45:00Z',
        balance: 5525.50,
      },
      {
        id: 5,
        type: 'PIX',
        amount: 50.00,
        recipientName: 'Lucia Ferreira',
        recipientDocument: '999.888.777-66',
        date: '2024-01-11T11:20:00Z',
        balance: 5575.50,
      },
      {
        id: 6,
        type: 'TED',
        amount: 200.00,
        recipientName: 'Roberto Alves',
        recipientDocument: '333.444.555-66',
        date: '2024-01-10T13:30:00Z',
        balance: 5775.50,
      },
    ];

    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>,
      {
        preloadedState: {
          auth: {
            user: mockUser,
            loading: false,
            error: null,
            isAuthenticated: true,
          },
          transaction: {
            transactions: mockTransactions,
            loading: false,
            error: null,
            filters: {},
          },
        },
      }
    );

    // Verifica se apenas as 5 primeiras transações são exibidas
    await waitFor(() => {
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
      expect(screen.getByText('Ana Oliveira')).toBeInTheDocument();
      expect(screen.getByText('Carlos Lima')).toBeInTheDocument();
      expect(screen.getByText('Lucia Ferreira')).toBeInTheDocument();
    });
    
    // A sexta transação não deve aparecer (limite de 5)
    expect(screen.queryByText('Roberto Alves')).not.toBeInTheDocument();
  });

  test('navigates to transaction page when clicking Nova Transação', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>,
      {
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
      }
    );

    const novaTransacaoButton = screen.getByText('Nova Transação');
    fireEvent.click(novaTransacaoButton);

    expect(mockNavigate).toHaveBeenCalledWith('/transaction');
  });

  test('navigates to history page when clicking Ver Histórico', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>,
      {
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
      }
    );

    const verHistoricoButton = screen.getByText('Ver Histórico');
    fireEvent.click(verHistoricoButton);

    expect(mockNavigate).toHaveBeenCalledWith('/history');
  });

  test.skip('displays transaction types with correct styling', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    const mockTransactions = [
      {
        id: 1,
        type: 'PIX',
        amount: 100.00,
        recipientName: 'Maria Santos',
        recipientDocument: '123.456.789-00',
        date: '2024-01-15T10:30:00Z',
        balance: 4900.00,
      },
      {
        id: 2,
        type: 'TED',
        amount: 250.00,
        recipientName: 'Pedro Costa',
        recipientDocument: '987.654.321-00',
        date: '2024-01-14T14:20:00Z',
        balance: 5150.00,
      },
    ];

    renderWithProviders(<Home />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: mockTransactions,
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    const pixBadge = screen.getByText('PIX');
    const tedBadge = screen.getByText('TED');

    expect(pixBadge).toBeInTheDocument();
    expect(tedBadge).toBeInTheDocument();
    expect(pixBadge).toHaveClass('home-type-badge', 'pix');
    expect(tedBadge).toHaveClass('home-type-badge', 'ted');
  });

  test.skip('displays transaction amounts correctly', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    const mockTransactions = [
      {
        id: 1,
        type: 'PIX',
        amount: 100.00,
        recipientName: 'Maria Santos',
        recipientDocument: '123.456.789-00',
        date: '2024-01-15T10:30:00Z',
        balance: 4900.00,
      },
    ];

    renderWithProviders(<Home />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: mockTransactions,
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    expect(screen.getByText('- R$ 100,00')).toBeInTheDocument();
  });

  test.skip('displays formatted dates correctly', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    const mockTransactions = [
      {
        id: 1,
        type: 'PIX',
        amount: 100.00,
        recipientName: 'Maria Santos',
        recipientDocument: '123.456.789-00',
        date: '2024-01-15T10:30:00Z',
        balance: 4900.00,
      },
    ];

    renderWithProviders(<Home />, {
      preloadedState: {
        auth: {
          user: mockUser,
          loading: false,
          error: null,
          isAuthenticated: true,
        },
        transaction: {
          transactions: mockTransactions,
          loading: false,
          error: null,
          filters: {},
        },
      },
    });

    // Verifica se a data formatada está presente
    expect(screen.getByText('15/01/2024, 10:30')).toBeInTheDocument();
  });
});
