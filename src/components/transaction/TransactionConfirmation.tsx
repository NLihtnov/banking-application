import React from 'react';
import { CreateTransactionData } from '../../domain/entities/types';
import './TransactionConfirmation.css';

interface TransactionConfirmationProps {
  transactionData: CreateTransactionData;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  transactionData,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'PIX': return '⚡';
      case 'TED': return '🏦';
      default: return '💸';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'PIX': return 'rgba(255, 255, 255, 0.15)';
      case 'TED': return 'rgba(255, 255, 255, 0.15)';
      default: return 'rgba(255, 255, 255, 0.15)';
    }
  };

  return (
    <div className="transaction-confirmation-overlay">
      <div className="transaction-confirmation-modal">
        <div className="confirmation-header">
          <div className="transaction-icon" style={{ backgroundColor: getTransactionColor(transactionData.type) }}>
            {getTransactionIcon(transactionData.type)}
          </div>
          <h2>Confirmar Transação</h2>
          <p>Revise os detalhes antes de confirmar</p>
        </div>

        <div className="confirmation-content">
          <div className="transaction-details">
            <div className="detail-row">
              <span className="detail-label">Tipo de Transação:</span>
              <span className="detail-value transaction-type">
                {getTransactionIcon(transactionData.type)} {transactionData.type}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Valor:</span>
              <span className="detail-value amount">
                {formatCurrency(transactionData.amount)}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Destinatário:</span>
              <span className="detail-value recipient">
                {transactionData.recipientName}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">CPF/CNPJ:</span>
              <span className="detail-value document">
                {transactionData.recipientDocument}
              </span>
            </div>

            {transactionData.type === 'TED' && (
              <>
                <div className="detail-row">
                  <span className="detail-label">Banco:</span>
                  <span className="detail-value">{transactionData.bank}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Agência:</span>
                  <span className="detail-value">{transactionData.agency}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Conta:</span>
                  <span className="detail-value">{transactionData.account}</span>
                </div>
              </>
            )}

            {transactionData.type === 'PIX' && (
              <div className="detail-row">
                <span className="detail-label">Chave PIX:</span>
                <span className="detail-value pix-key">{transactionData.pixKey}</span>
              </div>
            )}
          </div>

          <div className="security-notice">
            <div className="security-icon">🔒</div>
            <div className="security-text">
              <strong>Transação Segura</strong>
              <p>Sua transação será processada com segurança e você receberá uma confirmação.</p>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            className="confirm-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Processando...
              </>
            ) : (
              'Confirmar Transação'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
