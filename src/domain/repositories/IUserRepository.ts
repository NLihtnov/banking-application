import { User } from '../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  updateBalance(userId: number, newBalance: number): Promise<void>;
}
