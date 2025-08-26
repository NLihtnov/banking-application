import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { renderWithProviders } from '../../../test-utils';
import { TransactionForm } from '../TransactionForm';
import { CreateTransactionData } from '../../../domain/entities/types';

describe('TransactionForm Component', () => {
  const defaultFormData: CreateTransactionData = {
    type: '',
    amount: 0,
    recipientName: '',
    recipientDocument: '',
    transactionPassword: '',
  };

  const defaultErrors = {};
  const defaultTouched = {};

  const defaultProps = {
    formData: defaultFormData,
    errors: defaultErrors,
    touched: defaultTouched,
    onChange: jest.fn(),
    onBlur: jest.fn(),
    onSubmit: jest.fn(),
    loading: false,
  };

  const renderTransactionForm = (props = {}) => {
    return renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <TransactionForm {...defaultProps} {...props} />
      </I18nextProvider>
    );
  };

  beforeEach(() => {
    i18n.changeLanguage('pt');
  });

  test('renders transaction form with all fields', () => {
    renderTransactionForm();
    
    expect(screen.getByLabelText(/Tipo de Transação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Valor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome do Destinatário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF\/CNPJ do Destinatário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data e Horário da Transação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha de Transação/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continuar/i })).toBeInTheDocument();
  });

  test('renders transaction type options', () => {
    renderTransactionForm();
    
    const typeSelect = screen.getByLabelText(/Tipo de Transação/i);
    expect(typeSelect).toHaveValue('');
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3); 
    expect(screen.getByRole('option', { name: 'Selecione o tipo' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'TED' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'PIX' })).toBeInTheDocument();
  });

  test('shows TED-specific fields when TED is selected', () => {
    renderTransactionForm({
      formData: { ...defaultFormData, type: 'TED' },
    });
    
    expect(screen.getByLabelText(/Banco/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Agência/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Conta/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Chave PIX/i)).not.toBeInTheDocument();
  });

  test('shows PIX-specific fields when PIX is selected', () => {
    renderTransactionForm({
      formData: { ...defaultFormData, type: 'PIX' },
    });
    
    expect(screen.getByLabelText(/Chave PIX/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Banco/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Agência/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Conta/i)).not.toBeInTheDocument();
  });



  test('handles form field blur events', () => {
    const onBlur = jest.fn();
    renderTransactionForm({ onBlur });
    
    const recipientNameInput = screen.getByLabelText(/Nome do Destinatário/i);
    fireEvent.blur(recipientNameInput);
    
    expect(onBlur).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({ name: 'recipientName' }),
    }));
  });



  test('displays validation errors when fields are touched and have errors', () => {
    const errors = {
      recipientName: 'Nome é obrigatório',
      amount: 'Valor deve ser maior que zero',
    };
    const touched = {
      recipientName: true,
      amount: true,
    };
    
    renderTransactionForm({ errors, touched });
    
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Valor deve ser maior que zero')).toBeInTheDocument();
  });

  test('does not display errors for untouched fields', () => {
    const errors = {
      recipientName: 'Nome é obrigatório',
    };
    const touched = {
      recipientName: false,
    };
    
    renderTransactionForm({ errors, touched });
    
    expect(screen.queryByText('Nome é obrigatório')).not.toBeInTheDocument();
  });

  test('disables submit button when loading', () => {
    renderTransactionForm({ loading: true });
    
    const submitButton = screen.getByRole('button', { name: /Processando/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Processando...');
  });

  test('enables submit button when not loading', () => {
    renderTransactionForm({ loading: false });
    
    const submitButton = screen.getByRole('button', { name: /Continuar/i });
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent('Continuar');
  });



  test('amount field has correct attributes', () => {
    renderTransactionForm();
    
    const amountInput = screen.getByLabelText(/Valor/i);
    expect(amountInput).toHaveAttribute('type', 'text');
    expect(amountInput).toHaveAttribute('placeholder', 'R$ 0,00');
  });

  test('transaction password field has correct attributes', () => {
    renderTransactionForm();
    
    const passwordInput = screen.getByLabelText(/Senha de Transação/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('placeholder', 'Digite sua senha de transação');
  });

  test('form fields have required attribute', () => {
    renderTransactionForm();
    
    expect(screen.getByLabelText(/Tipo de Transação/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/Valor/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/Nome do Destinatário/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/CPF\/CNPJ do Destinatário/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/Senha de Transação/i)).toHaveAttribute('required');
  });

  test('transaction date time field is readonly', () => {
    renderTransactionForm();
    
    const dateTimeInput = screen.getByLabelText(/Data e Horário da Transação/i);
    expect(dateTimeInput).toHaveAttribute('readonly');
    expect(dateTimeInput).toHaveClass('readonly-field');
  });

  test('displays form data values correctly', () => {
    const formData = {
      type: 'PIX',
      amount: 150.75,
      recipientName: 'Jane Doe',
      recipientDocument: '123.456.789-00',
      pixKey: 'jane@example.com',
      transactionPassword: '123456',
    };
    
    renderTransactionForm({ formData });
    
    expect(screen.getByLabelText(/Tipo de Transação/i)).toHaveValue('PIX');
    expect(screen.getByLabelText(/Valor/i).value).toMatch(/R\$\s*150,75/);
    expect(screen.getByLabelText(/Nome do Destinatário/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/CPF\/CNPJ do Destinatário/i)).toHaveValue('123.456.789-00');
    expect(screen.getByLabelText(/Chave PIX/i)).toHaveValue('jane@example.com');
    expect(screen.getByLabelText(/Senha de Transação/i)).toHaveValue('123456');
  });

  test('validates document field with correct format', () => {
    renderTransactionForm();
    
    const documentInput = screen.getByLabelText(/CPF\/CNPJ do Destinatário/i);
    expect(documentInput).toHaveAttribute('maxLength', '18');
  });

  test('validates agency field with correct format', () => {
    renderTransactionForm({
      formData: { ...defaultFormData, type: 'TED' },
    });
    
    const agencyInput = screen.getByLabelText(/Agência/i);
    expect(agencyInput).toHaveAttribute('maxLength', '4');
    expect(agencyInput).toHaveAttribute('placeholder', '0000');
  });

  test('validates account field with correct format', () => {
    renderTransactionForm({
      formData: { ...defaultFormData, type: 'TED' },
    });
    
    const accountInput = screen.getByLabelText(/Conta/i);
    expect(accountInput).toHaveAttribute('maxLength', '7');
    expect(accountInput).toHaveAttribute('placeholder', '00000-0');
  });

  test('validates transaction password field with correct format', () => {
    renderTransactionForm();
    
    const passwordInput = screen.getByLabelText(/Senha de Transação/i);
    expect(passwordInput).toHaveAttribute('maxLength', '6');
  });

  test('formats account field correctly with mask', () => {
    const onChange = jest.fn();
    renderTransactionForm({
      formData: { ...defaultFormData, type: 'TED' },
      onChange,
    });
    
    const accountInput = screen.getByLabelText(/Conta/i);
    
    // Simular digitação de 5 dígitos
    fireEvent.change(accountInput, { target: { value: '12345' } });
    expect(accountInput.value).toBe('12345');
    
    // Simular digitação do 6º dígito (deve adicionar o hífen)
    fireEvent.change(accountInput, { target: { value: '123456' } });
    expect(accountInput.value).toBe('12345-6');
  });

  test('allows agency field to accept up to 4 digits', () => {
    const onChange = jest.fn();
    renderTransactionForm({
      formData: { ...defaultFormData, type: 'TED' },
      onChange,
    });
    
    const agencyInput = screen.getByLabelText(/Agência/i);
    
    // Simular digitação de 4 dígitos
    fireEvent.change(agencyInput, { target: { value: '1234' } });
    expect(agencyInput.value).toBe('1234');
    
    // Verificar que não aceita mais de 4 dígitos
    fireEvent.change(agencyInput, { target: { value: '12345' } });
    expect(agencyInput.value).toBe('1234');
  });
});
