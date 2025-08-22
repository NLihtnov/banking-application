import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCurrentUser } from '../../store/slices/authSlice';
import { createTransaction, clearError } from '../../store/slices/transactionSlice';
import { TransactionForm } from '../../types';
import './Transaction.css';

const Transaction: React.FC = () => {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [formData, setFormData] = useState<TransactionForm>({
    type: 'TED',
    recipientName: '',
    recipientDocument: '',
    bank: '',
    agency: '',
    account: '',
    pixKey: '',
    amount: 0,
    transactionPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { loading: transactionLoading, error } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Nome do favorecido é obrigatório';
    }

    if (!formData.recipientDocument.trim()) {
      newErrors.recipientDocument = 'CPF/CNPJ é obrigatório';
    }

    if (formData.type === 'TED') {
      if (!formData.bank?.trim()) {
        newErrors.bank = 'Banco é obrigatório para TED';
      }
      if (!formData.agency?.trim()) {
        newErrors.agency = 'Agência é obrigatória para TED';
      }
      if (!formData.account?.trim()) {
        newErrors.account = 'Conta é obrigatória para TED';
      }
    } else if (formData.type === 'PIX') {
      if (!formData.pixKey?.trim()) {
        newErrors.pixKey = 'Chave PIX é obrigatória';
      }
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (formData.amount > (user?.balance || 0)) {
      newErrors.amount = 'Saldo insuficiente';
    }

    if (!formData.transactionPassword.trim()) {
      newErrors.transactionPassword = 'Senha de transação é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('confirmation');
    }
  };

  const handleConfirm = async () => {
    if (validateForm()) {
      const result = await dispatch(createTransaction(formData));
      if (createTransaction.fulfilled.match(result)) {
        navigate('/home');
      }
    }
  };

  const handleBack = () => {
    setStep('form');
  };

  if (authLoading) {
    return (
      <div className="transaction-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h1>Nova Transação</h1>
        <p>Realize transferências TED ou PIX de forma segura</p>
      </div>

      <div className="transaction-content">
        <div className="balance-info">
          <h3>Saldo Disponível</h3>
          <div className="balance-amount">{formatCurrency(user?.balance || 0)}</div>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-section">
              <h3>Tipo de Transação</h3>
              <div className="transaction-type-selector">
                <label className="type-option">
                  <input
                    type="radio"
                    name="type"
                    value="TED"
                    checked={formData.type === 'TED'}
                    onChange={handleChange}
                  />
                  <span className="type-label">TED</span>
                </label>
                <label className="type-option">
                  <input
                    type="radio"
                    name="type"
                    value="PIX"
                    checked={formData.type === 'PIX'}
                    onChange={handleChange}
                  />
                  <span className="type-label">PIX</span>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Dados do Favorecido</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="recipientName">Nome Completo *</label>
                  <input
                    type="text"
                    id="recipientName"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="Digite o nome completo"
                  />
                  {errors.recipientName && <div className="error-message">{errors.recipientName}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="recipientDocument">CPF/CNPJ *</label>
                  <input
                    type="text"
                    id="recipientDocument"
                    name="recipientDocument"
                    value={formData.recipientDocument}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                  />
                  {errors.recipientDocument && <div className="error-message">{errors.recipientDocument}</div>}
                </div>
              </div>

              {formData.type === 'TED' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bank">Banco *</label>
                    <input
                      type="text"
                      id="bank"
                      name="bank"
                      value={formData.bank}
                      onChange={handleChange}
                      placeholder="Nome do banco"
                    />
                    {errors.bank && <div className="error-message">{errors.bank}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="agency">Agência *</label>
                    <input
                      type="text"
                      id="agency"
                      name="agency"
                      value={formData.agency}
                      onChange={handleChange}
                      placeholder="0000"
                    />
                    {errors.agency && <div className="error-message">{errors.agency}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="account">Conta *</label>
                    <input
                      type="text"
                      id="account"
                      name="account"
                      value={formData.account}
                      onChange={handleChange}
                      placeholder="00000-0"
                    />
                    {errors.account && <div className="error-message">{errors.account}</div>}
                  </div>
                </div>
              )}

              {formData.type === 'PIX' && (
                <div className="form-group">
                  <label htmlFor="pixKey">Chave PIX *</label>
                  <input
                    type="text"
                    id="pixKey"
                    name="pixKey"
                    value={formData.pixKey}
                    onChange={handleChange}
                    placeholder="Email, CPF, telefone ou chave aleatória"
                  />
                  {errors.pixKey && <div className="error-message">{errors.pixKey}</div>}
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>Valor da Transação</h3>
              <div className="form-group">
                <label htmlFor="amount">Valor *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                />
                {errors.amount && <div className="error-message">{errors.amount}</div>}
              </div>
            </div>

            <div className="form-section">
              <h3>Confirmação</h3>
              <div className="form-group">
                <label htmlFor="transactionPassword">Senha de Transação *</label>
                <input
                  type="password"
                  id="transactionPassword"
                  name="transactionPassword"
                  value={formData.transactionPassword}
                  onChange={handleChange}
                  placeholder="Digite sua senha de transação"
                />
                {errors.transactionPassword && <div className="error-message">{errors.transactionPassword}</div>}
              </div>
            </div>

            {error && <div className="error-message global-error">{error}</div>}

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/home')} className="cancel-button">
                Cancelar
              </button>
              <button type="submit" disabled={transactionLoading} className="submit-button">
                Continuar
              </button>
            </div>
          </form>
        ) : (
          <div className="confirmation-step">
            <h3>Confirme os Dados da Transação</h3>
            
            <div className="confirmation-details">
              <div className="detail-row">
                <span className="detail-label">Tipo:</span>
                <span className="detail-value">{formData.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Favorecido:</span>
                <span className="detail-value">{formData.recipientName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">CPF/CNPJ:</span>
                <span className="detail-value">{formData.recipientDocument}</span>
              </div>
              {formData.type === 'TED' && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Banco:</span>
                    <span className="detail-value">{formData.bank}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Agência:</span>
                    <span className="detail-value">{formData.agency}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Conta:</span>
                    <span className="detail-value">{formData.account}</span>
                  </div>
                </>
              )}
              {formData.type === 'PIX' && (
                <div className="detail-row">
                  <span className="detail-label">Chave PIX:</span>
                  <span className="detail-value">{formData.pixKey}</span>
                </div>
              )}
              <div className="detail-row amount-row">
                <span className="detail-label">Valor:</span>
                <span className="detail-value amount">{formatCurrency(formData.amount)}</span>
              </div>
            </div>

            {error && <div className="error-message global-error">{error}</div>}

            <div className="form-actions">
              <button onClick={handleBack} className="back-button">
                Voltar
              </button>
              <button
                onClick={handleConfirm}
                disabled={transactionLoading}
                className="confirm-button"
              >
                {transactionLoading ? 'Processando...' : 'Confirmar Transação'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
