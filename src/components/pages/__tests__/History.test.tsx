import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import History from '../History';

describe('History Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders history page with loading state', () => {
    renderWithProviders(<History />, {
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

  test('renders history page with user data', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    expect(screen.getByText('Histórico de Transações')).toBeInTheDocument();
    expect(screen.getByText('Visualize e filtre todas as suas transações')).toBeInTheDocument();
    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByText('Transações')).toBeInTheDocument();
  });

  test('renders history page with transactions', async () => {
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
        pixKey: 'maria@email.com',
      },
      {
        id: 2,
        type: 'TED',
        amount: 250.00,
        recipientName: 'Pedro Costa',
        recipientDocument: '987.654.321-00',
        date: '2024-01-14T14:20:00Z',
        balance: 5150.00,
        bank: 'Banco do Brasil',
        agency: '1234',
        account: '12345-6',
      },
    ];

    renderWithProviders(<History />, {
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

    await waitFor(() => {
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
      expect(screen.getByText('- R$ 100,00')).toBeInTheDocument();
      expect(screen.getByText('- R$ 250,00')).toBeInTheDocument();
    });
  });

  test('renders history page with empty transactions', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    await waitFor(() => {
      expect(screen.getByText('Nenhuma transação encontrada')).toBeInTheDocument();
      expect(screen.getByText('Tente ajustar os filtros ou realize uma nova transação')).toBeInTheDocument();
    });
  });

  test('renders history page with transaction loading state', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    expect(screen.getByText('Carregando transações...')).toBeInTheDocument();
  });

  test('displays filter controls correctly', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    expect(screen.getByLabelText('Tipo de Transação')).toBeInTheDocument();
    expect(screen.getByLabelText('Período')).toBeInTheDocument();
    expect(screen.getByLabelText('Data Inicial')).toBeInTheDocument();
    expect(screen.getByLabelText('Data Final')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor Mínimo')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor Máximo')).toBeInTheDocument();
    expect(screen.getByText('Aplicar Filtros')).toBeInTheDocument();
    expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
  });

  test('handles filter type change', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    const typeSelect = screen.getByLabelText('Tipo de Transação');
    fireEvent.change(typeSelect, { target: { value: 'PIX' } });

    expect(typeSelect).toHaveValue('PIX');
  });

  test('handles period filter change', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    const periodSelect = screen.getByLabelText('Período');
    fireEvent.change(periodSelect, { target: { value: '7' } });

    expect(periodSelect).toHaveValue('7');
  });

  test('handles date filter changes', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    const startDateInput = screen.getByLabelText('Data Inicial');
    const endDateInput = screen.getByLabelText('Data Final');

    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });

    expect(startDateInput).toHaveValue('2024-01-01');
    expect(endDateInput).toHaveValue('2024-01-31');
  });

  test('handles amount filter changes', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    const minAmountInput = screen.getByLabelText('Valor Mínimo');
    const maxAmountInput = screen.getByLabelText('Valor Máximo');

    fireEvent.change(minAmountInput, { target: { value: '100' } });
    fireEvent.change(maxAmountInput, { target: { value: '1000' } });

    // Agora os inputs mostram valores formatados como moeda
    expect(minAmountInput.value).toMatch(/R\$\s*1,00/);
    expect(maxAmountInput.value).toMatch(/R\$\s*10,00/);
  });

  test('handles apply filters button click', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    const applyFiltersButton = screen.getByText('Aplicar Filtros');
    fireEvent.click(applyFiltersButton);

    
    expect(applyFiltersButton).toBeInTheDocument();
  });

  test('handles clear filters button click', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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
          filters: { type: 'PIX', period: 7 }, // Filtros aplicados
        },
      },
    });

    const clearFiltersButton = screen.getByText('Limpar Filtros');
    fireEvent.click(clearFiltersButton);

    // Verifica se o botão existe e funciona sem erro
    expect(clearFiltersButton).toBeInTheDocument();
  });

  test('displays sort controls correctly', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    expect(screen.getByText('Ordenar por:')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Valor')).toBeInTheDocument();
  });

  test('handles sort by date', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    const dateSortButton = screen.getByText('Data');
    fireEvent.click(dateSortButton);

    
    expect(dateSortButton).toBeInTheDocument();
  });

  test('handles sort by amount', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    const amountSortButton = screen.getByText('Valor');
    fireEvent.click(amountSortButton);

    
    expect(amountSortButton).toBeInTheDocument();
  });

  test('displays transaction details correctly for PIX', async () => {
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
        pixKey: 'maria@email.com',
      },
    ];

    renderWithProviders(<History />, {
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

    await waitFor(() => {
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
      expect(screen.getByText('Chave PIX: maria@email.com')).toBeInTheDocument();
      expect(screen.getByText('- R$ 100,00')).toBeInTheDocument();
      expect(screen.getByText('Saldo: R$ 4.900,00')).toBeInTheDocument();
    });
  });

  test('displays transaction details correctly for TED', async () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    const mockTransactions = [
      {
        id: 1,
        type: 'TED',
        amount: 250.00,
        recipientName: 'Pedro Costa',
        recipientDocument: '987.654.321-00',
        date: '2024-01-14T14:20:00Z',
        balance: 5150.00,
        bank: 'Banco do Brasil',
        agency: '1234',
        account: '12345-6',
      },
    ];

    renderWithProviders(<History />, {
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

    await waitFor(() => {
      expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
      expect(screen.getByText('987.654.321-00')).toBeInTheDocument();
      expect(screen.getByText('Banco do Brasil - Ag: 1234 - CC: 12345-6')).toBeInTheDocument();
      expect(screen.getByText('- R$ 250,00')).toBeInTheDocument();
      expect(screen.getByText('Saldo: R$ 5.150,00')).toBeInTheDocument();
    });
  });

  test('displays transaction types with correct styling', async () => {
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
        pixKey: 'maria@email.com',
      },
      {
        id: 2,
        type: 'TED',
        amount: 250.00,
        recipientName: 'Pedro Costa',
        recipientDocument: '987.654.321-00',
        date: '2024-01-14T14:20:00Z',
        balance: 5150.00,
        bank: 'Banco do Brasil',
        agency: '1234',
        account: '12345-6',
      },
    ];

    renderWithProviders(<History />, {
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

    await waitFor(() => {
      
      const pixBadges = screen.getAllByText('PIX');
      const tedBadges = screen.getAllByText('TED');

      
      const pixBadge = pixBadges.find(badge => badge.classList.contains('history-type-badge'));
      const tedBadge = tedBadges.find(badge => badge.classList.contains('history-type-badge'));

      expect(pixBadge).toBeInTheDocument();
      expect(tedBadge).toBeInTheDocument();
      expect(pixBadge).toHaveClass('history-type-badge', 'pix');
      expect(tedBadge).toHaveClass('history-type-badge', 'ted');
    });
  });



  test('displays transaction amounts correctly', async () => {
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
        pixKey: 'maria@email.com',
      },
    ];

    renderWithProviders(<History />, {
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

    await waitFor(() => {
      expect(screen.getByText('- R$ 100,00')).toBeInTheDocument();
    });
  });

  test('validates date inputs correctly', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    // Mock do alert para capturar as mensagens
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithProviders(<History />, {
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

    const startDateInput = screen.getByLabelText('Data Inicial');
    const endDateInput = screen.getByLabelText('Data Final');

    // Verificar se os inputs têm as validações de data máxima
    expect(startDateInput).toHaveAttribute('max');
    expect(endDateInput).toHaveAttribute('max');
    expect(startDateInput).toHaveAttribute('min');
    expect(endDateInput).toHaveAttribute('min');

    mockAlert.mockRestore();
  });

  test('validates amount inputs correctly', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    // Mock do alert para capturar as mensagens
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithProviders(<History />, {
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

    const minAmountInput = screen.getByLabelText('Valor Mínimo');
    const maxAmountInput = screen.getByLabelText('Valor Máximo');

    // Verificar se os inputs são do tipo text (para máscara de moeda)
    expect(minAmountInput).toHaveAttribute('type', 'text');
    expect(maxAmountInput).toHaveAttribute('type', 'text');
    expect(minAmountInput).toHaveAttribute('placeholder', 'R$ 0,00');
    expect(maxAmountInput).toHaveAttribute('placeholder', 'R$ 0,00');

    mockAlert.mockRestore();
  });

  test('prevents negative values in amount inputs', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    // Mock do alert para capturar as mensagens
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithProviders(<History />, {
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

    const minAmountInput = screen.getByLabelText('Valor Mínimo');
    const maxAmountInput = screen.getByLabelText('Valor Máximo');

    // Simular tentativa de inserir valor negativo (agora com máscara)
    fireEvent.change(minAmountInput, { target: { value: '-100' } });
    
    // Com a máscara, valores negativos são automaticamente removidos
    // O input deve mostrar apenas os números válidos
    expect(minAmountInput.value).toMatch(/R\$\s*1,00/);

    // Limpar o mock e testar o valor máximo
    mockAlert.mockClear();
    
    fireEvent.change(maxAmountInput, { target: { value: '-50' } });
    
    // Com a máscara, valores negativos são automaticamente removidos
    expect(maxAmountInput.value).toMatch(/R\$\s*0,50/);

    mockAlert.mockRestore();
  });

  test('applies currency mask correctly', () => {
    const mockUser = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      balance: 5000.00,
    };

    renderWithProviders(<History />, {
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

    const minAmountInput = screen.getByLabelText('Valor Mínimo');
    const maxAmountInput = screen.getByLabelText('Valor Máximo');

    // Testar entrada de valores diferentes
    fireEvent.change(minAmountInput, { target: { value: '1' } });
    expect(minAmountInput.value).toMatch(/R\$\s*0,01/);

    fireEvent.change(minAmountInput, { target: { value: '100' } });
    expect(minAmountInput.value).toMatch(/R\$\s*1,00/);

    fireEvent.change(minAmountInput, { target: { value: '1234' } });
    expect(minAmountInput.value).toMatch(/R\$\s*12,34/);

    fireEvent.change(maxAmountInput, { target: { value: '5000' } });
    expect(maxAmountInput.value).toMatch(/R\$\s*50,00/);

    // Testar entrada de valores com centavos
    fireEvent.change(maxAmountInput, { target: { value: '123456' } });
    expect(maxAmountInput.value).toMatch(/R\$\s*1\.234,56/);
  });
});
