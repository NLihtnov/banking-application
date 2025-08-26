const WebSocket = require('ws');
const http = require('http');
const url = require('url');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const connections = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    ws.close(1008, 'userId parameter is required');
    return;
  }

  if (!connections.has(userId)) {
    connections.set(userId, []);
  }
  
  connections.get(userId).push(ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
          
        case 'subscribe_notifications':
          ws.send(JSON.stringify({ 
            type: 'subscribed', 
            message: 'Notifications subscribed successfully' 
          }));
          break;
          
        default:
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Unknown message type' 
          }));
      }
    } catch (error) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid JSON message' 
      }));
    }
  });

  ws.on('close', () => {
    const userConnections = connections.get(userId);
    if (userConnections) {
      const index = userConnections.indexOf(ws);
      if (index > -1) {
        userConnections.splice(index, 1);
      }
      
      if (userConnections.length === 0) {
        connections.delete(userId);
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.send(JSON.stringify({ 
    type: 'connected', 
    message: 'Connected to WebSocket server',
    userId: userId,
    timestamp: Date.now()
  }));
});

function sendTransactionNotification(userId, transactionData) {
  const userConnections = connections.get(userId);
  if (!userConnections) return;

  const notification = {
    type: 'transaction_created',
    data: transactionData,
    timestamp: Date.now()
  };

  userConnections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(notification));
    }
  });
}

function sendBalanceUpdateNotification(userId, newBalance) {
  const userConnections = connections.get(userId);
  if (!userConnections) return;

  const notification = {
    type: 'balance_updated',
    data: { balance: newBalance },
    timestamp: Date.now()
  };

  userConnections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(notification));
    }
  });
}

function sendSecurityAlert(userId, alertData) {
  const userConnections = connections.get(userId);
  if (!userConnections) return;

  const notification = {
    type: 'security_alert',
    data: alertData,
    timestamp: Date.now()
  };

  userConnections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(notification));
    }
  });
}

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  
  setInterval(() => {
    const allConnections = Array.from(connections.values()).flat();
    if (allConnections.length > 0) {
      const randomConnection = allConnections[Math.floor(Math.random() * allConnections.length)];
      if (randomConnection.readyState === WebSocket.OPEN) {
        randomConnection.send(JSON.stringify({
          type: 'heartbeat',
          timestamp: Date.now()
        }));
      }
    }
  }, 30000);
  
  setInterval(() => {
    const allConnections = Array.from(connections.values()).flat();
    if (allConnections.length > 0 && Math.random() > 0.7) {
      const randomConnection = allConnections[Math.floor(Math.random() * allConnections.length)];
      if (randomConnection.readyState === WebSocket.OPEN) {
        randomConnection.send(JSON.stringify({
          type: 'system_notification',
          message: 'System maintenance scheduled for tonight',
          timestamp: Date.now()
        }));
      }
    }
  }, 120000);
  
  setInterval(() => {
    const allConnections = Array.from(connections.values()).flat();
    if (allConnections.length > 0 && Math.random() > 0.7) {
      const randomConnection = allConnections[Math.floor(Math.random() * allConnections.length)];
      if (randomConnection.readyState === WebSocket.OPEN) {
        randomConnection.send(JSON.stringify({
          type: 'security_notification',
          message: 'New security features available',
          timestamp: Date.now()
        }));
      }
    }
  }, 300000);
});

process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  wss.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });
});

process.on('SIGTERM', () => {
  console.log('Shutting down WebSocket server...');
  wss.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });
});

module.exports = {
  sendTransactionNotification,
  sendBalanceUpdateNotification,
  sendSecurityAlert
};
