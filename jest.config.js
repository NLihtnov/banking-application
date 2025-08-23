module.exports = {
  // Configuração do ambiente de teste
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Configuração de cobertura
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/**/index.ts',
    '!src/**/index.tsx',
    '!src/config/index.ts',
    '!src/domain/index.ts',
    '!src/infrastructure/index.ts',
    '!src/hooks/index.ts',
    '!src/store/index.ts',
    '!src/utils/index.ts',
    '!src/application/index.ts',
    '!src/components/**/index.ts',
    '!src/components/**/index.tsx',
  ],
  
  // Thresholds de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Configuração de cobertura
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json',
    'json-summary'
  ],
  
  // Mapeamento de módulos
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
  },
  
  // Configurações de transformação
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json'
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Extensões de arquivo para testes
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  
  // Arquivos ignorados
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/',
  ],
  
  // Configuração para transformar módulos ES6
  transformIgnorePatterns: [
    'node_modules/(?!(axios|jose)/)',
  ],
  
  // Configurações adicionais
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // Configuração para arquivos estáticos
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Configuração para CSS e arquivos estáticos
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '^axios$': '<rootDir>/src/__mocks__/axios.ts',
    '^jose$': '<rootDir>/src/__mocks__/jose.ts',
  },
};
