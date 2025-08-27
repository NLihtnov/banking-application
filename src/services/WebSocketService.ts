import { config } from '../config';

export interface NotificationData {
  id: string;
  type: 'transaction' | 'balance_update' | 'security_alert' | 'system_message';
  title: string;
  message: string;
  timestamp: string;
  userId?: number;
  data?: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
}

export interface WebSocketMessage {
  type: 'notification' | 'transaction_update' | 'balance_update' | 'heartbeat' | 'transaction_created' | 'balance_updated';
  payload: any;
  timestamp: string;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private listeners: Map<string, Function[]> = new Map();
  private isConnected = false;
  private token: string | null = null;

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.token = token;
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? `wss://api.magnumbank.com/ws?token=${token}`
        : `${config.webSocketURL}/ws?token=${token}`;
      
      try {
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connected', true);
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            this.emit('error', error);
          }
        };

        this.socket.onclose = (event) => {
          this.isConnected = false;
          this.emit('connected', false);
          
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.socket.onerror = (error) => {
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'Desconexão manual');
      this.socket = null;
    }
    this.isConnected = false;
    this.listeners.clear();
  }

  private handleMessage(message: WebSocketMessage): void {
    this.emit('message', message);
    
    switch (message.type) {
      case 'notification':
        this.emit('notification', message.payload);
        break;
      case 'transaction_update':
        this.emit('transaction_update', message.payload);
        break;
      case 'balance_update':
        this.emit('balance_update', message.payload);
        break;
      case 'transaction_created':
        this.emit('transaction_update', message.payload);
        break;
      case 'balance_updated':
        this.emit('balance_update', message.payload);
        break;
      case 'heartbeat':
        this.sendHeartbeat();
        break;
      default:
        break;
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    
    setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  private sendHeartbeat(): void {
    this.send({
      type: 'heartbeat',
      payload: { timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString()
    });
  }

  send(message: WebSocketMessage): void {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(message));
    }
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  markNotificationAsRead(notificationId: string): void {
    this.send({
      type: 'notification',
      payload: {
        action: 'mark_read',
        notificationId
      },
      timestamp: new Date().toISOString()
    });
  }
}

export const webSocketService = new WebSocketService();
