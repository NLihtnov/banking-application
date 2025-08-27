import { config } from '../index';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use default API URL when REACT_APP_API_URL is not set', () => {
    delete process.env.REACT_APP_API_URL;
    
    // Re-import to get fresh config
    const { config: freshConfig } = require('../index');
    expect(freshConfig.baseURL).toBe('https://my-json-server.typicode.com/NLihtnov/banking-application');
  });

  it('should use environment variable when REACT_APP_API_URL is set', () => {
    process.env.REACT_APP_API_URL = 'http://localhost:3001';
    
    // Re-import to get fresh config
    const { config: freshConfig } = require('../index');
    expect(freshConfig.baseURL).toBe('http://localhost:3001');
  });

  it('should use default WebSocket URL when REACT_APP_WEBSOCKET_URL is not set', () => {
    delete process.env.REACT_APP_WEBSOCKET_URL;
    
    // Re-import to get fresh config
    const { config: freshConfig } = require('../index');
    expect(freshConfig.webSocketURL).toBe('ws://localhost:3002');
  });

  it('should use environment variable when REACT_APP_WEBSOCKET_URL is set', () => {
    process.env.REACT_APP_WEBSOCKET_URL = 'ws://localhost:3003';
    
    // Re-import to get fresh config
    const { config: freshConfig } = require('../index');
    expect(freshConfig.webSocketURL).toBe('ws://localhost:3003');
  });

  it('should use default API URL when REACT_APP_API_URL is empty string', () => {
    process.env.REACT_APP_API_URL = '';
    
    // Re-import to get fresh config
    const { config: freshConfig } = require('../index');
    expect(freshConfig.baseURL).toBe('https://my-json-server.typicode.com/NLihtnov/banking-application');
  });
});
