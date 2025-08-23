import { formatCurrency, formatDate, formatDocument } from '../formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format positive integer values correctly', () => {
      const result = formatCurrency(1000);
      expect(result).toContain('R$');
      expect(result).toContain('1.000,00');
    });

    it('should format positive decimal values correctly', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('R$');
      expect(result).toContain('1.234,56');
    });

    it('should format zero correctly', () => {
      const result = formatCurrency(0);
      expect(result).toContain('R$');
      expect(result).toContain('0,00');
    });

    it('should format small decimal values correctly', () => {
      const result = formatCurrency(0.99);
      expect(result).toContain('R$');
      expect(result).toContain('0,99');
    });

    it('should format large values correctly', () => {
      const result = formatCurrency(999999.99);
      expect(result).toContain('R$');
      expect(result).toContain('999.999,99');
    });

    it('should handle negative values correctly', () => {
      const result = formatCurrency(-100);
      expect(result).toContain('-R$');
      expect(result).toContain('100,00');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date string correctly', () => {
      const testDate = '2024-01-15T10:30:00.000Z';
      const result = formatDate(testDate);
      
      // Verifica se contém os elementos esperados
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/); // dd/mm/yyyy
      expect(result).toMatch(/\d{2}:\d{2}/); // hh:mm
    });

    it('should format date string without time correctly', () => {
      const testDate = '2024-01-15';
      const result = formatDate(testDate);
      
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should format date string with different timezone correctly', () => {
      const testDate = '2024-12-31T23:59:59.999Z';
      const result = formatDate(testDate);
      
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should handle edge case dates correctly', () => {
      const testDate = '2000-02-29T00:00:00.000Z'; // Ano bissexto
      const result = formatDate(testDate);
      
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('formatDocument', () => {
    it('should format CPF (11 digits) correctly', () => {
      expect(formatDocument('12345678901')).toBe('123.456.789-01');
    });

    it('should format CPF with dots and dashes correctly', () => {
      expect(formatDocument('123.456.789-01')).toBe('123.456.789-01');
    });

    it('should format CPF with mixed characters correctly', () => {
      expect(formatDocument('123abc456def789ghi01')).toBe('123.456.789-01');
    });

    it('should format CNPJ (14 digits) correctly', () => {
      expect(formatDocument('12345678901234')).toBe('12.345.678/9012-34');
    });

    it('should format CNPJ with dots, slashes and dashes correctly', () => {
      expect(formatDocument('12.345.678/9012-34')).toBe('12.345.678/9012-34');
    });

    it('should format CNPJ with mixed characters correctly', () => {
      expect(formatDocument('12abc345def678ghi901jkl234')).toBe('12.345.678/9012-34');
    });

    it('should return original string for invalid length CPF', () => {
      expect(formatDocument('123456789')).toBe('123456789');
    });

    it('should return original string for invalid length CNPJ', () => {
      expect(formatDocument('1234567890123')).toBe('1234567890123');
    });

    it('should return original string for empty string', () => {
      expect(formatDocument('')).toBe('');
    });

    it('should return original string for non-numeric string', () => {
      expect(formatDocument('abc')).toBe('abc');
    });

    it('should handle CPF with exactly 11 digits after cleaning', () => {
      expect(formatDocument('abc123def456ghi789jkl01')).toBe('123.456.789-01');
    });

    it('should handle CNPJ with exactly 14 digits after cleaning', () => {
      expect(formatDocument('abc12def345ghi678jkl901mno234')).toBe('12.345.678/9012-34');
    });
  });
});
