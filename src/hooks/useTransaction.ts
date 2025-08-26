import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { createTransaction } from '../store/transactionSlice';
import { updateBalance } from '../store/authSlice';
import { CreateTransactionData } from '../domain/entities/types';
import { webSocketService } from '../services/WebSocketService';

export const useTransaction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const executeTransaction = useCallback(async (transactionData: CreateTransactionData) => {
    try {
      const result = await dispatch(createTransaction(transactionData)).unwrap();
      
      if (result) {
        if (user) {
          const newBalance = user.balance - transactionData.amount;
          dispatch(updateBalance(newBalance));
          
          webSocketService.send({
            type: 'balance_updated',
            payload: {
              oldBalance: user.balance,
              newBalance: newBalance
            },
            timestamp: new Date().toISOString()
          });
        }
        
        webSocketService.send({
          type: 'transaction_created',
          payload: {
            id: result.id,
            type: transactionData.type,
            amount: transactionData.amount,
            recipientName: transactionData.recipientName
          },
          timestamp: new Date().toISOString()
        });
        
        return { success: true };
      } else {
        return { success: false, error: 'Falha ao criar transação' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }, [dispatch, user]);

  return {
    executeTransaction,
  };
};
