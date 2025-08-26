import {
  validateEmail,
  validatePassword,
  validateDocument,
  validateAmount,
  validatePixKey,
  validateBankData,
} from '../validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('simple@test.org')).toBe(true);
      expect(validateEmail('123@numbers.com')).toBe(true);
      expect(validateEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail('.test@example.com')).toBe(true);
      expect(validateEmail('test@.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate passwords with 6 or more characters', () => {
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('abcdef')).toBe(true);
      expect(validatePassword('123456789')).toBe(true);
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('abcdefghijklmnop')).toBe(true);
    });

    it('should reject passwords with less than 6 characters', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('abcde')).toBe(false);
      expect(validatePassword('123')).toBe(false);
      expect(validatePassword('ab')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });

    it('should handle special characters and mixed content', () => {
      expect(validatePassword('123!@#')).toBe(true);
      expect(validatePassword('pass word')).toBe(true);
      expect(validatePassword('PASSWORD')).toBe(true);
      expect(validatePassword('p@ssw0rd')).toBe(true);
    });
  });

  describe('validateDocument', () => {
    it('should validate CPF with 11 digits', () => {
      expect(validateDocument('12345678901')).toBe(true);
      expect(validateDocument('98765432100')).toBe(true);
      expect(validateDocument('11111111111')).toBe(true);
    });

    it('should validate CNPJ with 14 digits', () => {
      expect(validateDocument('12345678901234')).toBe(true);
      expect(validateDocument('98765432109876')).toBe(true);
      expect(validateDocument('11111111111111')).toBe(true);
    });

    it('should validate documents with formatting characters', () => {
      expect(validateDocument('123.456.789-01')).toBe(true);
      expect(validateDocument('12.345.678/9012-34')).toBe(true);
      expect(validateDocument('123-456-789-01')).toBe(true);
      expect(validateDocument('12.345.678/9012-34')).toBe(true);
    });

    it('should reject documents with invalid lengths', () => {
      expect(validateDocument('123456789')).toBe(false);
      expect(validateDocument('123456789012')).toBe(false);
      expect(validateDocument('1234567890123')).toBe(false);
      expect(validateDocument('123456789012345')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateDocument('')).toBe(false);
      expect(validateDocument('abc')).toBe(false);
      expect(validateDocument('123abc456def789ghi01')).toBe(true); 
      expect(validateDocument('12abc345def678ghi901jkl234')).toBe(true); 
    });
  });

  describe('validateAmount', () => {
    it('should validate positive amounts within range', () => {
      expect(validateAmount(1)).toBe(true);
      expect(validateAmount(100)).toBe(true);
      expect(validateAmount(1000.50)).toBe(true);
      expect(validateAmount(1000000)).toBe(true);
      expect(validateAmount(0.01)).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(validateAmount(0)).toBe(false);
      expect(validateAmount(-1)).toBe(false);
      expect(validateAmount(-100)).toBe(false);
      expect(validateAmount(1000000.01)).toBe(false);
      expect(validateAmount(1000001)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateAmount(0.001)).toBe(true);
      expect(validateAmount(999999.99)).toBe(true);
      expect(validateAmount(1000000)).toBe(true);
    });
  });

  describe('validatePixKey', () => {
    it('should validate non-empty PIX keys', () => {
      expect(validatePixKey('test@example.com')).toBe(true);
      expect(validatePixKey('12345678901')).toBe(true);
      expect(validatePixKey('abc123')).toBe(true);
      expect(validatePixKey('pix-key')).toBe(true);
      expect(validatePixKey('a')).toBe(true);
    });

    it('should reject empty PIX keys', () => {
      expect(validatePixKey('')).toBe(false);
    });

    it('should handle special characters and spaces', () => {
      expect(validatePixKey('test key')).toBe(true);
      expect(validatePixKey('test@key.com')).toBe(true);
      expect(validatePixKey('123-456-789')).toBe(true);
      expect(validatePixKey('test_key')).toBe(true);
    });
  });

  describe('validateBankData', () => {
    it('should validate complete bank data', () => {
      expect(validateBankData('Banco do Brasil', '1234', '12345-6')).toBe(true);
      expect(validateBankData('Itaú', '5678', '98765-4')).toBe(true);
      expect(validateBankData('Bradesco', '9012', '54321-0')).toBe(true);
    });

    it('should reject incomplete bank data', () => {
      expect(validateBankData('', '1234', '12345-6')).toBe(false);
      expect(validateBankData('Banco do Brasil', '', '12345-6')).toBe(false);
      expect(validateBankData('Banco do Brasil', '1234', '')).toBe(false);
      expect(validateBankData('', '', '')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateBankData('B', '1', '1')).toBe(true);
      expect(validateBankData('Banco com nome muito longo', '123456789', '1234567890123456789')).toBe(true);
    });
  });
});
