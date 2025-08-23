import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { JwtService } from '../../services/JwtService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  transactionPassword: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export class AuthenticationUseCase {
  constructor(private userRepository: IUserRepository) {}

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(credentials.email);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.password !== credentials.password) {
      throw new Error('Senha incorreta');
    }

    const token = await JwtService.generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    
    return { user, token };
  }

  async register(data: RegisterData): Promise<AuthResult> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const user = new User({
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      balance: 1000.00,
      transactionPassword: data.transactionPassword,
    });

    const createdUser = await this.userRepository.create(user);
    const token = await JwtService.generateToken({
      userId: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
    });
    
    return { user: createdUser, token };
  }

  async getCurrentUser(token: string): Promise<User> {
    const payload = await JwtService.verifyToken(token);
    const user = await this.userRepository.findById(payload.userId);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }
}
