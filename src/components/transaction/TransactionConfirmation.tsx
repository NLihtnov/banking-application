import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { CreateTransactionData } from '../../application/usecases/TransactionUseCase';
import './TransactionConfirmation.css';

interface TransactionConfirmationProps {
  transactionData: CreateTransactionData;
  onConfirm: () => void;
  onBack: () => void;
  loading: boolean;
}

export const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  transactionData,
  onConfirm,
  onBack,
  loading,
}) => {
  return (
    <div className="transaction-confirmation">
      <h2>Confirme sua Transação</h2>
      
      <div className="confirmation-details">
        <div className="detail-group">
          <label>Tipo de Transação:</label>
          <span className="value">{transactionData.type}</span>
        </div>

        <div className="detail-group">
          <label>Valor:</label>
          <span className="value amount">{formatCurrency(transactionData.amount)}</span>
        </div>

        <div className="detail-group">
          <label>Destinatário:</label>
          <span className="value">{transactionData.recipientName}</span>
        </div>

        <div className="detail-group">
          <label>CPF/CNPJ:</label>
          <span className="value">{transactionData.recipientDocument}</span>
        </div>

        {transactionData.type === 'TED' && (
          <>
            <div className="detail-group">
              <label>Banco:</label>
              <span className="value">{transactionData.bank}</span>
            </div>
            <div className="detail-group">
              <label>Agência:</label>
              <span className="value">{transactionData.agency}</span>
            </div>
            <div className="detail-group">
              <label>Conta:</label>
              <span className="value">{transactionData.account}</span>
            </div>
          </>
        )}

        {transactionData.type === 'PIX' && (
          <div className="detail-group">
            <label>Chave PIX:</label>
            <span className="value">{transactionData.pixKey}</span>
          </div>
        )}
      </div>

      <div className="confirmation-actions">
        <button type="button" onClick={onBack} disabled={loading} className="back-button">
          Voltar
        </button>
        <button type="button" onClick={onConfirm} disabled={loading} className="confirm-button">
          {loading ? 'Processando...' : 'Confirmar Transação'}
        </button>
      </div>
    </div>
  );
};
