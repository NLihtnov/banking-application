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

## 🏗️ Arquitetura do Projeto

### **Clean Architecture**
O projeto segue os princípios da Clean Architecture com as seguintes camadas:

- **Domain**: Entidades e regras de negócio
- **Application**: Casos de uso da aplicação
- **Infrastructure**: Implementações concretas (APIs, repositórios)
- **Presentation**: Componentes React e gerenciamento de estado

### **Estrutura de Pastas**
```
src/
├── domain/           # Regras de negócio
├── application/      # Casos de uso
├── infrastructure/   # Implementações externas
├── components/       # Componentes React
├── hooks/           # Hooks customizados
├── services/        # Serviços (JWT, WebSocket)
├── store/           # Redux store
├── utils/           # Utilitários
└── config/          # Configurações
```

## 🧪 Sistema de Testes

### **Scripts de Teste**
```bash
npm test                    # Executa todos os testes
npm run test:watch         # Modo watch (desenvolvimento)
npm run test:coverage      # Com cobertura de código
npm run test:ci            # Para CI/CD
npm run test:debug         # Com opções de debug
```

### **Estrutura de Testes**
- **Testes Unitários**: Cada componente, hook e utilitário
- **Testes de Integração**: Fluxos completos da aplicação
- **Mocks Automáticos**: APIs simuladas configuradas automaticamente
- **Cobertura**: Thresholds mínimos de 80% para branches, functions, lines e statements

### **Mocks Disponíveis**
- `src/__mocks__/api.ts`: APIs simuladas completas
- `src/__mocks__/axios.ts`: Cliente HTTP mockado
- `src/__mocks__/jose.ts`: Biblioteca JWT mockada
- `src/__mocks__/JwtService.ts`: Serviço JWT mockado

## 🌐 Internacionalização (i18n)

### **Idiomas Suportados**
- 🇧🇷 Português (pt) - Padrão
- 🇺🇸 Inglês (en)
- 🇪🇸 Espanhol (es)

### **Como Usar**
```typescript
import { useTranslation } from '../hooks';

const { t, changeLanguage, currentLanguage } = useTranslation();
return <div>{t('welcome')}</div>;
```

### **Arquivos de Tradução**
Localizados em `public/locales/{idioma}/translation.json`

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

# Testes
npm test
npm run test:coverage
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

### **Debug de Testes**
```bash
# Executar testes específicos
npm test -- --testNamePattern="Login"
npm test -- --testPathPattern="auth"

# Testes com verbose
npm test -- --verbose

# Debug de testes
npm run test:debug
```

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

### **Testes falhando**
1. Verifique se os mocks estão configurados: `src/__mocks__/`
2. Execute `npm run test:debug` para mais detalhes
3. Verifique a cobertura: `npm run test:coverage`
4. Limpe o cache: `npm test -- --clearCache`

## 📚 Recursos de Desenvolvimento

### **Ferramentas de Qualidade**
- **ESLint**: Linting de código TypeScript/React
- **Prettier**: Formatação automática de código
- **Husky**: Git hooks para qualidade
- **Lint-staged**: Linting apenas de arquivos modificados

### **Configurações**
- **CRACO**: Configuração avançada do Create React App
- **TypeScript**: Configuração estrita para qualidade
- **Jest**: Framework de testes com suporte a TypeScript
- **Redux DevTools**: Debug do estado da aplicação

### **Padrões de Código**
- **Clean Architecture**: Separação clara de responsabilidades
- **Repository Pattern**: Abstração do acesso a dados
- **Use Case Pattern**: Encapsulamento de regras de negócio
- **Observer Pattern**: Notificações em tempo real

## 🔄 Fluxo de Desenvolvimento

### **1. Desenvolvimento de Features**
1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Implemente seguindo a Clean Architecture
3. Adicione testes para a nova funcionalidade
4. Execute testes: `npm test`
5. Verifique cobertura: `npm run test:coverage`

### **2. Commit e Push**
1. Adicione arquivos: `git add .`
2. Commit: `git commit -m "feat: adiciona nova funcionalidade"`
3. Push: `git push origin feature/nova-funcionalidade`

### **3. Pull Request**
1. Crie um PR no GitHub
2. Verifique se os testes passam no CI
3. Solicite review de outros desenvolvedores
4. Merge após aprovação

## 📖 Documentação Relacionada

- **README.md**: Visão geral do projeto
- **ARCHITECTURE.md**: Detalhes da arquitetura
- **TESTING.md**: Guia completo de testes
- **I18N-README.md**: Guia de internacionalização
