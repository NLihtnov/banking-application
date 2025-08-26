import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, useTranslation } from '../../hooks';
import { fetchTransactions, setFilters } from '../../store/transactionSlice';
import { getCurrentUser } from '../../store/authSlice';
import type { TransactionFilters } from '../../domain/repositories/ITransactionRepository';
import { formatCurrency, formatDate, applyCurrencyMask, removeCurrencyMask, formatCurrencyForDisplay } from '../../utils/formatters';

import './History.css';

const History: React.FC = () => {
  const [localFilters, setLocalFilters] = useState<TransactionFilters>({});
  const [minAmountDisplay, setMinAmountDisplay] = useState<string>('');
  const [maxAmountDisplay, setMaxAmountDisplay] = useState<string>('');

  const dispatch = useAppDispatch();
  const { t, currentLanguage } = useTranslation();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { transactions, loading: transactionLoading, filters } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
    dispatch(fetchTransactions(filters));
  }, [dispatch, user, filters]);

  useEffect(() => {
    if (localFilters.minAmount) {
      setMinAmountDisplay(formatCurrencyForDisplay(localFilters.minAmount));
    } else {
      setMinAmountDisplay('');
    }
    
    if (localFilters.maxAmount) {
      setMaxAmountDisplay(formatCurrencyForDisplay(localFilters.maxAmount));
    } else {
      setMaxAmountDisplay('');
    }
  }, [localFilters.minAmount, localFilters.maxAmount]);



  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    
    if (key === 'startDate' && value) {
      const today = new Date().toISOString().split('T')[0];
      if (value > today) {
        alert('A data inicial não pode ser maior que hoje');
        return;
      }
      
      if (newFilters.endDate && value > newFilters.endDate) {
        alert('A data inicial não pode ser maior que a data final');
        return;
      }
    }
    
    if (key === 'endDate' && value) {
      const today = new Date().toISOString().split('T')[0];
      if (value > today) {
        alert('A data final não pode ser maior que hoje');
        return;
      }
      
      if (newFilters.startDate && value < newFilters.startDate) {
        alert('A data final não pode ser menor que a data inicial');
        return;
      }
    }
    
    if (key === 'minAmount' && value !== undefined && value !== '') {
      const numValue = typeof value === 'string' ? removeCurrencyMask(value) : value;
      if (isNaN(numValue) || numValue < 0) {
        alert('O valor mínimo deve ser um número positivo');
        return;
      }
      
      if (newFilters.maxAmount && numValue > newFilters.maxAmount) {
        alert('O valor mínimo não pode ser maior que o valor máximo');
        return;
      }
    }
    
    if (key === 'maxAmount' && value !== undefined && value !== '') {
      const numValue = typeof value === 'string' ? removeCurrencyMask(value) : value;
      if (isNaN(numValue) || numValue < 0) {
        alert('O valor máximo deve ser um número positivo');
        return;
      }
      
      if (newFilters.minAmount && numValue < newFilters.minAmount) {
        alert('O valor máximo não pode ser menor que o valor mínimo');
        return;
      }
    }
    
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    setMinAmountDisplay('');
    setMaxAmountDisplay('');
    dispatch(setFilters({}));
  };

  const handleSort = (sortBy: 'date' | 'amount') => {
    const currentOrder: 'asc' | 'desc' = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    const newFilters = { ...localFilters, sortBy, sortOrder: currentOrder };
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  };

  const handleMinAmountChange = (value: string) => {
    const maskedValue = applyCurrencyMask(value);
    setMinAmountDisplay(maskedValue);
    
    const numericValue = removeCurrencyMask(maskedValue);
    
    const newFilters = { ...localFilters, minAmount: numericValue > 0 ? numericValue : undefined };
    setLocalFilters(newFilters);
  };

  const handleMaxAmountChange = (value: string) => {
    const maskedValue = applyCurrencyMask(value);
    setMaxAmountDisplay(maskedValue);
    
        const numericValue = removeCurrencyMask(maskedValue);
    
    const newFilters = { ...localFilters, maxAmount: numericValue > 0 ? numericValue : undefined };
    setLocalFilters(newFilters);
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
                min={new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                max={new Date().toISOString().split('T')[0]}
                value={localFilters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="endDate">Data Final</label>
              <input
                type="date"
                id="endDate"
                min={localFilters.startDate || new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                max={new Date().toISOString().split('T')[0]}
                value={localFilters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="minAmount">Valor Mínimo</label>
              <input
                type="text"
                id="minAmount"
                placeholder="R$ 0,00"
                value={minAmountDisplay}
                onChange={(e) => handleMinAmountChange(e.target.value)}
                onKeyPress={(e) => {
                  // Permitir apenas números e teclas de controle
                  if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="maxAmount">Valor Máximo</label>
              <input
                type="text"
                id="maxAmount"
                placeholder="R$ 0,00"
                value={maxAmountDisplay}
                onChange={(e) => handleMaxAmountChange(e.target.value)}
                onKeyPress={(e) => {
                  // Permitir apenas números e teclas de controle
                  if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
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
                <div key={transaction.id} className="history-transaction-item">
                  <div className="history-transaction-header">
                    <div className="history-transaction-type">
                      <span className={`history-type-badge ${transaction.type.toLowerCase()}`}>
                        {transaction.type}
                      </span>
                    </div>
                    <div className="history-transaction-amount">
                      - {formatCurrency(transaction.amount, currentLanguage)}
                    </div>
                  </div>
                  
                  <div className="history-transaction-content">
                    <div className="history-transaction-info-details">
                      <div className="history-transaction-recipient">
                        {transaction.recipientName}
                      </div>
                      <div className="history-transaction-document">
                        {transaction.recipientDocument}
                      </div>
                      {transaction.type === 'TED' && (
                        <div className="history-transaction-bank">
                          {transaction.bank} - Ag: {transaction.agency} - CC: {transaction.account}
                        </div>
                      )}
                      {transaction.type === 'PIX' && (
                        <div className="history-transaction-pix">
                          Chave PIX: {transaction.pixKey}
                        </div>
                      )}
                    </div>
                    
                    <div className="history-transaction-meta">
                      <div className="history-transaction-date">
                        {formatDate(transaction.date)}
                      </div>
                      <div className="history-transaction-balance">
                        Saldo: {formatCurrency(transaction.balance || 0, currentLanguage)}
                      </div>
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
