import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { renderWithProviders } from '../../../test-utils';
import { TransactionConfirmation } from '../TransactionConfirmation';
import { CreateTransactionData } from '../../../domain/entities/types';

describe('TransactionConfirmation Component', () => {
  const defaultTransactionData: CreateTransactionData = {
    type: 'PIX',
    amount: 100.50,
    recipientName: 'John Doe',
    recipientDocument: '123.456.789-00',
    pixKey: 'john@example.com',
    transactionPassword: '123456',
  };

  const defaultProps = {
    transactionData: defaultTransactionData,
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    loading: false,
  };

  const renderTransactionConfirmation = (props = {}) => {
    return renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <TransactionConfirmation {...defaultProps} {...props} />
      </I18nextProvider>
    );
  };

  beforeEach(() => {
    i18n.changeLanguage('pt');
  });



  test('displays PIX transaction details correctly', () => {
    renderTransactionConfirmation();
    
    expect(screen.getByText(/⚡ PIX/)).toBeInTheDocument();
    expect(screen.getByText(/100,50/)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('displays TED transaction details correctly', () => {
    const tedTransactionData: CreateTransactionData = {
      type: 'TED',
      amount: 500.75,
      recipientName: 'Jane Smith',
      recipientDocument: '987.654.321-00',
      bank: 'Test Bank',
      agency: '1234',
      account: '56789-0',
      transactionPassword: '123456',
    };
    
    renderTransactionConfirmation({ transactionData: tedTransactionData });
    
    expect(screen.getByText(/🏦 TED/)).toBeInTheDocument();
    expect(screen.getByText(/500,75/)).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('987.654.321-00')).toBeInTheDocument();
    expect(screen.getByText('Test Bank')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('56789-0')).toBeInTheDocument();
  });

  test('shows security notice', () => {
    renderTransactionConfirmation();
    
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('Transação Segura')).toBeInTheDocument();
    expect(screen.getByText(/Sua transação será processada com segurança/)).toBeInTheDocument();
  });

  test('handles confirm button click', () => {
    const onConfirm = jest.fn();
    renderTransactionConfirmation({ onConfirm });
    
    const confirmButton = screen.getByRole('button', { name: /Confirmar Transação/i });
    fireEvent.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('handles cancel button click', () => {
    const onCancel = jest.fn();
    renderTransactionConfirmation({ onCancel });
    
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('disables buttons when loading', () => {
    renderTransactionConfirmation({ loading: true });
    
    const confirmButton = screen.getByRole('button', { name: /Processando/i });
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    
    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  test('shows loading state in confirm button', () => {
    renderTransactionConfirmation({ loading: true });
    
    const confirmButton = screen.getByRole('button', { name: /Processando/i });
    expect(confirmButton).toHaveTextContent('Processando...');
    
    
    const loadingSpinner = confirmButton.querySelector('.loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
  });

  test('enables buttons when not loading', () => {
    renderTransactionConfirmation({ loading: false });
    
    const confirmButton = screen.getByRole('button', { name: /Confirmar Transação/i });
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    
    expect(confirmButton).not.toBeDisabled();
    expect(cancelButton).not.toBeDisabled();
  });

  test('displays correct transaction type icon', () => {
    
    renderTransactionConfirmation();
    expect(screen.getByText('⚡')).toBeInTheDocument();
    
    
    const tedTransactionData: CreateTransactionData = {
      ...defaultTransactionData,
      type: 'TED',
    };
    renderTransactionConfirmation({ transactionData: tedTransactionData });
    expect(screen.getByText('🏦')).toBeInTheDocument();
  });



  test('displays zero amount correctly', () => {
    renderTransactionConfirmation({ 
      transactionData: { ...defaultTransactionData, amount: 0 } 
    });
    
    expect(screen.getByText(/0,00/)).toBeInTheDocument();
  });





  test('displays transaction details in correct structure', () => {
    renderTransactionConfirmation();
    
    
    expect(screen.getByText('Tipo de Transação:')).toBeInTheDocument();
    expect(screen.getByText('Valor:')).toBeInTheDocument();
    expect(screen.getByText('Destinatário:')).toBeInTheDocument();
    expect(screen.getByText('CPF/CNPJ:')).toBeInTheDocument();
    expect(screen.getByText('Chave PIX:')).toBeInTheDocument();
  });

     

  test('displays action buttons in correct order', () => {
    renderTransactionConfirmation();
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Cancelar');
    expect(buttons[1]).toHaveTextContent('Confirmar Transação');
  });
});
