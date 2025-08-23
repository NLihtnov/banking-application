import { testConfig } from '../config/test';

// Mock da API simulada para testes
export const mockApi = {
  // Mock para usuários
  users: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
  },
  
  // Mock para transações
  transactions: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    getByUserId: jest.fn(),
  },
  
  // Mock para autenticação
  auth: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
    validate: jest.fn(),
  }
};

// Dados mockados para testes
export const mockData = {
  users: testConfig.testDb.users,
  transactions: testConfig.testDb.transactions,
  
  // Usuário padrão para testes
  defaultUser: {
    id: 1,
    name: 'Test User',
    email: 'test@test.com',
    password: '123456',
    balance: 1000,
    transactionPassword: '123456'
  },
  
  // Transação padrão para testes
  defaultTransaction: {
    id: 1,
    userId: 1,
    type: 'PIX',
    amount: 100,
    recipientName: 'Recipient',
    recipientDocument: '123.456.789-00',
    pixKey: 'recipient@test.com',
    date: '2024-01-15T10:30:00.000Z',
    balance: 900
  }
};

// Configuração dos mocks da API
export const setupApiMocks = () => {
  // Mock para GET /users
  mockApi.users.get.mockResolvedValue({
    data: mockData.users,
    status: 200,
    ok: true
  });
  
  // Mock para GET /users/:id
  mockApi.users.getById.mockImplementation((id: number) => {
    const user = mockData.users.find(u => u.id === id);
    if (user) {
      return Promise.resolve({
        data: user,
        status: 200,
        ok: true
      });
    }
    return Promise.reject({
      status: 404,
      message: 'User not found'
    });
  });
  
  // Mock para POST /users/login
  mockApi.users.login.mockImplementation((credentials: { email: string; password: string }) => {
    const user = mockData.users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      return Promise.resolve({
        data: {
          user: { ...user, password: undefined },
          token: 'mock-jwt-token'
        },
        status: 200,
        ok: true
      });
    }
    
    return Promise.reject({
      status: 401,
      message: 'Invalid credentials'
    });
  });
  
  // Mock para POST /users/register
  mockApi.users.register.mockImplementation((userData: any) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      balance: 0
    };
    
    mockData.users.push(newUser);
    
    return Promise.resolve({
      data: {
        user: { ...newUser, password: undefined },
        token: 'mock-jwt-token'
      },
      status: 201,
      ok: true
    });
  });
  
  // Mock para GET /transactions
  mockApi.transactions.get.mockResolvedValue({
    data: mockData.transactions,
    status: 200,
    ok: true
  });
  
  // Mock para GET /transactions/:id
  mockApi.transactions.getById.mockImplementation((id: number) => {
    const transaction = mockData.transactions.find(t => t.id === id);
    if (transaction) {
      return Promise.resolve({
        data: transaction,
        status: 200,
        ok: true
      });
    }
    return Promise.reject({
      status: 404,
      message: 'Transaction not found'
    });
  });
  
  // Mock para GET /transactions/user/:userId
  mockApi.transactions.getByUserId.mockImplementation((userId: number) => {
    const userTransactions = mockData.transactions.filter(t => t.userId === userId);
    return Promise.resolve({
      data: userTransactions,
      status: 200,
      ok: true
    });
  });
  
  // Mock para POST /transactions
  mockApi.transactions.post.mockImplementation((transactionData: any) => {
    const newTransaction = {
      id: Date.now(),
      ...transactionData,
      date: new Date().toISOString()
    };
    
    mockData.transactions.push(newTransaction);
    
    return Promise.resolve({
      data: newTransaction,
      status: 201,
      ok: true
    });
  });
  
  // Mock para autenticação
  mockApi.auth.login.mockImplementation((credentials: { email: string; password: string }) => {
    const user = mockData.users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      return Promise.resolve({
        data: {
          user: { ...user, password: undefined },
          token: 'mock-jwt-token'
        },
        status: 200,
        ok: true
      });
    }
    
    return Promise.reject({
      status: 401,
      message: 'Invalid credentials'
    });
  });
  
  mockApi.auth.register.mockImplementation((userData: any) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      balance: 0
    };
    
    mockData.users.push(newUser);
    
    return Promise.resolve({
      data: {
        user: { ...newUser, password: undefined },
        token: 'mock-jwt-token'
      },
      status: 201,
      ok: true
    });
  });
  
  mockApi.auth.logout.mockResolvedValue({
    data: { message: 'Logged out successfully' },
    status: 200,
    ok: true
  });
  
  mockApi.auth.validate.mockResolvedValue({
    data: { valid: true },
    status: 200,
    ok: true
  });
};

// Limpeza dos mocks
export const clearApiMocks = () => {
  Object.values(mockApi).forEach(api => {
    if (typeof api === 'object' && api !== null) {
      Object.values(api).forEach(mock => {
        if (typeof mock === 'function' && 'mockClear' in mock) {
          mock.mockClear();
        }
      });
    }
  });
  
  // Restaura dados originais
  mockData.users = [...testConfig.testDb.users];
  mockData.transactions = [...testConfig.testDb.transactions];
};

// Reset dos mocks
export const resetApiMocks = () => {
  Object.values(mockApi).forEach(api => {
    if (typeof api === 'object' && api !== null) {
      Object.values(api).forEach(mock => {
        if (typeof mock === 'function' && 'mockReset' in mock) {
          mock.mockReset();
        }
      });
    }
  });
  
  // Restaura dados originais
  mockData.users = [...testConfig.testDb.users];
  mockData.transactions = [...testConfig.testDb.transactions];
};
