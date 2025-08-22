import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import Home from '../Home';

describe('Home Component', () => {
  const mockUser = {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    balance: 5000.00,
  };

  const mockTransactions = [
    {
      id: 1,
      userId: 1,
      type: 'TED' as const,
      amount: 500.00,
      recipientName: 'Carlos Oliveira',
      recipientDocument: '123.456.789-00',
      date: '2024-01-15T10:30:00.000Z',
      balance: 4500.00,
    },
  ];

  test('renders welcome message with user name', () => {
    const initialState = {
      auth: {
        user: mockUser,
        loading: false,
        error: null,
        isAuthenticated: true,
        token: 'mock-token',
      },
      transaction: {
        transactions: mockTransactions,
        loading: false,
        error: null,
        filters: {},
      },
    };

    renderWithProviders(<Home />, initialState);
    
    expect(screen.getByText(/bem-vindo, joão silva!/i)).toBeInTheDocument();
  });

  test('displays user balance', () => {
    const initialState = {
      auth: {
        user: mockUser,
        loading: false,
        error: null,
        isAuthenticated: true,
        token: 'mock-token',
      },
      transaction: {
        transactions: [],
        loading: false,
        error: null,
        filters: {},
      },
    };

    renderWithProviders(<Home />, initialState);
    
    expect(screen.getByText(/r\$ 5\.000,00/i)).toBeInTheDocument();
  });

  test('shows recent transactions', () => {
    const initialState = {
      auth: {
        user: mockUser,
        loading: false,
        error: null,
        isAuthenticated: true,
        token: 'mock-token',
      },
      transaction: {
        transactions: mockTransactions,
        loading: false,
        error: null,
        filters: {},
      },
    };

    renderWithProviders(<Home />, initialState);
    
    expect(screen.getByText('Carlos Oliveira')).toBeInTheDocument();
    expect(screen.getByText('TED')).toBeInTheDocument();
    expect(screen.getByText('- R$ 500,00')).toBeInTheDocument();
  });

  test('shows empty state when no transactions', () => {
    const initialState = {
      auth: {
        user: mockUser,
        loading: false,
        error: null,
        isAuthenticated: true,
        token: 'mock-token',
      },
      transaction: {
        transactions: [],
        loading: false,
        error: null,
        filters: {},
      },
    };

    renderWithProviders(<Home />, initialState);
    
    expect(screen.getByText(/nenhuma transação encontrada/i)).toBeInTheDocument();
  });

  test('shows loading state', () => {
    const initialState = {
      auth: {
        user: null,
        loading: true,
        error: null,
        isAuthenticated: false,
        token: null,
      },
      transaction: {
        transactions: [],
        loading: false,
        error: null,
        filters: {},
      },
    };

    renderWithProviders(<Home />, initialState);
    
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });
});
