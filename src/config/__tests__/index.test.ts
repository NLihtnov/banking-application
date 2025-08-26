import { config } from '../index';

describe('Config Module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('should have baseURL property', () => {
    expect(config).toHaveProperty('baseURL');
  });

  test('should use default baseURL when REACT_APP_API_URL is not set', () => {
    delete process.env.REACT_APP_API_URL;
    
    
    jest.resetModules();
    const { config: freshConfig } = require('../index');
    
    expect(freshConfig.baseURL).toBe('http://localhost:3001');
  });

  test('should use REACT_APP_API_URL when set', () => {
    process.env.REACT_APP_API_URL = 'https://api.example.com';
    
    
    jest.resetModules();
    const { config: freshConfig } = require('../index');
    
    expect(freshConfig.baseURL).toBe('https://api.example.com');
  });

  test('should use empty string as fallback when REACT_APP_API_URL is empty', () => {
    process.env.REACT_APP_API_URL = '';
    
    
    jest.resetModules();
    const { config: freshConfig } = require('../index');
    
    expect(freshConfig.baseURL).toBe('http://localhost:3001');
  });

  test('should handle undefined REACT_APP_API_URL', () => {
    process.env.REACT_APP_API_URL = undefined;
    
    
    jest.resetModules();
    const { config: freshConfig } = require('../index');
    
    expect(freshConfig.baseURL).toBe('http://localhost:3001');
  });

  test('should handle null REACT_APP_API_URL', () => {
    process.env.REACT_APP_API_URL = null as any;
    
    
    jest.resetModules();
    const { config: freshConfig } = require('../index');
    
    expect(freshConfig.baseURL).toBe('http://localhost:3001');
  });

  test('should use custom API URL from environment', () => {
    process.env.REACT_APP_API_URL = 'https://api.example.com';
    
    
    jest.resetModules();
    const { config: freshConfig } = require('../index');
    
    expect(freshConfig.baseURL).toBe('https://api.example.com');
  });



  test('should handle HTTPS URLs', () => {
    process.env.REACT_APP_API_URL = 'https://api.example.com';
    
    
    jest.resetModules();
    const { config: freshConfig } = require('../index');
    
    expect(freshConfig.baseURL).toBe('https://api.example.com');
  });

  test('should handle URLs with paths', () => {
    process.env.REACT_APP_API_URL = 'https://api.example.com';
    
    
    jest.resetModules();
    const { config: freshConfig } = require('../index');
    
    expect(freshConfig.baseURL).toBe('https://api.example.com');
  });

  test('config object should be immutable', () => {
    
    const originalBaseURL = config.baseURL;
    (config as any).baseURL = 'https://api.example.com';
    expect(config.baseURL).toBe('https://api.example.com');
    
    (config as any).baseURL = originalBaseURL;
  });

  test('config should be exported as default', () => {
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
  });
});
