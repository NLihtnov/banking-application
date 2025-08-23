import {
  TRANSACTION_TYPES,
  FILTER_PERIODS,
  SORT_OPTIONS,
  SORT_ORDERS,
  ROUTES,
  ERROR_MESSAGES,
} from '../constants';

describe('Constants', () => {
  describe('TRANSACTION_TYPES', () => {
    it('should have correct TED value', () => {
      expect(TRANSACTION_TYPES.TED).toBe('TED');
    });

    it('should have correct PIX value', () => {
      expect(TRANSACTION_TYPES.PIX).toBe('PIX');
    });

    it('should have exactly 2 transaction types', () => {
      expect(Object.keys(TRANSACTION_TYPES)).toHaveLength(2);
    });
  });

  describe('FILTER_PERIODS', () => {
    it('should have correct LAST_7_DAYS value', () => {
      expect(FILTER_PERIODS.LAST_7_DAYS).toBe(7);
    });

    it('should have correct LAST_15_DAYS value', () => {
      expect(FILTER_PERIODS.LAST_15_DAYS).toBe(15);
    });

    it('should have correct LAST_30_DAYS value', () => {
      expect(FILTER_PERIODS.LAST_30_DAYS).toBe(30);
    });

    it('should have correct LAST_90_DAYS value', () => {
      expect(FILTER_PERIODS.LAST_90_DAYS).toBe(90);
    });

    it('should have exactly 4 filter periods', () => {
      expect(Object.keys(FILTER_PERIODS)).toHaveLength(4);
    });
  });

  describe('SORT_OPTIONS', () => {
    it('should have correct DATE value', () => {
      expect(SORT_OPTIONS.DATE).toBe('date');
    });

    it('should have correct AMOUNT value', () => {
      expect(SORT_OPTIONS.AMOUNT).toBe('amount');
    });

    it('should have exactly 2 sort options', () => {
      expect(Object.keys(SORT_OPTIONS)).toHaveLength(2);
    });
  });

  describe('SORT_ORDERS', () => {
    it('should have correct ASC value', () => {
      expect(SORT_ORDERS.ASC).toBe('asc');
    });

    it('should have correct DESC value', () => {
      expect(SORT_ORDERS.DESC).toBe('desc');
    });

    it('should have exactly 2 sort orders', () => {
      expect(Object.keys(SORT_ORDERS)).toHaveLength(2);
    });
  });

  describe('ROUTES', () => {
    it('should have correct HOME value', () => {
      expect(ROUTES.HOME).toBe('/home');
    });

    it('should have correct LOGIN value', () => {
      expect(ROUTES.LOGIN).toBe('/login');
    });

    it('should have correct REGISTER value', () => {
      expect(ROUTES.REGISTER).toBe('/register');
    });

    it('should have correct TRANSACTION value', () => {
      expect(ROUTES.TRANSACTION).toBe('/transaction');
    });

    it('should have correct HISTORY value', () => {
      expect(ROUTES.HISTORY).toBe('/history');
    });

    it('should have exactly 5 routes', () => {
      expect(Object.keys(ROUTES)).toHaveLength(5);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have correct INVALID_EMAIL value', () => {
      expect(ERROR_MESSAGES.INVALID_EMAIL).toBe('Email inválido');
    });

    it('should have correct INVALID_PASSWORD value', () => {
      expect(ERROR_MESSAGES.INVALID_PASSWORD).toBe('Senha deve ter pelo menos 6 caracteres');
    });

    it('should have correct INVALID_DOCUMENT value', () => {
      expect(ERROR_MESSAGES.INVALID_DOCUMENT).toBe('Documento inválido');
    });

    it('should have correct INVALID_AMOUNT value', () => {
      expect(ERROR_MESSAGES.INVALID_AMOUNT).toBe('Valor inválido');
    });

    it('should have correct INSUFFICIENT_BALANCE value', () => {
      expect(ERROR_MESSAGES.INSUFFICIENT_BALANCE).toBe('Saldo insuficiente');
    });

    it('should have correct INVALID_TRANSACTION_PASSWORD value', () => {
      expect(ERROR_MESSAGES.INVALID_TRANSACTION_PASSWORD).toBe('Senha de transação incorreta');
    });

    it('should have correct USER_NOT_FOUND value', () => {
      expect(ERROR_MESSAGES.USER_NOT_FOUND).toBe('Usuário não encontrado');
    });

    it('should have correct EMAIL_ALREADY_EXISTS value', () => {
      expect(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS).toBe('Email já cadastrado');
    });

    it('should have exactly 8 error messages', () => {
      expect(Object.keys(ERROR_MESSAGES)).toHaveLength(8);
    });
  });
});
