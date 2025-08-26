export const testConfig = {
  apiUrl: 'http://localhost:3001',
  
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
  
  timeouts: {
    api: 5000,
    websocket: 3000,
    render: 1000
  },
  
  mocks: {
    enableApiMocks: true,
    enableWebSocketMocks: true,
    enableLocalStorageMocks: true
  }
};

export const getTestConfig = () => {
  const isTest = process.env.NODE_ENV === 'test';
  
  if (isTest) {
    return {
      ...testConfig,
      mocks: {
        enableApiMocks: true,
        enableWebSocketMocks: true,
        enableLocalStorageMocks: true
      }
    };
  }
  
  return testConfig;
};

