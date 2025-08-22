import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TransactionState, TransactionForm, TransactionFilters, Transaction } from '../../types';
import { transactionService } from '../../services/api';

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  filters: {},
};

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (filters?: TransactionFilters) => {
    return await transactionService.getTransactions(filters);
  }
);

export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (transactionData: TransactionForm) => {
    return await transactionService.createTransaction(transactionData);
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TransactionFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
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
        state.error = action.error.message || 'Erro ao carregar transações';
      })
      // Create Transaction
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

export const { setFilters, clearFilters, clearError } = transactionSlice.actions;
export default transactionSlice.reducer;
