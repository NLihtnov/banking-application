import React, { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useTranslation } from '../../hooks';
import { getCurrentUser } from '../../store/authSlice';
import { fetchTransactions } from '../../store/transactionSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Home.css';

const Home: React.FC = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, currentLanguage } = useTranslation();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { transactions, loading: transactionLoading } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
    dispatch(fetchTransactions(undefined));
  }, [dispatch, user]);



  const recentTransactions = transactions.slice(0, 5);

  if (authLoading) {
    return (
      <div className="home-container">
        <div className="loading">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>{t('welcomeMessage', { name: user?.name })}</h1>
        <p>{t('manageFinances')}</p>
      </div>

      <div className="home-content">
        <div className="balance-card">
          <div className="balance-header">
            <h2>{t('currentBalance')}</h2>
            <div className="balance-amount">
              {formatCurrency(user?.balance || 0, currentLanguage)}
            </div>
          </div>
          <div className="balance-info">
            <p>{t('checkingAccount')}</p>
            <small>{t('lastUpdate')}: {new Date().toLocaleString()}</small>
          </div>
        </div>

        <div className="quick-actions">
          <h3>{t('quickActions')}</h3>
          <div className="action-buttons">
            <button onClick={() => navigate('/transaction')} className="action-button primary">
              <span className="action-icon">💸</span>
              <span>{t('newTransaction')}</span>
            </button>
            <button onClick={() => navigate('/history')} className="action-button secondary">
              <span className="action-icon">📊</span>
              <span>{t('viewHistory')}</span>
            </button>
          </div>
        </div>

        <div className="recent-transactions">
          <div className="section-header">
            <h3>{t('recentTransactions')}</h3>
            <span className="transaction-count">
              {t('totalTransactions', { count: transactions.length })}
            </span>
          </div>

          {transactionLoading ? (
            <div className="loading">{t('loadingTransactions')}</div>
          ) : recentTransactions.length > 0 ? (
            <div className="transactions-list">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="home-transaction-item">
                  <div className="home-transaction-info">
                    <div className="home-transaction-type">
                      <span className={`home-type-badge ${transaction.type.toLowerCase()}`}>
                        {transaction.type}
                      </span>
                    </div>
                    <div className="home-transaction-details">
                      <div className="home-transaction-recipient">
                        {transaction.recipientName}
                      </div>
                      <div className="home-transaction-date">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                  </div>
                  <div className="home-transaction-amount">
                    - {formatCurrency(transaction.amount, currentLanguage)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>Nenhuma transação encontrada</p>
              <small>Suas transações aparecerão aqui</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Home;
