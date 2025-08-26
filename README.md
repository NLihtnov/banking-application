# 🏦 Aplicação Bancária Digital

Uma aplicação web completa para gerenciamento financeiro, desenvolvida em React com TypeScript, seguindo os princípios da Clean Architecture, com Redux Toolkit, React Router, WebSocket para notificações em tempo real e suporte a múltiplos idiomas.

## 📋 Funcionalidades

### 🔐 Autenticação
- **Login e Logout**: Sistema de autenticação com JWT
- **Registro de Usuários**: Cadastro com validação de dados
- **Proteção de Rotas**: Rotas privadas para áreas protegidas
- **Senha de Transação**: Segurança adicional para operações financeiras

### 🏠 Home
- **Saldo Atual**: Exibição do saldo disponível
- **Resumo de Transações**: Últimas 5 transações realizadas
- **Ações Rápidas**: Acesso direto a funcionalidades principais

### 💸 Transações
- **TED**: Transferência Eletrônica Disponível
- **PIX**: Transferência instantânea
- **Validação Completa**: Verificação de saldo e dados obrigatórios
- **Confirmação em Duas Etapas**: Resumo antes da confirmação final

### 📊 Histórico
- **Listagem Completa**: Todas as transações do usuário
- **Filtros Avançados**:
  - Por tipo (TED/PIX)
  - Por período (7, 15, 30, 90 dias)
  - Por intervalo de datas
  - Por intervalo de valores
- **Ordenação**: Por data ou valor (crescente/decrescente)

### 🔔 Notificações em Tempo Real
- **WebSocket**: Conexão persistente para atualizações
- **Notificações Push**: Alertas do navegador
- **Toast Notifications**: Mensagens temporárias
- **Painel de Notificações**: Histórico completo de alertas

### 🌐 Internacionalização
- **3 Idiomas**: Português, Inglês e Espanhol (ADICIONADO APENAS A TELA DE HOME PARA DEMONSTRAÇÃO)
- **Detecção Automática**: Idioma baseado no navegador
- **Persistência**: Lembrança da escolha do usuário

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca principal para interface
- **TypeScript**: Tipagem estática para maior segurança
- **Redux Toolkit**: Gerenciamento de estado global
- **React Router**: Navegação entre páginas
- **Axios**: Cliente HTTP para APIs
- **React i18next**: Internacionalização
- **React Icons**: Ícones modernos

### Backend (Mock)
- **JSON Server**: API REST simulada
- **WebSocket Server**: Servidor de notificações em tempo real
- **Concurrently**: Execução simultânea de servidores

### Arquitetura
- **Clean Architecture**: Separação clara de responsabilidades
- **Domain-Driven Design**: Foco nas regras de negócio
- **Dependency Injection**: Inversão de dependências

### Testes (Cobertura em + de 80%)
- **Jest**: Framework de testes
- **React Testing Library**: Testes de componentes
- **TS-Jest**: Suporte a TypeScript nos testes

### Desenvolvimento
- **Create React App**: Configuração inicial
- **CRACO**: Configuração avançada do CRA
- **ESLint + Prettier**: Linting e formatação
- **Husky + Lint-staged**: Git hooks para qualidade
- **CSS3**: Estilização moderna e responsiva

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd banking-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto**
   ```bash
   # Desenvolvimento completo (todos os serviços)
   npm run dev
   
   # Ou execute separadamente:
   # Terminal 1 - Backend mock
   npm run server
   
   # Terminal 2 - WebSocket server
   npm run websocket
   
   # Terminal 3 - Frontend
   npm start
   ```

4. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - WebSocket: ws://localhost:3002

### Scripts Disponíveis

```bash
npm start                    # Inicia o servidor de desenvolvimento
npm run build               # Cria build de produção
npm test                    # Executa os testes
npm run test:watch         # Testes em modo watch
npm run test:coverage      # Testes com cobertura
npm run server             # Inicia o JSON Server
npm run websocket          # Inicia o servidor WebSocket
npm run dev                # Inicia todos os serviços
npm run dev:api            # Frontend + API
npm run dev:websocket      # Frontend + WebSocket
npm run lint               # Executa o linter
npm run lint:fix           # Corrige problemas de linting
```

