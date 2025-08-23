# Clean Architecture - Banking App

Este projeto está seguindo os princípios da Clean Architecture, organizando o código em camadas bem definidas com responsabilidades específicas.

## Estrutura da Arquitetura

### 1. Domain Layer (`src/domain/`)
**Responsabilidade**: Contém as regras de negócio centrais da aplicação.

#### Entidades (`entities/`)
- `User.ts`: Entidade que representa um usuário com suas regras de negócio
- `Transaction.ts`: Entidade que representa uma transação com validações

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

### 4. Presentation Layer (`src/presentation/`)
**Responsabilidade**: Interface do usuário e gerenciamento de estado.

#### Store (`store/`)
- `authSlice.ts`: Estado de autenticação
- `transactionSlice.ts`: Estado de transações
- `index.ts`: Configuração do Redux store

#### Hooks (`hooks/`)
- `index.ts`: Hooks customizados para Redux

#### Componentes (`components/`)
- Componentes React organizados por funcionalidade

## Princípios Aplicados

### 1. Inversão de Dependência
- As camadas internas (Domain, Application) não dependem das externas
- Interfaces são definidas nas camadas internas e implementadas nas externas

### 2. Separação de Responsabilidades
- Cada camada tem uma responsabilidade específica
- Regras de negócio isoladas na camada de domínio

### 3. Injeção de Dependência
- Dependências são injetadas através do container
- Facilita testes e manutenção

### 4. Testabilidade
- Código organizado permite testes unitários isolados
- Mocks podem ser facilmente criados para interfaces

## Benefícios

1. **Manutenibilidade**: Código organizado e fácil de entender
2. **Testabilidade**: Cada camada pode ser testada independentemente
3. **Flexibilidade**: Mudanças em uma camada não afetam outras
4. **Escalabilidade**: Fácil adicionar novas funcionalidades
5. **Reutilização**: Casos de uso podem ser reutilizados em diferentes interfaces

## Como Usar

1. **Adicionar nova funcionalidade**:
   - Defina a entidade no domínio
   - Crie o caso de uso na aplicação
   - Implemente o repositório na infraestrutura
   - Crie os componentes na apresentação

2. **Testar**:
   - Teste cada camada isoladamente
   - Use mocks para dependências externas

3. **Manter**:
   - Respeite as dependências entre camadas
   - Mantenha as regras de negócio no domínio
