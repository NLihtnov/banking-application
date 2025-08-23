import { renderHook, act } from '@testing-library/react';
import { useForm, ValidationRules } from '../useForm';

// Mock timers for debounce testing
jest.useFakeTimers();

describe('useForm', () => {
  const initialData = {
    name: '',
    email: '',
    password: '',
    age: 0,
  };

  const validationRules: ValidationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 6,
      custom: (value) => {
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número';
        }
        return null;
      },
    },
    age: {
      required: true,
      custom: (value) => {
        if (value < 18) {
          return 'Idade deve ser maior que 18 anos';
        }
        return null;
      },
    },
  };

  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  describe('initialization', () => {
    it('should initialize with provided data', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      expect(result.current.formData).toEqual(initialData);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });

    it('should initialize with custom initial data', () => {
      const customData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        age: 25,
      };

      const { result } = renderHook(() => useForm(customData, validationRules));

      expect(result.current.formData).toEqual(customData);
    });
  });

  describe('handleChange', () => {
    it('should update form data when handling change', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'John' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.formData.name).toBe('John');
    });

    it('should clear existing errors when field value changes', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      // First set an error
      act(() => {
        result.current.setFieldError('name', 'Some error');
      });

      expect(result.current.errors.name).toBe('Some error');

      // Then change the field value
      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'John' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.errors.name).toBe('');
    });

    it('should trigger debounced validation', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      act(() => {
        result.current.handleChange({
          target: { name: 'name', value: 'J' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      // Before debounce timeout
      expect(result.current.errors.name).toBeUndefined();

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // After debounce timeout
      expect(result.current.errors.name).toBe('Mínimo de 2 caracteres');
    });
  });

  describe('handleBlur', () => {
    it('should validate field immediately on blur', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      act(() => {
        result.current.handleBlur({
          target: { name: 'name', value: '' },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.errors.name).toBe('Este campo é obrigatório');
      expect(result.current.touched.name).toBe(true);
    });

    it('should mark field as touched', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      act(() => {
        result.current.handleBlur({
          target: { name: 'name', value: 'Valid Name' },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.touched.name).toBe(true);
    });
  });

  describe('validation', () => {
    it('should validate required fields', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      act(() => {
        const isValid = result.current.validateForm();
        expect(isValid).toBe(false);
      });

      expect(result.current.errors.name).toBe('Este campo é obrigatório');
      expect(result.current.errors.email).toBe('Este campo é obrigatório');
      expect(result.current.errors.password).toBe('Este campo é obrigatório');
      expect(result.current.errors.age).toBe('Este campo é obrigatório');
    });

    it('should validate minLength', () => {
      const { result } = renderHook(() => useForm({ ...initialData, name: 'J' }, validationRules));

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.name).toBe('Mínimo de 2 caracteres');
    });

    it('should validate maxLength', () => {
      const { result } = renderHook(() => useForm({ 
        ...initialData, 
        name: 'A'.repeat(51) 
      }, validationRules));

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.name).toBe('Máximo de 50 caracteres');
    });

    it('should validate pattern', () => {
      const { result } = renderHook(() => useForm({ 
        ...initialData, 
        email: 'invalid-email' 
      }, validationRules));

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.email).toBe('Formato inválido');
    });

    it('should validate custom rules', () => {
      const { result } = renderHook(() => useForm({ 
        ...initialData, 
        password: 'weak',
        age: 15
      }, validationRules));

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.password).toBe('Mínimo de 6 caracteres');
      expect(result.current.errors.age).toBe('Idade deve ser maior que 18 anos');
    });

    it('should return true for valid form', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        age: 25,
      };

      const { result } = renderHook(() => useForm(validData, validationRules));

      act(() => {
        const isValid = result.current.validateForm();
        expect(isValid).toBe(true);
      });

      expect(Object.keys(result.current.errors)).toHaveLength(0);
    });

    it('should handle empty string validation correctly', () => {
      const rules: ValidationRules = {
        optional: {
          minLength: 3,
        },
      };

      const { result } = renderHook(() => useForm({ optional: '' }, rules));

      act(() => {
        result.current.validateForm();
      });

      // Empty string should not trigger minLength validation for non-required fields
      expect(result.current.errors.optional).toBeUndefined();
    });
  });

  describe('utility functions', () => {
    it('should reset form', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      // Modify form state
      act(() => {
        result.current.setFieldValue('name', 'John');
        result.current.setFieldError('email', 'Some error');
        result.current.setFieldTouched('password', true);
      });

      // Reset form
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formData).toEqual(initialData);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });

    it('should set field value', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      act(() => {
        result.current.setFieldValue('name', 'John Doe');
      });

      expect(result.current.formData.name).toBe('John Doe');
    });

    it('should set field error', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      act(() => {
        result.current.setFieldError('email', 'Custom error message');
      });

      expect(result.current.errors.email).toBe('Custom error message');
    });

    it('should set field touched', () => {
      const { result } = renderHook(() => useForm(initialData, validationRules));

      act(() => {
        result.current.setFieldTouched('password', true);
      });

      expect(result.current.touched.password).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle fields not in validation rules', () => {
      const { result } = renderHook(() => useForm(initialData, {}));

      act(() => {
        result.current.handleChange({
          target: { name: 'unknownField', value: 'value' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.formData).toEqual({
        ...initialData,
        unknownField: 'value',
      });
    });

    it('should handle validation of fields not in form data', () => {
      const { result } = renderHook(() => useForm({}, { name: { required: true } }));

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.name).toBe('Este campo é obrigatório');
    });

    it('should handle custom validation that returns null', () => {
      const rules: ValidationRules = {
        field: {
          custom: () => null,
        },
      };

      const { result } = renderHook(() => useForm({ field: 'value' }, rules));

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.field).toBeUndefined();
    });
  });
});
