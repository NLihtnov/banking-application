module.exports = {
  ports: {
    api: 3001,
    websocket: 3002,
    react: 3000
  },
  urls: {
    api: 'http://localhost:3001',
    websocket: 'ws://localhost:3002',
    react: 'http://localhost:3000'
  },
  jwt: {
    secret: 'sua_chave_secreta_aqui'
  }
};
