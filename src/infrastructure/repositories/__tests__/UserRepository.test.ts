import { UserRepository } from '../UserRepository';
import { ApiClient } from '../../api/ApiClient';
import { User } from '../../../domain/entities/User';

// Mock do ApiClient
jest.mock('../../api/ApiClient');

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockApiClient: jest.Mocked<ApiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiClient = new ApiClient() as jest.Mocked<ApiClient>;
    userRepository = new UserRepository(mockApiClient);
  });

  describe('findByEmail', () => {
    test('should find user by email', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@example.com',
          balance: 5000.00,
        },
      ];

      mockApiClient.get.mockResolvedValue(mockUsers);

      const result = await userRepository.findByEmail('joao@example.com');

      expect(mockApiClient.get).toHaveBeenCalledWith('/users?email=joao@example.com');
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('João Silva');
      expect(result?.email).toBe('joao@example.com');
      expect(result?.balance).toBe(5000.00);
    });

    test('should return null when user not found by email', async () => {
      mockApiClient.get.mockResolvedValue([]);

      const result = await userRepository.findByEmail('nonexistent@example.com');

      expect(mockApiClient.get).toHaveBeenCalledWith('/users?email=nonexistent@example.com');
      expect(result).toBeNull();
    });

    test('should handle API error when finding user by email', async () => {
      mockApiClient.get.mockRejectedValue(new Error('API Error'));

      await expect(userRepository.findByEmail('joao@example.com')).rejects.toThrow('Erro ao buscar usuário por email');
    });

    test('should handle empty array response', async () => {
      mockApiClient.get.mockResolvedValue([]);

      const result = await userRepository.findByEmail('joao@example.com');

      expect(result).toBeNull();
    });

    test('should handle multiple users with same email (returns first)', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@example.com',
          balance: 5000.00,
        },
        {
          id: 2,
          name: 'João Santos',
          email: 'joao@example.com',
          balance: 3000.00,
        },
      ];

      mockApiClient.get.mockResolvedValue(mockUsers);

      const result = await userRepository.findByEmail('joao@example.com');

      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(1); // Retorna o primeiro usuário encontrado
      expect(result?.name).toBe('João Silva');
    });
  });

  describe('findById', () => {
    test('should find user by id', async () => {
      const userData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 5000.00,
      };

      mockApiClient.get.mockResolvedValue(userData);

      const result = await userRepository.findById(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/users/1');
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('João Silva');
      expect(result?.email).toBe('joao@example.com');
      expect(result?.balance).toBe(5000.00);
    });

    test('should return null when user not found by id', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Not Found'));

      const result = await userRepository.findById(999);

      expect(mockApiClient.get).toHaveBeenCalledWith('/users/999');
      expect(result).toBeNull();
    });

    test('should handle API error when finding user by id', async () => {
      mockApiClient.get.mockRejectedValue(new Error('API Error'));

      const result = await userRepository.findById(1);

      expect(result).toBeNull();
    });

    test('should handle network error when finding user by id', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Network Error'));

      const result = await userRepository.findById(1);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    test('should create a new user', async () => {
      const userData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 5000.00,
      };

      const user = new User(userData);
      mockApiClient.post.mockResolvedValue(userData);

      const result = await userRepository.create(user);

      expect(mockApiClient.post).toHaveBeenCalledWith('/users', userData);
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.name).toBe('João Silva');
      expect(result.email).toBe('joao@example.com');
      expect(result.balance).toBe(5000.00);
    });

    test('should handle API error when creating user', async () => {
      const userData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 5000.00,
      };

      const user = new User(userData);
      mockApiClient.post.mockRejectedValue(new Error('API Error'));

      await expect(userRepository.create(user)).rejects.toThrow('Erro ao criar usuário');
    });

    test('should handle validation error when creating user', async () => {
      const userData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 5000.00,
      };

      const user = new User(userData);
      mockApiClient.post.mockRejectedValue(new Error('Validation Error'));

      await expect(userRepository.create(user)).rejects.toThrow('Erro ao criar usuário');
    });

    test('should create user with zero balance', async () => {
      const userData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 0,
      };

      const user = new User(userData);
      mockApiClient.post.mockResolvedValue(userData);

      const result = await userRepository.create(user);

      expect(result.balance).toBe(0);
    });

    test('should create user with negative balance', async () => {
      const userData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: -100.00,
      };

      const user = new User(userData);
      mockApiClient.post.mockResolvedValue(userData);

      const result = await userRepository.create(user);

      expect(result.balance).toBe(-100.00);
    });
  });

  describe('update', () => {
    test('should update an existing user', async () => {
      const userData = {
        id: 1,
        name: 'João Silva Updated',
        email: 'joao.updated@example.com',
        balance: 7500.00,
      };

      const user = new User(userData);
      mockApiClient.patch.mockResolvedValue(userData);

      const result = await userRepository.update(user);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/users/1', userData);
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.name).toBe('João Silva Updated');
      expect(result.email).toBe('joao.updated@example.com');
      expect(result.balance).toBe(7500.00);
    });

    test('should handle API error when updating user', async () => {
      const userData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 5000.00,
      };

      const user = new User(userData);
      mockApiClient.patch.mockRejectedValue(new Error('API Error'));

      await expect(userRepository.update(user)).rejects.toThrow('Erro ao atualizar usuário');
    });

    test('should handle not found error when updating user', async () => {
      const userData = {
        id: 999,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 5000.00,
      };

      const user = new User(userData);
      mockApiClient.patch.mockRejectedValue(new Error('Not Found'));

      await expect(userRepository.update(user)).rejects.toThrow('Erro ao atualizar usuário');
    });

    test('should update user with partial data', async () => {
      const userData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 5000.00,
      };

      const user = new User(userData);
      const updatedData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 6000.00,
      };

      mockApiClient.patch.mockResolvedValue(updatedData);

      const result = await userRepository.update(user);

      expect(result.balance).toBe(6000.00);
    });
  });

  describe('updateBalance', () => {
    test('should update user balance successfully', async () => {
      mockApiClient.patch.mockResolvedValue({});

      await userRepository.updateBalance(1, 7500.00);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/users/1', { balance: 7500.00 });
    });

    test('should handle API error when updating balance', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('API Error'));

      await expect(userRepository.updateBalance(1, 7500.00)).rejects.toThrow('Erro ao atualizar saldo');
    });

    test('should handle not found error when updating balance', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Not Found'));

      await expect(userRepository.updateBalance(999, 7500.00)).rejects.toThrow('Erro ao atualizar saldo');
    });

    test('should update balance to zero', async () => {
      mockApiClient.patch.mockResolvedValue({});

      await userRepository.updateBalance(1, 0);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/users/1', { balance: 0 });
    });

    test('should update balance to negative value', async () => {
      mockApiClient.patch.mockResolvedValue({});

      await userRepository.updateBalance(1, -100.00);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/users/1', { balance: -100.00 });
    });

    test('should update balance with decimal value', async () => {
      mockApiClient.patch.mockResolvedValue({});

      await userRepository.updateBalance(1, 1234.56);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/users/1', { balance: 1234.56 });
    });

    test('should handle network error when updating balance', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Network Error'));

      await expect(userRepository.updateBalance(1, 7500.00)).rejects.toThrow('Erro ao atualizar saldo');
    });

    test('should handle server error when updating balance', async () => {
      mockApiClient.patch.mockRejectedValue(new Error('Internal Server Error'));

      await expect(userRepository.updateBalance(1, 7500.00)).rejects.toThrow('Erro ao atualizar saldo');
    });
  });

  describe('integration scenarios', () => {
    test('should handle complete user lifecycle', async () => {
      // Create user
      const createUserData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 1000.00,
      };

      const user = new User(createUserData);
      mockApiClient.post.mockResolvedValue(createUserData);

      const createdUser = await userRepository.create(user);
      expect(createdUser.id).toBe(1);
      expect(createdUser.balance).toBe(1000.00);

      // Find user by email
      mockApiClient.get.mockResolvedValue([createUserData]);
      const foundByEmail = await userRepository.findByEmail('joao@example.com');
      expect(foundByEmail?.id).toBe(1);

      // Find user by id
      mockApiClient.get.mockResolvedValue(createUserData);
      const foundById = await userRepository.findById(1);
      expect(foundById?.id).toBe(1);

      // Update user
      const updateUserData = {
        id: 1,
        name: 'João Silva Updated',
        email: 'joao@example.com',
        balance: 2000.00,
      };

      const updatedUser = new User(updateUserData);
      mockApiClient.patch.mockResolvedValue(updateUserData);

      const result = await userRepository.update(updatedUser);
      expect(result.balance).toBe(2000.00);

      // Update balance
      mockApiClient.patch.mockResolvedValue({});
      await userRepository.updateBalance(1, 3000.00);
      expect(mockApiClient.patch).toHaveBeenCalledWith('/users/1', { balance: 3000.00 });
    });

    test('should handle error scenarios in user lifecycle', async () => {
      // Try to find non-existent user by email
      mockApiClient.get.mockResolvedValue([]);
      const notFoundByEmail = await userRepository.findByEmail('nonexistent@example.com');
      expect(notFoundByEmail).toBeNull();

      // Try to find non-existent user by id
      mockApiClient.get.mockRejectedValue(new Error('Not Found'));
      const notFoundById = await userRepository.findById(999);
      expect(notFoundById).toBeNull();

      // Try to create user with API error
      const userData = {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        balance: 1000.00,
      };

      const user = new User(userData);
      mockApiClient.post.mockRejectedValue(new Error('API Error'));

      await expect(userRepository.create(user)).rejects.toThrow('Erro ao criar usuário');
    });
  });
});
