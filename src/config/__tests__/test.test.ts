import { testConfig, getTestConfig } from '../test';

describe('Test Config Module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('testConfig', () => {
    test('should have apiUrl property', () => {
      expect(testConfig).toHaveProperty('apiUrl');
      expect(testConfig.apiUrl).toBe('http://localhost:3001');
    });

    test('should have testDb property with users', () => {
      expect(testConfig).toHaveProperty('testDb');
      expect(testConfig.testDb).toHaveProperty('users');
      expect(Array.isArray(testConfig.testDb.users)).toBe(true);
      expect(testConfig.testDb.users.length).toBeGreaterThan(0);
    });

    test('should have testDb property with transactions', () => {
      expect(testConfig.testDb).toHaveProperty('transactions');
      expect(Array.isArray(testConfig.testDb.transactions)).toBe(true);
      expect(testConfig.testDb.transactions.length).toBeGreaterThan(0);
    });

    test('should have timeouts property', () => {
      expect(testConfig).toHaveProperty('timeouts');
      expect(testConfig.timeouts).toHaveProperty('api');
      expect(testConfig.timeouts).toHaveProperty('websocket');
      expect(testConfig.timeouts).toHaveProperty('render');
    });

    test('should have mocks property', () => {
      expect(testConfig).toHaveProperty('mocks');
      expect(testConfig.mocks).toHaveProperty('enableApiMocks');
      expect(testConfig.mocks).toHaveProperty('enableWebSocketMocks');
      expect(testConfig.mocks).toHaveProperty('enableLocalStorageMocks');
    });

    test('should have valid test user data', () => {
      const users = testConfig.testDb.users;
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('email');
      expect(users[0]).toHaveProperty('password');
      expect(users[0]).toHaveProperty('balance');
      expect(users[0]).toHaveProperty('transactionPassword');
    });

    test('should have valid test transaction data', () => {
      const transactions = testConfig.testDb.transactions;
      expect(transactions[0]).toHaveProperty('id');
      expect(transactions[0]).toHaveProperty('userId');
      expect(transactions[0]).toHaveProperty('type');
      expect(transactions[0]).toHaveProperty('amount');
      expect(transactions[0]).toHaveProperty('recipientName');
      expect(transactions[0]).toHaveProperty('recipientDocument');
      expect(transactions[0]).toHaveProperty('date');
      expect(transactions[0]).toHaveProperty('balance');
    });

    test('should have reasonable timeout values', () => {
      expect(testConfig.timeouts.api).toBeGreaterThan(0);
      expect(testConfig.timeouts.websocket).toBeGreaterThan(0);
      expect(testConfig.timeouts.render).toBeGreaterThan(0);
    });

    test('should have mock settings enabled by default', () => {
      expect(testConfig.mocks.enableApiMocks).toBe(true);
      expect(testConfig.mocks.enableWebSocketMocks).toBe(true);
      expect(testConfig.mocks.enableLocalStorageMocks).toBe(true);
    });
  });

  describe('getTestConfig', () => {
    test('should return test config when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      
      const config = getTestConfig();
      
      expect(config).toHaveProperty('apiUrl');
      expect(config).toHaveProperty('testDb');
      expect(config).toHaveProperty('timeouts');
      expect(config).toHaveProperty('mocks');
    });

    test('should enable all mocks when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      
      const config = getTestConfig();
      
      expect(config.mocks.enableApiMocks).toBe(true);
      expect(config.mocks.enableWebSocketMocks).toBe(true);
      expect(config.mocks.enableLocalStorageMocks).toBe(true);
    });

    test('should return test config when NODE_ENV is not test', () => {
      process.env.NODE_ENV = 'development';
      
      const config = getTestConfig();
      
      expect(config).toHaveProperty('apiUrl');
      expect(config).toHaveProperty('testDb');
      expect(config).toHaveProperty('timeouts');
      expect(config).toHaveProperty('mocks');
    });

    test('should return test config when NODE_ENV is undefined', () => {
      delete process.env.NODE_ENV;
      
      const config = getTestConfig();
      
      expect(config).toHaveProperty('apiUrl');
      expect(config).toHaveProperty('testDb');
      expect(config).toHaveProperty('timeouts');
      expect(config).toHaveProperty('mocks');
    });

    test('should return test config when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      
      const config = getTestConfig();
      
      expect(config).toHaveProperty('apiUrl');
      expect(config).toHaveProperty('testDb');
      expect(config).toHaveProperty('timeouts');
      expect(config).toHaveProperty('mocks');
    });

    test('should have same structure as testConfig', () => {
      process.env.NODE_ENV = 'test';
      
      const config = getTestConfig();
      
      expect(config.apiUrl).toBe(testConfig.apiUrl);
      expect(config.testDb).toEqual(testConfig.testDb);
      expect(config.timeouts).toEqual(testConfig.timeouts);
      expect(config.mocks).toEqual(testConfig.mocks);
    });

    test('should be a function', () => {
      expect(typeof getTestConfig).toBe('function');
    });

    test('should return an object', () => {
      const config = getTestConfig();
      expect(typeof config).toBe('object');
      expect(config).not.toBeNull();
    });
  });

  describe('Test data validation', () => {
    test('should have unique user IDs', () => {
      const userIds = testConfig.testDb.users.map(user => user.id);
      const uniqueIds = new Set(userIds);
      expect(uniqueIds.size).toBe(userIds.length);
    });

    test('should have unique transaction IDs', () => {
      const transactionIds = testConfig.testDb.transactions.map(transaction => transaction.id);
      const uniqueIds = new Set(transactionIds);
      expect(uniqueIds.size).toBe(transactionIds.length);
    });

    test('should have valid email formats in test users', () => {
      const users = testConfig.testDb.users;
      users.forEach(user => {
        expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    test('should have positive balance values', () => {
      const users = testConfig.testDb.users;
      users.forEach(user => {
        expect(user.balance).toBeGreaterThanOrEqual(0);
      });
    });

    test('should have positive transaction amounts', () => {
      const transactions = testConfig.testDb.transactions;
      transactions.forEach(transaction => {
        expect(transaction.amount).toBeGreaterThan(0);
      });
    });

    test('should have valid transaction types', () => {
      const transactions = testConfig.testDb.transactions;
      const validTypes = ['PIX', 'TED', 'BANK_TRANSFER'];
      transactions.forEach(transaction => {
        expect(validTypes).toContain(transaction.type);
      });
    });
  });
});
