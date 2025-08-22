# 🏦 Aplicação Bancária Digital

Uma aplicação web completa para gerenciamento financeiro, desenvolvida em React com TypeScript, Redux Toolkit e React Router.

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

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca principal para interface
- **TypeScript**: Tipagem estática para maior segurança
- **Redux Toolkit**: Gerenciamento de estado global
- **React Router**: Navegação entre páginas
- **Axios**: Cliente HTTP para APIs

### Backend (Mock)
- **JSON Server**: API REST simulada
- **Concurrently**: Execução simultânea de servidores

### Testes
- **Jest**: Framework de testes
- **React Testing Library**: Testes de componentes

### Desenvolvimento
- **Create React App**: Configuração inicial
- **ESLint**: Linting de código
- **CSS3**: Estilização moderna e responsiva

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
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
   # Desenvolvimento (ambos os servidores)
   npm run dev
   
   # Ou execute separadamente:
   # Terminal 1 - Backend mock
   npm run server
   
   # Terminal 2 - Frontend
   npm start
   ```

4. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Cria build de produção
npm test           # Executa os testes
npm run server     # Inicia o JSON Server
npm run dev        # Inicia ambos os servidores
```

## 📁 Estrutura do Projeto

```
banking-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Auth.css
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Navbar.css
│   │   │   └── PrivateRoute.tsx
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── Home.css
│   │       ├── Transaction.tsx
│   │       ├── Transaction.css
│   │       ├── History.tsx
│   │       └── History.css
│   ├── hooks/
│   │   ├── useAppDispatch.ts
│   │   └── useAppSelector.ts
│   ├── services/
│   │   └── api.ts
│   ├── store/
│   │   ├── index.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       └── transactionSlice.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── db.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testes

### Executar Testes
```bash
npm test
```

### Cobertura de Testes
```bash
npm test -- --coverage
```

### Testes Específicos
```bash
npm test -- --testNamePattern="Login"
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
```

### Personalização
- **Cores**: Modifique as variáveis CSS em `src/App.css`
- **API**: Altere a URL base em `src/services/api.ts`
- **Dados**: Edite o arquivo `db.json` para modificar dados iniciais

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

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como projeto de aplicação bancária completa com todas as funcionalidades solicitadas.

## 🐛 Problemas Conhecidos

- Nenhum problema conhecido no momento

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email.

---

**Nota**: Esta é uma aplicação de demonstração. Para uso em produção, implemente medidas de segurança adicionais e validações mais robustas.
