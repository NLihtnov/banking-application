import { webSocketService, NotificationData, WebSocketMessage } from '../WebSocketService';

// Mock WebSocket
const mockWebSocket = {
  onopen: jest.fn(),
  onmessage: jest.fn(),
  onclose: jest.fn(),
  onerror: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1, // OPEN
};

// Mock global WebSocket
(global as any).WebSocket = jest.fn().mockImplementation(() => mockWebSocket);

// Mock environment variables
const originalEnv = process.env;

describe('WebSocketService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    process.env = { ...originalEnv };
    
    // Reset the service state
    (webSocketService as any).socket = null;
    (webSocketService as any).reconnectAttempts = 0;
    (webSocketService as any).isConnected = false;
    (webSocketService as any).token = null;
    (webSocketService as any).listeners.clear();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.useRealTimers();
  });

  describe('connect', () => {
    it('should connect successfully with valid token', async () => {
      const token = 'test-token';
      
      // Mock the WebSocket constructor to immediately call onopen
      ((global as any).WebSocket as jest.Mock).mockImplementation(() => {
        const ws = { ...mockWebSocket };
        // Simulate immediate connection
        setTimeout(() => ws.onopen(), 0);
        return ws;
      });

      const connectPromise = webSocketService.connect(token);
      await connectPromise;

      expect((global as any).WebSocket).toHaveBeenCalledWith(
        expect.stringContaining('ws://localhost:3002/ws?token=test-token')
      );
      expect((webSocketService as any).isConnected).toBe(true);
      expect((webSocketService as any).token).toBe(token);
    });

    it('should connect to production URL in production environment', async () => {
      process.env.NODE_ENV = 'production';
      const token = 'test-token';
      
      ((global as any).WebSocket as jest.Mock).mockImplementation(() => {
        const ws = { ...mockWebSocket };
        setTimeout(() => ws.onopen(), 0);
        return ws;
      });

      const connectPromise = webSocketService.connect(token);
      await connectPromise;

      expect((global as any).WebSocket).toHaveBeenCalledWith(
        expect.stringContaining('wss://api.magnumbank.com/ws?token=test-token')
      );
    });

    it('should handle connection error', async () => {
      const token = 'test-token';
      const error = new Error('Connection failed');
      
      ((global as any).WebSocket as jest.Mock).mockImplementation(() => {
        const ws = { ...mockWebSocket };
        setTimeout(() => ws.onerror(error), 0);
        return ws;
      });

      const connectPromise = webSocketService.connect(token);
      await expect(connectPromise).rejects.toThrow('Connection failed');
    });

    it('should handle WebSocket constructor error', async () => {
      ((global as any).WebSocket as jest.Mock).mockImplementation(() => {
        throw new Error('WebSocket not supported');
      });

      const token = 'test-token';
      
      await expect(webSocketService.connect(token)).rejects.toThrow('WebSocket not supported');
    });
  });

  describe('disconnect', () => {
    it('should disconnect and clean up resources', () => {
      // Setup connected state
      (webSocketService as any).socket = mockWebSocket;
      (webSocketService as any).isConnected = true;
      (webSocketService as any).token = 'test-token';

      webSocketService.disconnect();

      expect(mockWebSocket.close).toHaveBeenCalledWith(1000, 'Desconexão manual');
      expect((webSocketService as any).socket).toBeNull();
      expect((webSocketService as any).isConnected).toBe(false);
      expect((webSocketService as any).listeners.size).toBe(0);
    });

    it('should handle disconnect when not connected', () => {
      webSocketService.disconnect();
      
      expect(mockWebSocket.close).not.toHaveBeenCalled();
    });
  });

  describe('message handling', () => {
    beforeEach(() => {
      (webSocketService as any).socket = mockWebSocket;
      (webSocketService as any).isConnected = true;
    });

    it('should handle notification message', () => {
      const mockCallback = jest.fn();
      webSocketService.on('notification', mockCallback);

      const message: WebSocketMessage = {
        type: 'notification',
        payload: { id: '1', title: 'Test' },
        timestamp: new Date().toISOString()
      };

      // Simulate message event
      (webSocketService as any).handleMessage(message);

      expect(mockCallback).toHaveBeenCalledWith(message.payload);
    });

    it('should handle transaction_update message', () => {
      const mockCallback = jest.fn();
      webSocketService.on('transaction_update', mockCallback);

      const message: WebSocketMessage = {
        type: 'transaction_update',
        payload: { id: '1', amount: 100 },
        timestamp: new Date().toISOString()
      };

      (webSocketService as any).handleMessage(message);

      expect(mockCallback).toHaveBeenCalledWith(message.payload);
    });

    it('should handle balance_update message', () => {
      const mockCallback = jest.fn();
      webSocketService.on('balance_update', mockCallback);

      const message: WebSocketMessage = {
        type: 'balance_update',
        payload: { balance: 1000 },
        timestamp: new Date().toISOString()
      };

      (webSocketService as any).handleMessage(message);

      expect(mockCallback).toHaveBeenCalledWith(message.payload);
    });

    it('should handle heartbeat message', () => {
      const mockCallback = jest.fn();
      webSocketService.on('message', mockCallback);

      const message: WebSocketMessage = {
        type: 'heartbeat',
        payload: { timestamp: new Date().toISOString() },
        timestamp: new Date().toISOString()
      };

      (webSocketService as any).handleMessage(message);

      expect(mockCallback).toHaveBeenCalledWith(message);
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"heartbeat"')
      );
    });

    it('should handle unknown message type', () => {
      const mockCallback = jest.fn();
      webSocketService.on('message', mockCallback);

      const message: WebSocketMessage = {
        type: 'unknown_type' as any,
        payload: {},
        timestamp: new Date().toISOString()
      };

      (webSocketService as any).handleMessage(message);

      expect(mockCallback).toHaveBeenCalledWith(message);
    });
  });

  describe('event handling', () => {
    it('should add event listener', () => {
      const mockCallback = jest.fn();
      webSocketService.on('test-event', mockCallback);

      expect((webSocketService as any).listeners.get('test-event')).toContain(mockCallback);
    });

    it('should remove event listener', () => {
      const mockCallback = jest.fn();
      webSocketService.on('test-event', mockCallback);
      webSocketService.off('test-event', mockCallback);

      expect((webSocketService as any).listeners.get('test-event')).not.toContain(mockCallback);
    });

    it('should emit event to all listeners', () => {
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();
      
      webSocketService.on('test-event', mockCallback1);
      webSocketService.on('test-event', mockCallback2);

      // Trigger emit directly
      (webSocketService as any).emit('test-event', 'test-data');

      expect(mockCallback1).toHaveBeenCalledWith('test-data');
      expect(mockCallback2).toHaveBeenCalledWith('test-data');
    });

    it('should handle event with no listeners', () => {
      expect(() => {
        (webSocketService as any).emit('non-existent-event');
      }).not.toThrow();
    });
  });

  describe('send', () => {
    it('should send message when connected', () => {
      (webSocketService as any).socket = mockWebSocket;
      (webSocketService as any).isConnected = true;

      const message: WebSocketMessage = {
        type: 'notification',
        payload: { id: '1' },
        timestamp: new Date().toISOString()
      };

      webSocketService.send(message);

      expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(message));
    });

    it('should not send message when not connected', () => {
      const message: WebSocketMessage = {
        type: 'notification',
        payload: { id: '1' },
        timestamp: new Date().toISOString()
      };

      webSocketService.send(message);

      expect(mockWebSocket.send).not.toHaveBeenCalled();
    });

    it('should not send message when socket is null', () => {
      (webSocketService as any).isConnected = true;
      (webSocketService as any).socket = null;

      const message: WebSocketMessage = {
        type: 'notification',
        payload: { id: '1' },
        timestamp: new Date().toISOString()
      };

      webSocketService.send(message);

      expect(mockWebSocket.send).not.toHaveBeenCalled();
    });
  });

  describe('getConnectionStatus', () => {
    it('should return true when connected', () => {
      (webSocketService as any).isConnected = true;
      expect(webSocketService.getConnectionStatus()).toBe(true);
    });

    it('should return false when not connected', () => {
      (webSocketService as any).isConnected = false;
      expect(webSocketService.getConnectionStatus()).toBe(false);
    });
  });

  describe('markNotificationAsRead', () => {
    it('should send mark_read message', () => {
      (webSocketService as any).socket = mockWebSocket;
      (webSocketService as any).isConnected = true;

      webSocketService.markNotificationAsRead('notification-1');

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"action":"mark_read"')
      );
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"notificationId":"notification-1"')
      );
    });
  });
});
