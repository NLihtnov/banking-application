import React, { memo } from 'react';
import { CreateTransactionData } from '../../domain/entities/types';
import { applyCurrencyMask, removeCurrencyMask, formatDocument } from '../../utils/formatters';
import './TransactionForm.css';

interface TransactionFormProps {
  formData: CreateTransactionData;
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAmountChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAmountBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = memo(({
  formData,
  errors,
  touched,
  onChange,
  onBlur,
  onAmountChange,
  onAmountBlur,
  onSubmit,
  loading,
}) => {
  const [amountDisplay, setAmountDisplay] = React.useState<string>('');
  const [documentDisplay, setDocumentDisplay] = React.useState<string>('');
  const [agencyDisplay, setAgencyDisplay] = React.useState<string>('');
  const [accountDisplay, setAccountDisplay] = React.useState<string>('');

  React.useEffect(() => {
    if (formData.amount && formData.amount > 0) {
      setAmountDisplay(new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(formData.amount));
    } else {
      setAmountDisplay('');
    }
  }, [formData.amount]);

  React.useEffect(() => {
    if (formData.recipientDocument) {
      setDocumentDisplay(formatDocument(formData.recipientDocument));
    } else {
      setDocumentDisplay('');
    }
  }, [formData.recipientDocument]);

  React.useEffect(() => {
    if (formData.agency) {
      setAgencyDisplay(formData.agency.replace(/\D/g, ''));
    } else {
      setAgencyDisplay('');
    }
  }, [formData.agency]);

  React.useEffect(() => {
    if (formData.account) {
      const cleanAccount = formData.account.replace(/\D/g, '');
      if (cleanAccount.length === 6) {
        const formattedAccount = cleanAccount.slice(0, 5) + '-' + cleanAccount.slice(5, 6);
        setAccountDisplay(formattedAccount);
      } else {
        setAccountDisplay(cleanAccount);
      }
    } else {
      setAccountDisplay('');
    }
  }, [formData.account]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const maskedValue = applyCurrencyMask(value);
    setAmountDisplay(maskedValue);
    
    const numericValue = removeCurrencyMask(maskedValue);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'amount',
        value: numericValue.toString(),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onAmountChange?.(syntheticEvent);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '');
    const formattedValue = formatDocument(cleanValue);
    setDocumentDisplay(formattedValue);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'recipientDocument',
        value: cleanValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  const handleAgencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '').slice(0, 4);
    setAgencyDisplay(cleanValue);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'agency',
        value: cleanValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '').slice(0, 6);
    
    let formattedValue = cleanValue;
    if (cleanValue.length === 6) {
      formattedValue = cleanValue.slice(0, 5) + '-' + cleanValue.slice(5, 6);
    }
    
    setAccountDisplay(formattedValue);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'account',
        value: cleanValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <div className="transaction-form-container">
      <form onSubmit={onSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="type">Tipo de Transação</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={onChange}
            onBlur={onBlur}
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="TED">TED</option>
            <option value="PIX">PIX</option>
          </select>
          {touched.type && errors.type && <div className="error-message">{errors.type}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Valor</label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={amountDisplay}
            onChange={handleAmountChange}
            onBlur={onAmountBlur || onBlur}
            required
            placeholder="R$ 0,00"
            onKeyPress={(e) => {
              if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {touched.amount && errors.amount && <div className="error-message">{errors.amount}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="recipientName">Nome do Destinatário</label>
          <input
            type="text"
            id="recipientName"
            name="recipientName"
            value={formData.recipientName}
            onChange={onChange}
            onBlur={onBlur}
            required
            placeholder="Nome completo"
          />
          {touched.recipientName && errors.recipientName && (
            <div className="error-message">{errors.recipientName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="recipientDocument">CPF/CNPJ do Destinatário</label>
          <input
            type="text"
            id="recipientDocument"
            name="recipientDocument"
            value={documentDisplay}
            onChange={handleDocumentChange}
            onBlur={onBlur}
            required
            placeholder="000.000.000-00"
            maxLength={18}
            onKeyPress={(e) => {
              if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {touched.recipientDocument && errors.recipientDocument && (
            <div className="error-message">{errors.recipientDocument}</div>
          )}
        </div>

        {formData.type === 'TED' && (
          <>
            <div className="form-group">
              <label htmlFor="bank">Banco</label>
              <input
                type="text"
                id="bank"
                name="bank"
                value={formData.bank || ''}
                onChange={onChange}
                onBlur={onBlur}
                required
                placeholder="Nome do banco"
              />
              {touched.bank && errors.bank && <div className="error-message">{errors.bank}</div>}
            </div>

                         <div className="form-group">
               <label htmlFor="agency">Agência</label>
               <input
                 type="text"
                 id="agency"
                 name="agency"
                 value={agencyDisplay}
                 onChange={handleAgencyChange}
                 onBlur={onBlur}
                 required
                 placeholder="0000"
                 maxLength={4}
                 onKeyPress={(e) => {
                   if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                     e.preventDefault();
                   }
                 }}
               />
               {touched.agency && errors.agency && <div className="error-message">{errors.agency}</div>}
             </div>

             <div className="form-group">
               <label htmlFor="account">Conta</label>
               <input
                 type="text"
                 id="account"
                 name="account"
                 value={accountDisplay}
                 onChange={handleAccountChange}
                 onBlur={onBlur}
                 required
                 placeholder="00000-0"
                 maxLength={7}
                 onKeyPress={(e) => {
                   if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                     e.preventDefault();
                   }
                 }}
               />
               {touched.account && errors.account && <div className="error-message">{errors.account}</div>}
             </div>
          </>
        )}

        {formData.type === 'PIX' && (
          <div className="form-group">
            <label htmlFor="pixKey">Chave PIX</label>
            <input
              type="text"
              id="pixKey"
              name="pixKey"
              value={formData.pixKey || ''}
              onChange={onChange}
              onBlur={onBlur}
              required
              placeholder="Chave PIX"
            />
            {touched.pixKey && errors.pixKey && <div className="error-message">{errors.pixKey}</div>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="transactionDateTime">Data e Horário da Transação</label>
          <input
            type="text"
            id="transactionDateTime"
            name="transactionDateTime"
            value={new Date().toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
            readOnly
            className="readonly-field"
            placeholder="Data e horário atual"
          />
        </div>

        <div className="form-group">
          <label htmlFor="transactionPassword">Senha de Transação</label>
          <input
            type="password"
            id="transactionPassword"
            name="transactionPassword"
            value={formData.transactionPassword}
            onChange={onChange}
            onBlur={onBlur}
            required
            placeholder="Digite sua senha de transação"
            maxLength={6}
            onKeyPress={(e) => {
              if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {touched.transactionPassword && errors.transactionPassword && (
            <div className="error-message">{errors.transactionPassword}</div>
          )}
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Processando...' : 'Continuar'}
        </button>
      </form>
    </div>
  );
});
