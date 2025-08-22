import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCurrentUser } from '../../store/slices/authSlice';
import { fetchTransactions, setFilters, clearFilters } from '../../store/slices/transactionSlice';
import { TransactionFilters } from '../../types';
import './History.css';

const History: React.FC = () => {
  const [localFilters, setLocalFilters] = useState<TransactionFilters>({});

  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { transactions, loading: transactionLoading, filters } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
    dispatch(fetchTransactions(filters));
  }, [dispatch, user, filters]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    dispatch(clearFilters());
  };

  const handleSort = (sortBy: 'date' | 'amount') => {
    const currentOrder: 'asc' | 'desc' = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    const newFilters = { ...localFilters, sortBy, sortOrder: currentOrder };
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  };

  if (authLoading) {
    return (
      <div className="history-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Histórico de Transações</h1>
        <p>Visualize e filtre todas as suas transações</p>
      </div>

      <div className="history-content">
        <div className="filters-section">
          <h3>Filtros</h3>
          
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="type">Tipo de Transação</label>
              <select
                id="type"
                value={localFilters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              >
                <option value="">Todos</option>
                <option value="TED">TED</option>
                <option value="PIX">PIX</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="period">Período</label>
              <select
                id="period"
                value={localFilters.period || ''}
                onChange={(e) => handleFilterChange('period', e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">Todos</option>
                <option value="7">Últimos 7 dias</option>
                <option value="15">Últimos 15 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="startDate">Data Inicial</label>
              <input
                type="date"
                id="startDate"
                value={localFilters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="endDate">Data Final</label>
              <input
                type="date"
                id="endDate"
                value={localFilters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="minAmount">Valor Mínimo</label>
              <input
                type="number"
                id="minAmount"
                placeholder="0,00"
                step="0.01"
                min="0"
                value={localFilters.minAmount || ''}
                onChange={(e) => handleFilterChange('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="maxAmount">Valor Máximo</label>
              <input
                type="number"
                id="maxAmount"
                placeholder="0,00"
                step="0.01"
                min="0"
                value={localFilters.maxAmount || ''}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={applyFilters} className="apply-filters-button">
              Aplicar Filtros
            </button>
            <button onClick={clearAllFilters} className="clear-filters-button">
              Limpar Filtros
            </button>
          </div>
        </div>

        <div className="transactions-section">
          <div className="section-header">
            <h3>Transações</h3>
            <div className="sort-controls">
              <span>Ordenar por:</span>
              <button
                onClick={() => handleSort('date')}
                className={`sort-button ${filters.sortBy === 'date' ? 'active' : ''}`}
              >
                Data {filters.sortBy === 'date' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('amount')}
                className={`sort-button ${filters.sortBy === 'amount' ? 'active' : ''}`}
              >
                Valor {filters.sortBy === 'amount' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          {transactionLoading ? (
            <div className="loading">Carregando transações...</div>
          ) : transactions.length > 0 ? (
            <div className="transactions-list">
              {transactions.map((transaction) => (
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
                      <div className="transaction-document">
                        {transaction.recipientDocument}
                      </div>
                      {transaction.type === 'TED' && (
                        <div className="transaction-bank">
                          {transaction.bank} - Ag: {transaction.agency} - CC: {transaction.account}
                        </div>
                      )}
                      {transaction.type === 'PIX' && (
                        <div className="transaction-pix">
                          Chave PIX: {transaction.pixKey}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="transaction-meta">
                    <div className="transaction-date">
                      {formatDate(transaction.date)}
                    </div>
                    <div className="transaction-amount">
                      - {formatCurrency(transaction.amount)}
                    </div>
                    <div className="transaction-balance">
                      Saldo: {formatCurrency(transaction.balance)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>Nenhuma transação encontrada</p>
              <small>Tente ajustar os filtros ou realize uma nova transação</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
