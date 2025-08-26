import { mockApi, mockData, setupApiMocks, clearApiMocks } from '../__mocks__/api';


describe('API Integration Tests', () => {
  beforeEach(() => {
    
    setupApiMocks();
  });

  afterEach(() => {
    
    clearApiMocks();
  });

  describe('User API', () => {
    it('should fetch all users successfully', async () => {
      const response = await mockApi.users.get();
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData.users);
      expect(mockApi.users.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch user by ID successfully', async () => {
      const userId = 1;
      const response = await mockApi.users.getById(userId);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(userId);
      expect(mockApi.users.getById).toHaveBeenCalledWith(userId);
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = 999;
      
      await expect(mockApi.users.getById(nonExistentId)).rejects.toEqual({
        status: 404,
        message: 'User not found'
      });
    });

    it('should login user with valid credentials', async () => {
      const credentials = {
        email: 'test@test.com',
        password: '123456'
      };
      
      const response = await mockApi.users.login(credentials);
      
      expect(response.status).toBe(200);
      expect(response.data.user.email).toBe(credentials.email);
      expect(response.data.token).toBe('mock-jwt-token');
      expect(mockApi.users.login).toHaveBeenCalledWith(credentials);
    });

    it('should reject login with invalid credentials', async () => {
      const invalidCredentials = {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      };
      
      await expect(mockApi.users.login(invalidCredentials)).rejects.toEqual({
        status: 401,
        message: 'Invalid credentials'
      });
    });

    it('should register new user successfully', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@test.com',
        password: '123456',
        transactionPassword: '123456'
      };
      
      const response = await mockApi.users.register(newUser);
      
      expect(response.status).toBe(201);
      expect(response.data.user.name).toBe(newUser.name);
      expect(response.data.user.email).toBe(newUser.email);
      expect(response.data.token).toBe('mock-jwt-token');
      expect(mockApi.users.register).toHaveBeenCalledWith(newUser);
    });
  });

  describe('Transaction API', () => {
    it('should fetch all transactions successfully', async () => {
      const response = await mockApi.transactions.get();
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData.transactions);
      expect(mockApi.transactions.get).toHaveBeenCalledTimes(1);
    });

    it('should fetch transaction by ID successfully', async () => {
      const transactionId = 1;
      const response = await mockApi.transactions.getById(transactionId);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(transactionId);
      expect(mockApi.transactions.getById).toHaveBeenCalledWith(transactionId);
    });

    it('should return 404 for non-existent transaction', async () => {
      const nonExistentId = 999;
      
      await expect(mockApi.transactions.getById(nonExistentId)).rejects.toEqual({
        status: 404,
        message: 'Transaction not found'
      });
    });

    it('should fetch transactions by user ID successfully', async () => {
      const userId = 1;
      const response = await mockApi.transactions.getByUserId(userId);
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        mockData.transactions.filter(t => t.userId === userId)
      );
      expect(mockApi.transactions.getByUserId).toHaveBeenCalledWith(userId);
    });

    it('should create new transaction successfully', async () => {
      const newTransaction = {
        userId: 1,
        type: 'PIX',
        amount: 50,
        recipientName: 'Test Recipient',
        recipientDocument: '123.456.789-00',
        pixKey: 'recipient@test.com'
      };
      
      const response = await mockApi.transactions.post(newTransaction);
      
      expect(response.status).toBe(201);
      expect(response.data.type).toBe(newTransaction.type);
      expect(response.data.amount).toBe(newTransaction.amount);
      expect(response.data.userId).toBe(newTransaction.userId);
      expect(mockApi.transactions.post).toHaveBeenCalledWith(newTransaction);
    });
  });

  describe('Authentication API', () => {
    it('should validate token successfully', async () => {
      const response = await mockApi.auth.validate();
      
      expect(response.status).toBe(200);
      expect(response.data.valid).toBe(true);
      expect(mockApi.auth.validate).toHaveBeenCalledTimes(1);
    });

    it('should logout successfully', async () => {
      const response = await mockApi.auth.logout();
      
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Logged out successfully');
      expect(mockApi.auth.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across API calls', async () => {
      
      const initialUsers = await mockApi.users.get();
      const initialTransactions = await mockApi.transactions.get();
      
      expect(initialUsers.data).toHaveLength(mockData.users.length);
      expect(initialTransactions.data).toHaveLength(mockData.transactions.length);
      
      
      const newUser = {
        name: 'Consistency Test User',
        email: 'consistency@test.com',
        password: '123456',
        transactionPassword: '123456'
      };
      
      await mockApi.users.register(newUser);
      
      
      const updatedUsers = await mockApi.users.get();
      expect(updatedUsers.data).toHaveLength(3); 
      
      
      const loginResponse = await mockApi.users.login({
        email: newUser.email,
        password: newUser.password
      });
      
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.data.user.email).toBe(newUser.email);
    });
  });
});
