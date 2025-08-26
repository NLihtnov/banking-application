# Clean Architecture - Banking App

Este projeto está seguindo os princípios da Clean Architecture, organizando o código em camadas bem definidas com responsabilidades específicas e implementando padrões de design modernos.

## Estrutura da Arquitetura

### 1. Domain Layer (`src/domain/`)
**Responsabilidade**: Contém as regras de negócio centrais da aplicação.

#### Entidades (`entities/`)
- `User.ts`: Entidade que representa um usuário com suas regras de negócio
- `Transaction.ts`: Entidade que representa uma transação com validações
- `types.ts`: Tipos e interfaces compartilhadas do domínio

#### Repositórios (`repositories/`)
- `IUserRepository.ts`: Interface para operações de usuário
- `ITransactionRepository.ts`: Interface para operações de transação

### 2. Application Layer (`src/application/`)
**Responsabilidade**: Contém os casos de uso da aplicação.

#### Casos de Uso (`usecases/`)
- `AuthenticationUseCase.ts`: Gerencia autenticação e registro
- `TransactionUseCase.ts`: Gerencia criação e consulta de transações

### 3. Infrastructure Layer (`src/infrastructure/`)
**Responsabilidade**: Implementações concretas de interfaces externas.

#### API (`api/`)
- `ApiClient.ts`: Cliente HTTP para comunicação com backend

#### Repositórios (`repositories/`)
- `UserRepository.ts`: Implementação concreta do repositório de usuários
- `TransactionRepository.ts`: Implementação concreta do repositório de transações

#### Container (`container/`)
- `DependencyContainer.ts`: Container de injeção de dependências

### 4. Presentation Layer (`src/components/`)
**Responsabilidade**: Interface do usuário e gerenciamento de estado.

#### Componentes Organizados por Funcionalidade
- **`auth/`**: Componentes de autenticação (Login, Register)
- **`common/`**: Componentes compartilhados (LanguageSelector)
- **`layout/`**: Componentes de layout (Navbar, PrivateRoute)
- **`notifications/`**: Sistema de notificações (NotificationBell, NotificationPanel, Toast)
- **`pages/`**: Páginas principais (Home, Transaction, History)
- **`transaction/`**: Componentes específicos de transação (TransactionForm, BalanceCard)

### 5. State Management (`src/store/`)
**Responsabilidade**: Gerenciamento de estado global da aplicação.

#### Slices do Redux
- `authSlice.ts`: Estado de autenticação e usuário
- `transactionSlice.ts`: Estado de transações
- `notificationSlice.ts`: Estado de notificações
- `index.ts`: Configuração do Redux store

### 6. Hooks Customizados (`src/hooks/`)
**Responsabilidade**: Lógica reutilizável e gerenciamento de estado local.

#### Hooks Disponíveis
- `useForm.ts`: Gerenciamento de formulários
- `useNotifications.ts`: Gerenciamento de notificações
- `useTransaction.ts`: Lógica de transações
- `useTransactionForm.ts`: Formulário de transações
- `useTranslation.ts`: Internacionalização
- `useSerializableData.ts`: Serialização de dados

### 7. Serviços (`src/services/`)
**Responsabilidade**: Serviços externos e utilitários.

#### Serviços Implementados
- `JwtService.ts`: Gerenciamento de tokens JWT
- `WebSocketService.ts`: Conexão e comunicação WebSocket

### 8. Utilitários (`src/utils/`)
**Responsabilidade**: Funções auxiliares e constantes.

#### Utilitários Disponíveis
- `constants.ts`: Constantes da aplicação
- `formatters.ts`: Formatação de dados (moeda, datas)
- `validators.ts`: Validações de formulários
- `converters.ts`: Conversões de dados
- `icons.ts`: Mapeamento de ícones

### 9. Configuração (`src/config/`)
**Responsabilidade**: Configurações da aplicação.

#### Arquivos de Configuração
- `index.ts`: Configuração principal
- `test.ts`: Configuração específica para testes

### 10. Internacionalização (`src/i18n.ts`)
**Responsabilidade**: Suporte a múltiplos idiomas.

#### Idiomas Suportados
- Português (pt) - Idioma padrão
- Inglês (en)
- Espanhol (es)

## Princípios Aplicados

### 1. Inversão de Dependência
- As camadas internas (Domain, Application) não dependem das externas
- Interfaces são definidas nas camadas internas e implementadas nas externas
- Dependências fluem de fora para dentro

### 2. Separação de Responsabilidades
- Cada camada tem uma responsabilidade específica
- Regras de negócio isoladas na camada de domínio
- Lógica de apresentação separada da lógica de negócio

### 3. Injeção de Dependência
- Dependências são injetadas através do container
- Facilita testes e manutenção
- Reduz acoplamento entre componentes

### 4. Testabilidade
- Código organizado permite testes unitários isolados
- Mocks podem ser facilmente criados para interfaces
- Testes de integração para fluxos completos

### 5. Responsabilidade Única
- Cada classe/função tem uma única responsabilidade
- Componentes React focados apenas na apresentação
- Hooks customizados para lógica específica

## Benefícios da Arquitetura

1. **Manutenibilidade**: Código organizado e fácil de entender
2. **Testabilidade**: Cada camada pode ser testada independentemente
3. **Flexibilidade**: Mudanças em uma camada não afetam outras
4. **Escalabilidade**: Fácil adicionar novas funcionalidades
5. **Reutilização**: Casos de uso podem ser reutilizados em diferentes interfaces
6. **Separação de Preocupações**: UI, lógica de negócio e dados separados
7. **Independência de Framework**: Lógica de negócio independente do React

## Como Usar

### 1. Adicionar nova funcionalidade:
- Defina a entidade no domínio (`src/domain/entities/`)
- Crie o caso de uso na aplicação (`src/application/usecases/`)
- Implemente o repositório na infraestrutura (`src/infrastructure/repositories/`)
- Crie os componentes na apresentação (`src/components/`)
- Adicione o estado no Redux (`src/store/`)

### 2. Testar:
- Teste cada camada isoladamente
- Use mocks para dependências externas
- Teste fluxos completos com testes de integração

### 3. Manter:
- Respeite as dependências entre camadas
- Mantenha as regras de negócio no domínio
- Use o container de dependências para injeção

## Padrões de Design Implementados

### 1. Repository Pattern
- Abstração do acesso a dados
- Facilita testes e mudanças de implementação

### 2. Use Case Pattern
- Encapsula regras de negócio específicas
- Orquestra operações entre entidades

### 3. Observer Pattern (WebSocket)
- Notificações em tempo real
- Desacoplamento entre emissor e receptor

### 4. Factory Pattern
- Criação de objetos complexos
- Configuração de dependências

### 5. Strategy Pattern
- Diferentes estratégias de validação
- Diferentes tipos de transação

## Estrutura de Testes

```
src/
├── __tests__/           # Testes de integração
├── components/
│   └── ComponentName/
│       └── __tests__/   # Testes de componentes
├── hooks/
│   └── __tests__/       # Testes de hooks
├── utils/
│   └── __tests__/       # Testes de utilitários
└── __mocks__/           # Mocks globais
```

## Configuração de Desenvolvimento

- **CRACO**: Configuração avançada do Create React App
- **TypeScript**: Configuração estrita para qualidade de código
- **ESLint + Prettier**: Padrões de código consistentes
- **Husky**: Git hooks para qualidade
- **Jest**: Framework de testes com suporte a TypeScript
