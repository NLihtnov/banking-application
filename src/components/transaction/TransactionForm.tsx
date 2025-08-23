import React, { memo } from 'react';
import { CreateTransactionData } from '../../domain/entities/types';
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
            type="number"
            id="amount"
            name="amount"
            value={formData.amount || ''}
            onChange={onAmountChange || onChange}
            onBlur={onAmountBlur || onBlur}
            required
            placeholder="0,00"
            step="0.01"
            min="0"
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
            value={formData.recipientDocument}
            onChange={onChange}
            onBlur={onBlur}
            required
            placeholder="000.000.000-00"
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
                value={formData.agency || ''}
                onChange={onChange}
                onBlur={onBlur}
                required
                placeholder="0000"
              />
              {touched.agency && errors.agency && <div className="error-message">{errors.agency}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="account">Conta</label>
              <input
                type="text"
                id="account"
                name="account"
                value={formData.account || ''}
                onChange={onChange}
                onBlur={onBlur}
                required
                placeholder="00000-0"
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
