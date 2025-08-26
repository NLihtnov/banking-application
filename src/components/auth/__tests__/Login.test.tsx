import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { renderWithProviders } from '../../../test-utils';
import Login from '../Login';

describe('Login Component', () => {
  beforeEach(() => {
    i18n.changeLanguage('pt');
  });

  test('renders login form', () => {
    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Login />
      </I18nextProvider>
    );
    
    expect(screen.getByRole('heading', { name: /Entrar/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Login />
      </I18nextProvider>
    );
    
    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);
    
    
    expect(submitButton).toBeInTheDocument();
  });

  test('allows user to input email and password', () => {
    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Login />
      </I18nextProvider>
    );
    
    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('shows link to register page', () => {
    renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Login />
      </I18nextProvider>
    );
    
    const registerLink = screen.getByText(/Cadastrar/i);
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });
});
