import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import PrivateRoute from '../PrivateRoute';


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to}>Navigate to {to}</div>,
}));

describe('PrivateRoute Component', () => {
  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

  const renderPrivateRoute = (preloadedState = {}) => {
    return renderWithProviders(
      <PrivateRoute>
        <TestComponent />
      </PrivateRoute>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          },
          ...preloadedState,
        },
      }
    );
  };

  test('renders protected content when user is authenticated', () => {
    renderPrivateRoute({
      auth: {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'mock-token',
        loading: false,
        error: null,
        isAuthenticated: true,
      },
    });

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    renderPrivateRoute({
      auth: {
        user: null,
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      },
    });

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  test('shows loading state when authentication is loading', () => {
    renderPrivateRoute({
      auth: {
        user: null,
        token: null,
        loading: true,
        error: null,
        isAuthenticated: false,
      },
    });

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  test('loading state has correct styling', () => {
    renderPrivateRoute({
      auth: {
        user: null,
        token: null,
        loading: true,
        error: null,
        isAuthenticated: false,
      },
    });

    const loadingElement = screen.getByText('Carregando...');
    expect(loadingElement).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#666',
    });
  });

  test('renders children when authenticated even with error state', () => {
    renderPrivateRoute({
      auth: {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'mock-token',
        loading: false,
        error: 'Some error occurred',
        isAuthenticated: true,
      },
    });

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  test('redirects when user is null but isAuthenticated is false', () => {
    renderPrivateRoute({
      auth: {
        user: null,
        token: 'mock-token',
        loading: false,
        error: null,
        isAuthenticated: false,
      },
    });

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  test('renders children when user exists and isAuthenticated is true', () => {
    renderPrivateRoute({
      auth: {
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: null,
        loading: false,
        error: null,
        isAuthenticated: true,
      },
    });

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});
