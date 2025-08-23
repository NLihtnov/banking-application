# 🚀 Guia de Desenvolvimento - Banking App

## 📋 Scripts Disponíveis

### **Desenvolvimento Completo**
```bash
npm run dev
```
- ✅ API REST (json-server) na porta 3001
- ✅ WebSocket Server na porta 3002  
- ✅ React App na porta 3000
- 🎨 Logs coloridos para cada serviço

### **Desenvolvimento com WebSocket apenas**
```bash
npm run dev:websocket
```
- ✅ WebSocket Server na porta 3002
- ✅ React App na porta 3000

### **Desenvolvimento com API apenas**
```bash
npm run dev:api
```
- ✅ API REST (json-server) na porta 3001
- ✅ React App na porta 3000

## 🔧 Portas Utilizadas

| Serviço | Porta | URL |
|---------|-------|-----|
| React App | 3000 | http://localhost:3000 |
| API REST | 3001 | http://localhost:3001 |
| WebSocket | 3002 | ws://localhost:3002 |

## 🎯 Funcionalidades WebSocket

### **Notificações em Tempo Real**
- 🔔 Notificação de boas-vindas ao conectar
- 📢 Notificações periódicas a cada 30 segundos
- 💸 Notificações de transações
- 💰 Atualizações de saldo
- 🔒 Alertas de segurança

### **Interface de Notificações**
- 📋 Painel de notificações deslizante
- 📢 Toast notifications para urgentes
- 🌐 Browser notifications (com permissão)
- 📱 Design responsivo

## 🛠️ Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar todos os serviços
npm run dev

# Apenas frontend
npm start

# Apenas API
npm run server

# Apenas WebSocket
npm run websocket

# Build para produção
npm run build

# Linting
npm run lint
npm run lint:fix
```

## 🔍 Debugging

### **Logs Coloridos**
- 🔵 **Azul**: API REST (json-server)
- 🟢 **Verde**: WebSocket Server
- 🟡 **Amarelo**: React App

### **Verificar Conexões**
1. Abra o DevTools do navegador
2. Vá para a aba "Network"
3. Filtre por "WS" para ver conexões WebSocket
4. Verifique se há conexão com `ws://localhost:3002`

### **Testar Notificações**
1. Faça login na aplicação
2. Clique no ícone de sino 🔔
3. Use o botão 🧪 para enviar notificação de teste
4. Clique no botão 🔔 para permitir notificações do browser

## 🚨 Troubleshooting

### **Erro de Porta em Uso**
```bash
# Verificar processos nas portas
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# Matar processo específico
taskkill /PID <PID> /F
```

### **WebSocket não conecta**
1. Verifique se o servidor está rodando: `npm run websocket`
2. Confirme a porta 3002 está livre
3. Verifique o token JWT no localStorage
4. Teste a conexão manual: `wscat -c ws://localhost:3002/ws`

### **Erro de Módulo não encontrado**
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```
