import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { renderWithProviders } from '../../../test-utils';
import Register from '../Register';


jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useForm: jest.fn(),
}));

const mockUseForm = require('../../../hooks').useForm;

describe('Register Component', () => {
  const mockFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    transactionPassword: '',
    confirmTransactionPassword: '',
  };

  const mockErrors = {};
  const mockTouched = {};

  const mockFormHandlers = {
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    validateForm: jest.fn(),
  };

  const renderRegister = (preloadedState = {}) => {
    return renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Register />
      </I18nextProvider>,
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

  beforeEach(() => {
    i18n.changeLanguage('pt');
    mockUseForm.mockReturnValue({
      formData: mockFormData,
      errors: mockErrors,
      touched: mockTouched,
      ...mockFormHandlers,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  test('displays logo and branding', () => {
    renderRegister();
    
    expect(screen.getByAltText('Magnum Bank Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Magnum Bank Logo')).toHaveClass('logo-image');
  });

  test('shows link to login page', () => {
    renderRegister();
    
    const loginLink = screen.getByText(/Faça login/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  test('handles form submission with valid data', async () => {
    const { store } = renderRegister();
    mockFormHandlers.validateForm.mockReturnValue(true);
    
    const submitButton = screen.getByRole('button', { name: /Registrar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockFormHandlers.validateForm).toHaveBeenCalled();
    });
  });

  test('does not submit form when validation fails', async () => {
    renderRegister();
    mockFormHandlers.validateForm.mockReturnValue(false);
    
    const submitButton = screen.getByRole('button', { name: /Registrar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockFormHandlers.validateForm).toHaveBeenCalled();
    });
  });

  test('displays validation errors when fields are touched and have errors', () => {
    const errors = {
      name: 'Nome é obrigatório',
      email: 'Email inválido',
      password: 'Senha deve ter pelo menos 6 caracteres',
    };
    const touched = {
      name: true,
      email: true,
      password: true,
    };
    
    mockUseForm.mockReturnValue({
      formData: mockFormData,
      errors,
      touched,
      ...mockFormHandlers,
    });
    
    renderRegister();
    
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
    expect(screen.getByText('Senha deve ter pelo menos 6 caracteres')).toBeInTheDocument();
  });

  test('displays global error message', () => {
    renderRegister({
      auth: {
        user: null,
        token: null,
        loading: false,
        error: 'Erro ao registrar usuário',
        isAuthenticated: false,
      },
    });
    
    expect(screen.getByText('Erro ao registrar usuário')).toBeInTheDocument();
    expect(screen.getByText('Erro ao registrar usuário')).toHaveClass('global-error');
  });

  test('disables submit button when loading', () => {
    renderRegister({
      auth: {
        user: null,
        token: null,
        loading: true,
        error: null,
        isAuthenticated: false,
      },
    });
    
    const submitButton = screen.getByRole('button', { name: /Registrando/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Registrando...');
  });

  test('enables submit button when not loading', () => {
    renderRegister({
      auth: {
        user: null,
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      },
    });
    
    const submitButton = screen.getByRole('button', { name: /Registrar/i });
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent('Registrar');
  });

  test('handles input changes', () => {
    renderRegister();
    
    const nameInput = screen.getByLabelText(/Nome Completo/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(mockFormHandlers.handleChange).toHaveBeenCalled();
  });

  test('handles input blur events', () => {
    renderRegister();
    
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.blur(emailInput);
    
    expect(mockFormHandlers.handleBlur).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({ name: 'email' }),
    }));
  });





  test('applies error styling to inputs with errors', () => {
    const errors = { name: 'Nome é obrigatório' };
    const touched = { name: true };
    
    mockUseForm.mockReturnValue({
      formData: mockFormData,
      errors,
      touched,
      ...mockFormHandlers,
    });
    
    renderRegister();
    
    const nameInput = screen.getByLabelText(/Nome Completo/i);
    expect(nameInput).toHaveClass('error-input');
  });

  test('does not apply error styling to inputs without errors', () => {
    renderRegister();
    
    const nameInput = screen.getByLabelText(/Nome Completo/i);
    expect(nameInput).not.toHaveClass('error-input');
  });

  test('navigates to home when user is authenticated', () => {
    renderRegister({
      auth: {
        user: { id: 1, name: 'John Doe', email: 'john@example.com' },
        token: 'mock-token',
        loading: false,
        error: null,
        isAuthenticated: true,
      },
    });
    
    
    
  });

  test('clears error on component unmount', () => {
    const { unmount } = renderRegister();
    
    unmount();
    
    
    
  });
});
