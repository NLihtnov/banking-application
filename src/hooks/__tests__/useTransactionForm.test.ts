import { renderHook, act } from '@testing-library/react';
import { useTransactionForm } from '../useTransactionForm';

describe('useTransactionForm', () => {
  const defaultFormData = {
    type: 'TED',
    amount: 0,
    recipientName: '',
    recipientDocument: '',
    bank: '',
    agency: '',
    account: '',
    pixKey: '',
    transactionPassword: '',
  };

  describe('initialization', () => {
    it('should initialize with default form data', () => {
      const { result } = renderHook(() => useTransactionForm());

      expect(result.current.formData).toEqual(defaultFormData);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });
  });

  describe('handleChange', () => {
    it('should update form data when handling text input change', () => {
      const { result } = renderHook(() => useTransactionForm());

      act(() => {
        result.current.handleChange({
          target: { name: 'recipientName', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.formData.recipientName).toBe('John Doe');
      expect(result.current.touched.recipientName).toBe(true);
    });

    it('should update form data when handling select change', () => {
      const { result } = renderHook(() => useTransactionForm());

      act(() => {
        result.current.handleChange({
          target: { name: 'type', value: 'PIX' },
        } as React.ChangeEvent<HTMLSelectElement>);
      });

      expect(result.current.formData.type).toBe('PIX');
      expect(result.current.touched.type).toBe(true);
    });

    it('should clear existing errors when field value changes', () => {
      const { result } = renderHook(() => useTransactionForm());

      // Trigger validation to create an error
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.recipientName).toBeTruthy();

      // Change field value
      act(() => {
        result.current.handleChange({
          target: { name: 'recipientName', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.errors.recipientName).toBe('');
    });
  });

  describe('handleAmountChange', () => {
    it('should update amount as number', () => {
      const { result } = renderHook(() => useTransactionForm());

      act(() => {
        result.current.handleAmountChange({
          target: { name: 'amount', value: '100.50' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.formData.amount).toBe(100.5);
      expect(result.current.touched.amount).toBe(true);
    });

    it('should handle invalid number input', () => {
      const { result } = renderHook(() => useTransactionForm());

      act(() => {
        result.current.handleAmountChange({
          target: { name: 'amount', value: 'invalid' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.formData.amount).toBe(0);
    });

    it('should clear amount errors when value changes', () => {
      const { result } = renderHook(() => useTransactionForm());

      // Trigger validation to create an error
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.amount).toBeTruthy();

      // Change amount value
      act(() => {
        result.current.handleAmountChange({
          target: { name: 'amount', value: '100' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.errors.amount).toBe('');
    });
  });

  describe('handleBlur', () => {
    it('should mark field as touched on blur', () => {
      const { result } = renderHook(() => useTransactionForm());

      act(() => {
        result.current.handleBlur({
          target: { name: 'recipientName' },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.touched.recipientName).toBe(true);
    });
  });

  describe('handleAmountBlur', () => {
    it('should mark amount field as touched on blur', () => {
      const { result } = renderHook(() => useTransactionForm());

      act(() => {
        result.current.handleAmountBlur({
          target: { name: 'amount' },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.touched.amount).toBe(true);
    });
  });

  describe('validateForm', () => {
    it('should validate required fields', () => {
      const { result } = renderHook(() => useTransactionForm());

      act(() => {
        const isValid = result.current.validateForm();
        expect(isValid).toBe(false);
      });

      expect(result.current.errors.amount).toBe('Valor deve ser maior que zero');
      expect(result.current.errors.recipientName).toBe('Nome do destinatário é obrigatório');
      expect(result.current.errors.recipientDocument).toBe('CPF/CNPJ do destinatário é obrigatório');
      expect(result.current.errors.transactionPassword).toBe('Senha de transação é obrigatória');
    });

    it('should validate TED-specific fields', () => {
      const { result } = renderHook(() => useTransactionForm());

      // Set form data for TED
      act(() => {
        result.current.handleChange({
          target: { name: 'type', value: 'TED' },
        } as React.ChangeEvent<HTMLSelectElement>);

        result.current.handleAmountChange({
          target: { name: 'amount', value: '100' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientName', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientDocument', value: '12345678901' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'transactionPassword', value: '123456' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        const isValid = result.current.validateForm();
        expect(isValid).toBe(false);
      });

      expect(result.current.errors.bank).toBe('Banco é obrigatório para TED');
      expect(result.current.errors.agency).toBe('Agência é obrigatória para TED');
      expect(result.current.errors.account).toBe('Conta é obrigatória para TED');
    });

    it('should validate PIX-specific fields', () => {
      const { result } = renderHook(() => useTransactionForm());

      // Set form data for PIX
      act(() => {
        result.current.handleChange({
          target: { name: 'type', value: 'PIX' },
        } as React.ChangeEvent<HTMLSelectElement>);

        result.current.handleAmountChange({
          target: { name: 'amount', value: '100' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientName', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientDocument', value: '12345678901' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'transactionPassword', value: '123456' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        const isValid = result.current.validateForm();
        expect(isValid).toBe(false);
      });

      expect(result.current.errors.pixKey).toBe('Chave PIX é obrigatória');
      expect(result.current.errors.bank).toBeUndefined();
      expect(result.current.errors.agency).toBeUndefined();
      expect(result.current.errors.account).toBeUndefined();
    });

    it('should return true for valid TED form', () => {
      const { result } = renderHook(() => useTransactionForm());

      // Fill all required TED fields
      act(() => {
        result.current.handleChange({
          target: { name: 'type', value: 'TED' },
        } as React.ChangeEvent<HTMLSelectElement>);

        result.current.handleAmountChange({
          target: { name: 'amount', value: '100' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientName', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientDocument', value: '12345678901' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'bank', value: 'Banco do Brasil' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'agency', value: '1234' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'account', value: '12345-6' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'transactionPassword', value: '123456' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        const isValid = result.current.validateForm();
        expect(isValid).toBe(true);
      });

      expect(Object.keys(result.current.errors)).toHaveLength(0);
    });

    it('should return true for valid PIX form', () => {
      const { result } = renderHook(() => useTransactionForm());

      // Fill all required PIX fields
      act(() => {
        result.current.handleChange({
          target: { name: 'type', value: 'PIX' },
        } as React.ChangeEvent<HTMLSelectElement>);

        result.current.handleAmountChange({
          target: { name: 'amount', value: '100' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientName', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientDocument', value: '12345678901' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'pixKey', value: 'john@example.com' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'transactionPassword', value: '123456' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        const isValid = result.current.validateForm();
        expect(isValid).toBe(true);
      });

      expect(Object.keys(result.current.errors)).toHaveLength(0);
    });

    it('should validate empty string fields', () => {
      const { result } = renderHook(() => useTransactionForm());

      // Set fields with only whitespace
      act(() => {
        result.current.handleChange({
          target: { name: 'recipientName', value: '   ' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientDocument', value: '   ' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'transactionPassword', value: '   ' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.recipientName).toBe('Nome do destinatário é obrigatório');
      expect(result.current.errors.recipientDocument).toBe('CPF/CNPJ do destinatário é obrigatório');
      expect(result.current.errors.transactionPassword).toBe('Senha de transação é obrigatória');
    });
  });

  describe('resetForm', () => {
    it('should reset form to initial state', () => {
      const { result } = renderHook(() => useTransactionForm());

      // Modify form state
      act(() => {
        result.current.handleChange({
          target: { name: 'recipientName', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleAmountChange({
          target: { name: 'amount', value: '100' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.validateForm();
      });

      // Verify state is modified
      expect(result.current.formData.recipientName).toBe('John Doe');
      expect(result.current.formData.amount).toBe(100);
      expect(Object.keys(result.current.errors)).toHaveLength(7); // 7 errors from validation

      // Reset form
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formData).toEqual(defaultFormData);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });
  });

  describe('edge cases', () => {
    it('should handle empty amount value', () => {
      const { result } = renderHook(() => useTransactionForm());

      act(() => {
        result.current.handleAmountChange({
          target: { name: 'amount', value: '' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.formData.amount).toBe(0);
    });

    it('should handle negative amount values', () => {
      const { result } = renderHook(() => useTransactionForm());

      act(() => {
        result.current.handleAmountChange({
          target: { name: 'amount', value: '-100' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.formData.amount).toBe(-100);

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.amount).toBe('Valor deve ser maior que zero');
    });

    it('should handle zero amount', () => {
      const { result } = renderHook(() => useTransactionForm());

      act(() => {
        result.current.handleAmountChange({
          target: { name: 'amount', value: '0' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.formData.amount).toBe(0);

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.amount).toBe('Valor deve ser maior que zero');
    });

    it('should handle missing optional fields for TED without errors', () => {
      const { result } = renderHook(() => useTransactionForm());

      // Set form data for TED with optional fields empty
      act(() => {
        result.current.handleChange({
          target: { name: 'type', value: 'TED' },
        } as React.ChangeEvent<HTMLSelectElement>);

        result.current.handleAmountChange({
          target: { name: 'amount', value: '100' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientName', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'recipientDocument', value: '12345678901' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'bank', value: 'Banco do Brasil' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'agency', value: '1234' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'account', value: '12345-6' },
        } as React.ChangeEvent<HTMLInputElement>);

        result.current.handleChange({
          target: { name: 'transactionPassword', value: '123456' },
        } as React.ChangeEvent<HTMLInputElement>);

        // description is optional, so leaving it empty should not cause validation errors
      });

      act(() => {
        const isValid = result.current.validateForm();
        expect(isValid).toBe(true);
      });

      expect(result.current.errors.description).toBeUndefined();
    });
  });
});
