import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TransactionDTO, CreateTransactionData } from '../domain/entities/types';
import type { TransactionFilters } from '../domain/repositories/ITransactionRepository';
import { DependencyContainer } from '../infrastructure/container/DependencyContainer';
import { JwtService } from '../services/JwtService';

interface TransactionState {
  transactions: TransactionDTO[];
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  filters: {},
};

const transactionUseCase = DependencyContainer.getInstance().getTransactionUseCase();

const convertTransactionToDTO = (transaction: any): TransactionDTO => ({
  id: transaction.id || transaction._id,
  userId: transaction.userId || transaction._userId,
  type: transaction.type || transaction._type,
  amount: transaction.amount || transaction._amount,
  recipientName: transaction.recipientName || transaction._recipientName,
  date: transaction.date ? (typeof transaction.date === 'string' ? transaction.date : transaction.date.toISOString()) : new Date().toISOString(),
  description: transaction.description || transaction._description,
  recipientDocument: transaction.recipientDocument || transaction._recipientDocument,
  bank: transaction.bank || transaction._bank,
  agency: transaction.agency || transaction._agency,
  account: transaction.account || transaction._account,
  pixKey: transaction.pixKey || transaction._pixKey,
  balance: transaction.balance || transaction._balance
});

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (filters?: TransactionFilters) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    const payload = await JwtService.verifyToken(token);
    const transactions = await transactionUseCase.getUserTransactions(payload.userId, filters);
    
    return transactions.map(convertTransactionToDTO);
  }
);

export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (data: CreateTransactionData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    const payload = await JwtService.verifyToken(token);
    const transaction = await transactionUseCase.createTransaction(payload.userId, data);
    
    return convertTransactionToDTO(transaction);
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearTransactions: (state) => {
      state.transactions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar transações';
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar transação';
      });
  },
});

export const { clearError, setFilters, clearTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
