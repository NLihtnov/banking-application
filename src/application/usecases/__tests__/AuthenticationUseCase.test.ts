import { AuthenticationUseCase } from '../AuthenticationUseCase';
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { JwtService } from '../../../services/JwtService';

const mockUserRepository: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  updateBalance: jest.fn(),
};

const mockJwtService = {
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
};

jest.mock('../../../services/JwtService', () => ({
  JwtService: mockJwtService,
}));

describe('AuthenticationUseCase', () => {
  let authUseCase: AuthenticationUseCase;

  beforeEach(() => {
    authUseCase = new AuthenticationUseCase(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should authenticate user with valid credentials', async () => {
      const mockUser = new User({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        balance: 1000,
      });

      const mockToken = 'mock.jwt.token';

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.generateToken.mockReturnValue(mockToken);

      const result = await authUseCase.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user).toBe(mockUser);
      expect(result.token).toBe(mockToken);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw error for invalid email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authUseCase.login({
          email: 'invalid@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Email ou senha inválidos');
    });

    it('should throw error for invalid password', async () => {
      const mockUser = new User({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        balance: 1000,
      });

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authUseCase.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Email ou senha inválidos');
    });
  });

  describe('register', () => {
    it('should create new user successfully', async () => {
      const mockUser = new User({
        id: 1,
        name: 'New User',
        email: 'new@example.com',
        password: 'hashedPassword123',
        balance: 0,
      });

      const mockToken = 'mock.jwt.token';

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);
      mockJwtService.generateToken.mockReturnValue(mockToken);

      const result = await authUseCase.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(result.user).toBe(mockUser);
      expect(result.token).toBe(mockToken);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw error for existing email', async () => {
      const existingUser = new User({
        id: 1,
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'hashedPassword123',
        balance: 1000,
      });

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(
        authUseCase.register({
          name: 'New User',
          email: 'existing@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Email já está em uso');
    });
  });

  describe('getCurrentUser', () => {
    it('should return user for valid token', async () => {
      const mockUser = new User({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        balance: 1000,
      });

      const mockPayload = { userId: 1 };

      mockJwtService.verifyToken.mockReturnValue(mockPayload);
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await authUseCase.getCurrentUser('valid.token');

      expect(result).toBe(mockUser);
      expect(mockJwtService.verifyToken).toHaveBeenCalledWith('valid.token');
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error for invalid token', async () => {
      mockJwtService.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authUseCase.getCurrentUser('invalid.token')).rejects.toThrow('Invalid token');
    });
  });
});