## 📁 Estrutura do Projeto

```
banking-app/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── locales/           # Arquivos de tradução
│       ├── en/
│       ├── es/
│       └── pt/
├── src/
│   ├── components/        # Componentes React
│   │   ├── auth/         # Autenticação
│   │   ├── common/       # Componentes compartilhados
│   │   ├── layout/       # Layout e navegação
│   │   ├── notifications/# Sistema de notificações
│   │   ├── pages/        # Páginas principais
│   │   └── transaction/  # Componentes de transação
│   ├── domain/           # Camada de domínio (Clean Architecture)
│   │   ├── entities/     # Entidades de negócio
│   │   └── repositories/ # Interfaces dos repositórios
│   ├── application/      # Camada de aplicação (Clean Architecture)
│   │   └── usecases/     # Casos de uso
│   ├── infrastructure/   # Camada de infraestrutura (Clean Architecture)
│   │   ├── api/          # Cliente HTTP
│   │   ├── repositories/ # Implementações dos repositórios
│   │   └── container/    # Container de dependências
│   ├── hooks/            # Hooks customizados
│   ├── services/         # Serviços (JWT, WebSocket)
│   ├── store/            # Redux store e slices
│   ├── utils/            # Utilitários e helpers
│   ├── config/           # Configurações
│   ├── __mocks__/        # Mocks para testes
│   ├── __tests__/        # Testes de integração
│   ├── i18n.ts           # Configuração de internacionalização
│   ├── App.tsx           # Componente principal
│   └── index.tsx         # Ponto de entrada
├── db.json               # Dados mock para JSON Server
├── websocket-server.js   # Servidor WebSocket
├── jest.config.js        # Configuração do Jest
├── craco.config.js       # Configuração do CRACO
└── package.json
```

## 🧪 Testes

### Executar Testes
```bash
npm test                   # Executa todos os testes
npm run test:watch        # Modo watch (recomendado para desenvolvimento)
npm run test:coverage     # Com cobertura de código
npm run test:ci           # Para CI/CD
```

### Cobertura de Testes
```bash
npm run test:coverage
```

### Testes Específicos
```bash
npm test -- --testNamePattern="Login"
npm test -- --testPathPattern="auth"
```

## 📊 Dados de Teste

### Usuários Pré-cadastrados
- **Email**: joao@email.com | **Senha**: 123456
- **Email**: maria@email.com | **Senha**: 123456

### Dados de Transação
- **Senha de Transação**: 123456 (para ambos os usuários)

## 🔧 Configurações

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WEBSOCKET_URL=ws://localhost:3002
```

### Personalização
- **Cores**: Modifique as variáveis CSS em `src/App.css`
- **API**: Altere a URL base em `src/infrastructure/api/ApiClient.ts`
- **Dados**: Edite o arquivo `db.json` para modificar dados iniciais
- **Idiomas**: Adicione traduções em `public/locales/`

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 📱 Dispositivos móveis
- 📱 Tablets
- 💻 Desktops
- 🖥️ Telas grandes

## 🔒 Segurança

- **JWT**: Autenticação baseada em tokens
- **Validação**: Verificação de dados em frontend e backend
- **Senha de Transação**: Camada adicional de segurança
- **Proteção de Rotas**: Acesso restrito a usuários autenticados
- **WebSocket Seguro**: Autenticação via token JWT

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify
1. Conecte seu repositório ao Netlify
2. Configure o build command: `npm run build`
3. Configure o publish directory: `build`

### Build Local
```bash
npm run build
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👨‍💻 Autor

Desenvolvido como projeto de aplicação bancária completa com todas as funcionalidades solicitadas, seguindo as melhores práticas de desenvolvimento e arquitetura.

## 🐛 Problemas Conhecidos

- Nenhum problema conhecido no momento

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email.

---

**Nota**: Esta é uma aplicação de demonstração. Para uso em produção, implemente medidas de segurança adicionais e validações mais robustas.
