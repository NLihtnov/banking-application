import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import './BalanceCard.css';

interface BalanceCardProps {
  balance: number;
  userName: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, userName }) => {
  return (
    <div className="balance-card">
      <div className="balance-header">
        <h2>Olá, {userName}!</h2>
        <p>Seu saldo atual</p>
      </div>
      <div className="balance-amount">
        {formatCurrency(balance)}
      </div>
    </div>
  );
};
