import { useMemo } from 'react';
import { UserDTO, TransactionDTO } from '../domain/entities/types';

export const useSerializableData = () => {
  const serializeUser = useMemo(() => (user: any): UserDTO => ({
    id: user?.id || user?._id || 0,
    name: user?.name || user?._name || '',
    email: user?.email || user?._email || '',
    balance: user?.balance || user?._balance || 0
  }), []);

  const serializeTransaction = useMemo(() => (transaction: any): TransactionDTO => ({
    id: transaction?.id || transaction?._id || 0,
    userId: transaction?.userId || transaction?._userId || 0,
    type: transaction?.type || transaction?._type || '',
    amount: transaction?.amount || transaction?._amount || 0,
    recipientName: transaction?.recipientName || transaction?._recipientName || '',
    date: transaction?.date ? 
      (typeof transaction.date === 'string' ? transaction.date : transaction.date.toISOString()) : 
      new Date().toISOString(),
    description: transaction?.description || transaction?._description || '',
    recipientDocument: transaction?.recipientDocument || transaction?._recipientDocument,
    bank: transaction?.bank || transaction?._bank,
    agency: transaction?.agency || transaction?._agency,
    account: transaction?.account || transaction?._account,
    pixKey: transaction?.pixKey || transaction?._pixKey,
    balance: transaction?.balance || transaction?._balance
  }), []);

  const serializeTransactions = useMemo(() => (transactions: any[]): TransactionDTO[] => {
    if (!Array.isArray(transactions)) return [];
    return transactions.map(serializeTransaction);
  }, [serializeTransaction]);

  return {
    serializeUser,
    serializeTransaction,
    serializeTransactions
  };
};
