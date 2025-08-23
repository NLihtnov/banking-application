const WebSocket = require('ws');

const wss = new WebSocket.Server({ 
  port: 3002,
  clientTracking: true
});

console.log('🚀 Servidor WebSocket iniciado na porta 3002');

// Armazenar conexões por usuário
const userConnections = new Map();

wss.on('connection', (ws, req) => {
  console.log('🔗 Nova conexão WebSocket estabelecida');
  
  const url = new URL(req.url, 'http://localhost');
  const token = url.searchParams.get('token');
  
  if (!token) {
    console.log('❌ Conexão sem token, enviando notificação de boas-vindas');
    ws.userId = 'anonymous';
    ws.userName = 'Usuário';
  } else {
    try {
      const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      console.log('✅ Usuário autenticado:', decoded.name);
      ws.userId = decoded.userId;
      ws.userName = decoded.name;
      
      // Armazenar conexão do usuário
      if (!userConnections.has(decoded.userId)) {
        userConnections.set(decoded.userId, []);
      }
      userConnections.get(decoded.userId).push(ws);
    } catch (error) {
      console.log('⚠️ Token inválido, usando conexão anônima');
      ws.userId = 'anonymous';
      ws.userName = 'Usuário';
    }
  }
  
  ws.send(JSON.stringify({
    type: 'notification',
    payload: {
      id: `welcome_${Date.now()}`,
      type: 'system_message',
      title: 'Conectado!',
      message: `Bem-vindo ${ws.userName}! WebSocket funcionando perfeitamente.`,
      timestamp: new Date().toISOString(),
      priority: 'low',
      read: false
    }
  }));
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('📨 Mensagem recebida:', message.type);
      
      if (message.type === 'heartbeat') {
        ws.send(JSON.stringify({
          type: 'heartbeat',
          payload: { timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString()
        }));
      }
      
      // Processar notificação de transação criada
      if (message.type === 'transaction_created') {
        sendTransactionNotification(ws.userId, message.payload);
      }
      
      // Processar atualização de saldo
      if (message.type === 'balance_updated') {
        sendBalanceNotification(ws.userId, message.payload);
      }
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error.message);
    }
  });
  
  ws.on('close', () => {
    console.log('🔌 Conexão fechada para:', ws.userName);
    
    // Remover conexão do usuário
    if (ws.userId !== 'anonymous' && userConnections.has(ws.userId)) {
      const connections = userConnections.get(ws.userId);
      const index = connections.indexOf(ws);
      if (index > -1) {
        connections.splice(index, 1);
      }
      if (connections.length === 0) {
        userConnections.delete(ws.userId);
      }
    }
  });
  
  ws.on('error', (error) => {
    console.error('❌ Erro na conexão WebSocket:', error.message);
  });
});

wss.on('error', (error) => {
  console.error('❌ Erro no servidor WebSocket:', error.message);
});

console.log('📡 Servidor pronto para conexões WebSocket');

// Função para enviar notificação de transação
function sendTransactionNotification(userId, transactionData) {
  const connections = userConnections.get(userId);
  if (!connections) return;
  
  const notification = {
    type: 'notification',
    payload: {
      id: `transaction_${transactionData.id}_${Date.now()}`,
      type: 'transaction',
      title: 'Nova Transação Realizada',
      message: `${transactionData.type} de ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(transactionData.amount)} para ${transactionData.recipientName}`,
      timestamp: new Date().toISOString(),
      userId: userId,
      data: transactionData,
      priority: 'high',
      read: false
    }
  };
  
  connections.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
  
  console.log(`💸 Notificação de transação enviada para usuário ${userId}`);
}

// Função para enviar notificação de atualização de saldo
function sendBalanceNotification(userId, balanceData) {
  const connections = userConnections.get(userId);
  if (!connections) return;
  
  const difference = balanceData.newBalance - balanceData.oldBalance;
  const notification = {
    type: 'notification',
    payload: {
      id: `balance_${Date.now()}`,
      type: 'balance_update',
      title: 'Saldo Atualizado',
      message: difference > 0 
        ? `Seu saldo aumentou em ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(difference)}`
        : `Seu saldo foi reduzido em ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(Math.abs(difference))}`,
      timestamp: new Date().toISOString(),
      data: balanceData,
      priority: 'medium',
      read: false
    }
  };
  
  connections.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
  
  console.log(`💰 Notificação de saldo enviada para usuário ${userId}`);
}

// Função para enviar alerta de segurança
function sendSecurityAlert(userId, alertData) {
  const connections = userConnections.get(userId);
  if (!connections) return;
  
  const notification = {
    type: 'notification',
    payload: {
      id: `security_${Date.now()}`,
      type: 'security_alert',
      title: 'Alerta de Segurança',
      message: alertData.message || 'Atividade suspeita detectada em sua conta.',
      timestamp: new Date().toISOString(),
      data: alertData,
      priority: 'urgent',
      read: false
    }
  };
  
  connections.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
  
  console.log(`🔒 Alerta de segurança enviado para usuário ${userId}`);
}

// Comentado: Simulações removidas para manter apenas notificações reais
// As notificações agora são enviadas apenas por ações do usuário ou eventos reais

/*
// Simular notificações periódicas
setInterval(() => {
  const connectedClients = Array.from(wss.clients).filter(client => client.readyState === WebSocket.OPEN);
  
  if (connectedClients.length > 0) {
    console.log(`📢 Enviando notificação para ${connectedClients.length} cliente(s)`);
    
    connectedClients.forEach((client) => {
      const notification = {
        type: 'notification',
        payload: {
          id: `periodic_${Date.now()}`,
          type: 'system_message',
          title: 'Atualização do Sistema',
          message: 'Esta é uma notificação periódica de teste do WebSocket.',
          timestamp: new Date().toISOString(),
          priority: 'medium',
          read: false
        }
      };
      
      client.send(JSON.stringify(notification));
    });
  }
}, 30000); // A cada 30 segundos

// Simular transações a cada 2 minutos (para teste)
setInterval(() => {
  userConnections.forEach((connections, userId) => {
    if (connections.length > 0) {
      const transactionData = {
        id: Math.floor(Math.random() * 10000),
        type: Math.random() > 0.5 ? 'PIX' : 'TED',
        amount: Math.floor(Math.random() * 1000) + 50,
        recipientName: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira'][Math.floor(Math.random() * 4)]
      };
      
      sendTransactionNotification(userId, transactionData);
    }
  });
}, 120000); // A cada 2 minutos

// Simular alertas de segurança a cada 5 minutos (para teste)
setInterval(() => {
  userConnections.forEach((connections, userId) => {
    if (connections.length > 0 && Math.random() > 0.7) { // 30% de chance
      const alertData = {
        type: 'login_attempt',
        message: 'Tentativa de login detectada de um novo dispositivo.',
        location: 'São Paulo, SP',
        device: 'iPhone 14'
      };
      
      sendSecurityAlert(userId, alertData);
    }
  });
}, 300000); // A cada 5 minutos
*/

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor WebSocket...');
  wss.close(() => {
    console.log('✅ Servidor WebSocket encerrado');
    process.exit(0);
  });
});
