import { useCallback } from 'react';
import { useAppDispatch } from './index';
import { createTransaction } from '../store/transactionSlice';
import { CreateTransactionData } from '../domain/entities/types';

export const useTransaction = () => {
  const dispatch = useAppDispatch();

  const executeTransaction = useCallback(async (transactionData: CreateTransactionData) => {
    try {
      await dispatch(createTransaction(transactionData)).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }, [dispatch]);

  return {
    executeTransaction,
  };
};
