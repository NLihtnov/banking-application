// Configuração específica para testes
export const testConfig = {
  // URL da API simulada para testes
  apiUrl: 'http://localhost:3001',
  
  // Configurações do banco de dados de teste
  testDb: {
    users: [
      {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        password: '123456',
        balance: 1000,
        transactionPassword: '123456'
      },
      {
        id: 2,
        name: 'Another User',
        email: 'another@test.com',
        password: '123456',
        balance: 500,
        transactionPassword: '123456'
      }
    ],
    transactions: [
      {
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
    ]
  },
  
  // Timeouts para testes
  timeouts: {
    api: 5000,
    websocket: 3000,
    render: 1000
  },
  
  // Configurações de mock
  mocks: {
    enableApiMocks: true,
    enableWebSocketMocks: true,
    enableLocalStorageMocks: true
  }
};

// Configuração para ambiente de teste
export const getTestConfig = () => {
  const isTest = process.env.NODE_ENV === 'test';
  
  if (isTest) {
    return {
      ...testConfig,
      // Em testes, sempre usar mocks
      mocks: {
        enableApiMocks: true,
        enableWebSocketMocks: true,
        enableLocalStorageMocks: true
      }
    };
  }
  
  return testConfig;
};
