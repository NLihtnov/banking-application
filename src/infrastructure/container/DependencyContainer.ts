import { ApiClient } from '../api/ApiClient';
import { UserRepository } from '../repositories/UserRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { AuthenticationUseCase } from '../../application/usecases/AuthenticationUseCase';
import { TransactionUseCase } from '../../application/usecases/TransactionUseCase';
import { config } from '../../config/index';

export class DependencyContainer {
  private static instance: DependencyContainer;
  private apiClient: ApiClient;
  private userRepository: UserRepository;
  private transactionRepository: TransactionRepository;
  private authenticationUseCase: AuthenticationUseCase;
  private transactionUseCase: TransactionUseCase;

  private constructor() {
    this.apiClient = new ApiClient(config.baseURL);
    this.userRepository = new UserRepository(this.apiClient);
    this.transactionRepository = new TransactionRepository(this.apiClient);
    this.authenticationUseCase = new AuthenticationUseCase(this.userRepository);
    this.transactionUseCase = new TransactionUseCase(this.transactionRepository, this.userRepository);
  }

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  getAuthenticationUseCase(): AuthenticationUseCase {
    return this.authenticationUseCase;
  }

  getTransactionUseCase(): TransactionUseCase {
    return this.transactionUseCase;
  }

  getUserRepository(): UserRepository {
    return this.userRepository;
  }

  getTransactionRepository(): TransactionRepository {
    return this.transactionRepository;
  }
}
