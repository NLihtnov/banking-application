import { useState, useCallback, useRef } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, formData?: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

export const useForm = <T extends Record<string, any>>(
  initialData: T,
  validationRules: ValidationRules
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback((name: string, value: any): string => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return 'Este campo é obrigatório';
    }

    if (!value || (typeof value === 'string' && !value.trim())) {
      return '';
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `Mínimo de ${rules.minLength} caracteres`;
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `Máximo de ${rules.maxLength} caracteres`;
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Formato inválido';
    }

    if (rules.custom) {
      const customError = rules.custom(value, formData);
      if (customError) return customError;
    }

    return '';
  }, [validationRules, formData]);

  const debouncedValidation = useDebounce((name: string, value: any) => {
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }));
  }, 300);

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
    
    debouncedValidation(name, value);
  }, [errors, debouncedValidation]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, [validateField]);

  const validateForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    Object.keys(validationRules).forEach(fieldName => {
      const fieldError = validateField(fieldName, formData[fieldName]);
      if (fieldError) {
        newErrors[fieldName] = fieldError;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationRules, formData, validateField]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const setFieldTouched = useCallback((name: string, touched: boolean) => {
    setTouched(prev => ({
      ...prev,
      [name]: touched,
    }));
  }, []);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  };
};
