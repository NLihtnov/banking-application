import '@testing-library/jest-dom';
import '../jest.setup';
import { setupTestEnvironment } from './test-utils';

// Configuração automática do ambiente de teste
setupTestEnvironment();

// Configurações adicionais para testes
beforeEach(() => {
  // Limpa todos os mocks antes de cada teste
  jest.clearAllMocks();
  
  // Reseta o fetch mock
  if (global.fetch) {
    (global.fetch as jest.Mock).mockClear();
  }
});

afterEach(() => {
  // Limpa todos os mocks após cada teste
  jest.clearAllMocks();
});
