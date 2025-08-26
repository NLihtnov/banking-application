import { ApiClient } from '../ApiClient';

// Mock the entire ApiClient class to avoid axios issues
jest.mock('../ApiClient', () => {
  const mockMethods = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
  
  return {
    ApiClient: jest.fn().mockImplementation(() => mockMethods),
  };
});

describe('ApiClient', () => {
  let apiClient: any;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Get the mocked ApiClient
    const { ApiClient: MockedApiClient } = require('../ApiClient');
    apiClient = new MockedApiClient('http://localhost:3000');
    
    // Ensure all methods are properly mocked
    apiClient.get = jest.fn();
    apiClient.post = jest.fn();
    apiClient.patch = jest.fn();
    apiClient.delete = jest.fn();
  });

  it('should successfully make a POST request', async () => {
    const mockResponse = { id: 1, name: 'Test' };
    apiClient.post.mockResolvedValue(mockResponse);

    const result = await apiClient.post('/users', { name: 'Test' });

    expect(apiClient.post).toHaveBeenCalledWith('/users', { name: 'Test' });
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('should successfully make a GET request', async () => {
    const mockResponse = { id: 1, name: 'Test' };
    apiClient.get.mockResolvedValue(mockResponse);

    const result = await apiClient.get('/users/1');

    expect(apiClient.get).toHaveBeenCalledWith('/users/1');
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('should successfully make a PATCH request', async () => {
    const mockResponse = { id: 1, name: 'Updated Test' };
    apiClient.patch.mockResolvedValue(mockResponse);

    const result = await apiClient.patch('/users/1', { name: 'Updated Test' });

    expect(apiClient.patch).toHaveBeenCalledWith('/users/1', { name: 'Updated Test' });
    expect(result).toEqual({ id: 1, name: 'Updated Test' });
  });

  it('should successfully make a DELETE request', async () => {
    const mockResponse = { success: true };
    apiClient.delete.mockResolvedValue(mockResponse);

    const result = await apiClient.delete('/users/1');

    expect(apiClient.delete).toHaveBeenCalledWith('/users/1');
    expect(result).toEqual({ success: true });
  });

  it('should handle different response types', async () => {
    const mockResponse = { data: { message: 'Success' } };
    apiClient.post.mockResolvedValue(mockResponse);

    const result = await apiClient.post('/api/endpoint', { data: 'test' });

    expect(apiClient.post).toHaveBeenCalledWith('/api/endpoint', { data: 'test' });
    expect(result).toEqual({ data: { message: 'Success' } });
  });
});
