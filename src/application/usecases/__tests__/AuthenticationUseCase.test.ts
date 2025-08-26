import { AuthenticationUseCase, LoginCredentials, RegisterData } from '../AuthenticationUseCase';
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

const mockGenerateToken = jest.fn();
const mockVerifyToken = jest.fn();

jest.mock('../../../services/JwtService', () => ({
  JwtService: {
    generateToken: mockGenerateToken,
    verifyToken: mockVerifyToken,
  },
}));

describe('AuthenticationUseCase', () => {
  let authenticationUseCase: AuthenticationUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateBalance: jest.fn(),
    };

    mockGenerateToken.mockClear();
    mockVerifyToken.mockClear();

    authenticationUseCase = new AuthenticationUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockUser = new User({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      balance: 1000,
      transactionPassword: '123456',
    });

    const loginCredentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should throw error when user is not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authenticationUseCase.login(loginCredentials)).rejects.toThrow(
        'Usuário não encontrado'
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginCredentials.email);
    });

    it('should throw error when password is incorrect', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const wrongCredentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(authenticationUseCase.login(wrongCredentials)).rejects.toThrow(
        'Senha incorreta'
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(wrongCredentials.email);
    });

    it('should successfully login with valid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockGenerateToken.mockResolvedValue('mock-jwt-token');

      const result = await authenticationUseCase.login(loginCredentials);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginCredentials.email);
      expect(result).toEqual({
        user: mockUser,
        token: 'mock-jwt-token',
      });
    });
  });

  describe('register', () => {
    const registerData: RegisterData = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'newpassword123',
      transactionPassword: '123456',
    };

    const newUser = new User({
      id: 2,
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      balance: 1000.00,
      transactionPassword: registerData.transactionPassword,
    });

    it('should throw error when email is already registered', async () => {
      const existingUser = new User({
        id: 1,
        name: 'Existing User',
        email: registerData.email,
        password: 'password123',
        balance: 1000,
        transactionPassword: '123456',
      });

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(authenticationUseCase.register(registerData)).rejects.toThrow(
        'Email já cadastrado'
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerData.email);
    });

    it('should successfully register a new user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(newUser);
      mockGenerateToken.mockResolvedValue('mock-jwt-token');

      const result = await authenticationUseCase.register(registerData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(result).toEqual({
        user: newUser,
        token: 'mock-jwt-token',
      });
    });
  });
});
