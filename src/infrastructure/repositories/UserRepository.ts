import { User, UserProps } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ApiClient } from '../api/ApiClient';

export class UserRepository implements IUserRepository {
  constructor(private apiClient: ApiClient) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.apiClient.get<UserProps[]>(`/users?email=${email}`);
      if (users.length === 0) {
        return null;
      }
      return new User(users[0]);
    } catch (error) {
      throw new Error('Erro ao buscar usuário por email');
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const userData = await this.apiClient.get<UserProps>(`/users/${id}`);
      return new User(userData);
    } catch (error) {
      return null;
    }
  }

  async create(user: User): Promise<User> {
    try {
      const userData = await this.apiClient.post<UserProps>('/users', user.toJSON());
      return new User(userData);
    } catch (error) {
      throw new Error('Erro ao criar usuário');
    }
  }

  async update(user: User): Promise<User> {
    try {
      const userData = await this.apiClient.patch<UserProps>(`/users/${user.id}`, user.toJSON());
      return new User(userData);
    } catch (error) {
      throw new Error('Erro ao atualizar usuário');
    }
  }

  async updateBalance(userId: number, newBalance: number): Promise<void> {
    try {
      await this.apiClient.patch(`/users/${userId}`, { balance: newBalance });
    } catch (error) {
      throw new Error('Erro ao atualizar saldo');
    }
  }
}
