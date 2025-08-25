import React from 'react';
import { useTranslation } from '../../hooks';
import { formatCurrency } from '../../utils/formatters';
import './BalanceCard.css';

interface BalanceCardProps {
  balance: number;
  userName: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, userName }) => {
  const { t, currentLanguage } = useTranslation();
  
  return (
    <div className="balance-card">
      <div className="balance-header">
        <h2>{t('welcome')}, {userName}!</h2>
        <p>{t('currentBalance')}</p>
      </div>
      <div className="balance-amount">
        {formatCurrency(balance, currentLanguage)}
      </div>
    </div>
  );
};
