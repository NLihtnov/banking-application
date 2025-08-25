jest.mock('jose');
import { JwtService, JwtPayload } from '../JwtService';

describe('JwtService', () => {
  const mockPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
    userId: 123,
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockJwtPayload: JwtPayload = {
    ...mockPayload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.REACT_APP_JWT_SECRET;
  });

  describe('generateToken', () => {
    it('should generate a JWT token successfully', async () => {
      const token = await JwtService.generateToken(mockPayload);
      expect(token).toBe('mock-jwt-token');
    });

    it('should use default secret key when REACT_APP_JWT_SECRET is not set', async () => {
      const token = await JwtService.generateToken(mockPayload);
      expect(typeof token).toBe('string');
    });

    it('should use custom secret key when REACT_APP_JWT_SECRET is set', async () => {
      process.env.REACT_APP_JWT_SECRET = 'custom-secret-key-min-32-chars-long';
      const token = await JwtService.generateToken(mockPayload);
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid JWT token successfully', async () => {
      const { jwtVerify } = require('jose');
      jwtVerify.mockResolvedValue({ payload: mockJwtPayload });

      const result = await JwtService.verifyToken('valid-token');
      expect(result).toEqual(mockJwtPayload);
    });

    it('should throw error for invalid token', async () => {
      const { jwtVerify } = require('jose');
      jwtVerify.mockRejectedValue(new Error('Invalid token'));

      await expect(JwtService.verifyToken('invalid-token')).rejects.toThrow('Token inválido ou expirado');
    });
  });

  describe('decodeToken', () => {
    it('should decode a valid JWT token successfully', async () => {
      const { jwtVerify } = require('jose');
      jwtVerify.mockResolvedValue({ payload: mockJwtPayload });

      const result = await JwtService.decodeToken('valid-token');
      expect(result).toEqual(mockJwtPayload);
    });

    it('should return null for invalid token', async () => {
      const { jwtVerify } = require('jose');
      jwtVerify.mockRejectedValue(new Error('Invalid token'));

      const result = await JwtService.decodeToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const { decodeJwt } = require('jose');
      const validTime = Math.floor(Date.now() / 1000) + 3600;
      decodeJwt.mockReturnValue({ exp: validTime });

      const result = JwtService.isTokenExpired('valid-token');
      expect(result).toBe(false);
    });

    it('should return true for expired token', () => {
      const { decodeJwt } = require('jose');
      const expiredTime = Math.floor(Date.now() / 1000) - 3600;
      decodeJwt.mockReturnValue({ exp: expiredTime });

      const result = JwtService.isTokenExpired('expired-token');
      expect(result).toBe(true);
    });

    it('should return true when decodeJwt throws error', () => {
      const { decodeJwt } = require('jose');
      decodeJwt.mockImplementation(() => { throw new Error('Decode error'); });

      const result = JwtService.isTokenExpired('error-token');
      expect(result).toBe(true);
    });
  });
});
