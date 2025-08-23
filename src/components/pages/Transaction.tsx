import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { getCurrentUser } from '../../store/authSlice';
import { BalanceCard } from '../transaction/BalanceCard';
import { TransactionForm as TransactionFormComponent } from '../transaction/TransactionForm';
import { TransactionConfirmation } from '../transaction/TransactionConfirmation';
import { useTransactionForm, useTransaction } from '../../hooks';
import './Transaction.css';

const Transaction: React.FC = () => {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const dispatch = useAppDispatch();
  
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { loading: transactionLoading } = useAppSelector((state) => state.transaction);
  
  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleAmountChange,
    handleAmountBlur,
    validateForm,
  } = useTransactionForm();
  
  const { executeTransaction } = useTransaction();

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [user, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setStep('confirmation');
    }
  };

  const handleConfirm = async () => {
    if (validateForm()) {
      await executeTransaction(formData);
    }
  };

  const handleBack = () => {
    setStep('form');
  };

  if (authLoading) {
    return (
      <div className="transaction-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h1>Nova Transação</h1>
        <p>Realize transferências TED ou PIX de forma segura</p>
      </div>

      <div className="transaction-content">
        <BalanceCard balance={user?.balance || 0} userName={user?.name || ''} />

        {step === 'form' ? (
          <TransactionFormComponent
            formData={formData}
            errors={errors}
            touched={touched}
            onChange={handleChange}
            onBlur={handleBlur}
            onAmountChange={handleAmountChange}
            onAmountBlur={handleAmountBlur}
            onSubmit={handleSubmit}
            loading={transactionLoading}
          />
        ) : (
          <TransactionConfirmation
            transactionData={formData}
            onBack={handleBack}
            onConfirm={handleConfirm}
            loading={transactionLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Transaction; 