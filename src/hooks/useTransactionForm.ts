import { useState, useCallback } from 'react';
import { CreateTransactionData } from '../domain/entities/types';

export const useTransactionForm = () => {
  const [formData, setFormData] = useState<CreateTransactionData>({
    type: 'TED',
    amount: 0,
    recipientName: '',
    recipientDocument: '',
    bank: '',
    agency: '',
    account: '',
    pixKey: '',
    transactionPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.type) {
      newErrors.type = 'Tipo de transação é obrigatório';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Nome do destinatário é obrigatório';
    }

    if (!formData.recipientDocument.trim()) {
      newErrors.recipientDocument = 'CPF/CNPJ do destinatário é obrigatório';
    }

    if (formData.type === 'TED') {
      if (!formData.bank?.trim()) {
        newErrors.bank = 'Banco é obrigatório para TED';
      }
      if (!formData.agency?.trim()) {
        newErrors.agency = 'Agência é obrigatória para TED';
      }
      if (!formData.account?.trim()) {
        newErrors.account = 'Conta é obrigatória para TED';
      }
    }

    if (formData.type === 'PIX') {
      if (!formData.pixKey?.trim()) {
        newErrors.pixKey = 'Chave PIX é obrigatória';
      }
    }

    if (!formData.transactionPassword.trim()) {
      newErrors.transactionPassword = 'Senha de transação é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, [errors]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, [errors]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const handleAmountBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      type: 'TED',
      amount: 0,
      recipientName: '',
      recipientDocument: '',
      bank: '',
      agency: '',
      account: '',
      pixKey: '',
      transactionPassword: '',
    });
    setErrors({});
    setTouched({});
  }, []);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleAmountChange,
    handleAmountBlur,
    validateForm,
    resetForm,
  };
};
