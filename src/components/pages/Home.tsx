import React, { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCurrentUser } from '../../store/authSlice';
import { fetchTransactions } from '../../store/transactionSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Home.css';

const Home: React.FC = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Bem-vindo, {user?.name}!</h1>
        <p>Gerencie suas finanças de forma simples e segura</p>
      </div>

      <div className="home-content">
        <div className="balance-card">
          <div className="balance-header">
            <h2>Saldo Atual</h2>
            <div className="balance-amount">
              {formatCurrency(user?.balance || 0)}
            </div>
          </div>
          <div className="balance-info">
            <p>Conta Corrente</p>
            <small>Última atualização: {new Date().toLocaleString('pt-BR')}</small>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Ações Rápidas</h3>
          <div className="action-buttons">
            <button onClick={() => navigate('/transaction')} className="action-button primary">
              <span className="action-icon">💸</span>
              <span>Nova Transação</span>
            </button>
            <button onClick={() => navigate('/history')} className="action-button secondary">
              <span className="action-icon">📊</span>
              <span>Ver Histórico</span>
            </button>
          </div>
        </div>

        <div className="recent-transactions">
          <div className="section-header">
            <h3>Últimas Transações</h3>
            <span className="transaction-count">
              {transactions.length} transações no total
            </span>
          </div>

          {transactionLoading ? (
            <div className="loading">Carregando transações...</div>
          ) : recentTransactions.length > 0 ? (
            <div className="transactions-list">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-type">
                      <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                        {transaction.type}
                      </span>
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-recipient">
                        {transaction.recipientName}
                      </div>
                      <div className="transaction-date">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                  </div>
                  <div className="transaction-amount">
                    - {formatCurrency(transaction.amount)}
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
