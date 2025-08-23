# Guia de Testes - Banking App

Este documento explica como executar testes unitários e visualizar a cobertura de código no projeto Banking App.

## Scripts Disponíveis

### Execução de Testes

```bash
# Executar todos os testes uma vez
npm test

# Executar testes em modo watch (recomendado para desenvolvimento)
npm run test:watch

# Executar testes com cobertura (sem watch)
npm run test:coverage

# Executar testes com cobertura em modo watch
npm run test:coverage:watch

# Executar testes para CI/CD
npm run test:ci

# Executar testes com debug
npm run test:debug
```

### Comandos Detalhados

- **`npm test`**: Executa todos os testes uma vez
- **`npm run test:watch`**: Executa testes em modo watch (recomendado para desenvolvimento)
- **`npm run test:coverage`**: Executa testes com cobertura e gera relatórios
- **`npm run test:coverage:watch`**: Executa testes com cobertura em modo watch
- **`npm run test:ci`**: Executa testes para integração contínua
- **`npm run test:debug`**: Executa testes com opções de debug

## Cobertura de Código

### Thresholds de Cobertura

O projeto está configurado com os seguintes thresholds mínimos:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Relatórios de Cobertura

Após executar `npm run test:coverage`, os relatórios são gerados em:
- **HTML**: `coverage/lcov-report/index.html` (visualização interativa)
- **LCOV**: `coverage/lcov.info` (formato para ferramentas externas)
- **JSON**: `coverage/coverage-summary.json` (dados estruturados)
- **Console**: Resumo no terminal

## Estrutura de Testes

### Convenções de Nomenclatura

- **Arquivos de teste**: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`
- **Diretórios de teste**: `__tests__/`
- **Testes de componentes**: `ComponentName.test.tsx`
- **Testes de hooks**: `useHookName.test.ts`
- **Testes de utilitários**: `utilityName.test.ts`

### Organização dos Testes

```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.test.tsx
│   │   └── ComponentName.css
│   └── __tests__/
│       └── ComponentName.test.tsx
├── hooks/
│   ├── useHookName.ts
│   └── useHookName.test.ts
├── utils/
│   ├── utilityName.ts
│   └── utilityName.test.ts
└── __tests__/
    └── integration/
```

## Arquivos Ignorados nos Testes

### Por Padrão (jest.config.js)

Os seguintes arquivos são automaticamente ignorados:
- Arquivos de índice (`index.ts`, `index.tsx`)
- Arquivos de configuração
- Arquivos de teste existentes
- Arquivos de setup

### Por .jestignore

Arquivos adicionais ignorados:
- Build e distribuição
- Dependências
- Configurações
- Documentação
- Arquivos temporários

## Configuração do Jest

### Arquivos de Configuração

- **`jest.config.js`**: Configuração principal do Jest
- **`tsconfig.jest.json`**: Configuração TypeScript para testes
- **`jest.setup.js`**: Configurações globais e mocks
- **`.jestignore`**: Arquivos e diretórios ignorados
- **`src/config/test.ts`**: Configuração específica para testes
- **`src/__mocks__/api.ts`**: Mocks das APIs simuladas

### Mocks Globais

O projeto inclui mocks para:
- `localStorage` e `sessionStorage`
- `fetch` API
- `WebSocket`
- `IntersectionObserver`
- `ResizeObserver`
- `matchMedia`

### APIs Simuladas Integradas

O projeto inclui integração completa com as APIs simuladas:
- **`src/__mocks__/api.ts`**: Mocks completos para todas as APIs
- **`src/config/test.ts`**: Configuração específica para ambiente de teste
- **Dados de teste**: Usuários e transações pré-configurados
- **Mocks automáticos**: Configuração automática no setup dos testes
- **Consistência de dados**: Manutenção do estado entre testes

## APIs Simuladas nos Testes

### Configuração Automática

As APIs simuladas são configuradas automaticamente em todos os testes através do `setupTests.ts`. Isso significa que você não precisa configurar nada manualmente.

### Uso nos Testes

```tsx
import { mockApi, mockData } from '../__mocks__/api';

describe('Component with API', () => {
  it('should fetch data from API', async () => {
    // Os mocks já estão configurados automaticamente
    const response = await mockApi.users.get();
    
    expect(response.data).toEqual(mockData.users);
    expect(mockApi.users.get).toHaveBeenCalledTimes(1);
  });
});
```

### Dados Disponíveis

- **Usuários de teste**: `mockData.users`
- **Transações de teste**: `mockData.transactions`
- **Usuário padrão**: `mockData.defaultUser`
- **Transação padrão**: `mockData.defaultTransaction`

### Funcionalidades dos Mocks

- **Respostas realistas**: Simulam respostas HTTP reais
- **Tratamento de erros**: Incluem cenários de erro (404, 401, etc.)
- **Consistência de dados**: Mantêm estado entre chamadas
- **Verificação de chamadas**: Permitem verificar se APIs foram chamadas

## Exemplos de Testes

### Teste de Componente React

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

### Teste de Hook

```tsx
import { renderHook, act } from '@testing-library/react';
import { useHookName } from './useHookName';

describe('useHookName', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useHookName());
    expect(result.current.value).toBe('initial');
  });

  it('should update state', () => {
    const { result } = renderHook(() => useHookName());
    
    act(() => {
      result.current.updateValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

### Teste de Utilitário

```tsx
import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  it('should format positive numbers', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format negative numbers', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});
```

## Troubleshooting

### Problemas Comuns

1. **Testes falhando por mocks**: Verifique se os mocks estão configurados corretamente
2. **Problemas de TypeScript**: Execute `npm run test:debug` para mais detalhes
3. **Cobertura baixa**: Verifique se os arquivos estão sendo incluídos corretamente
4. **Testes lentos**: Use `npm run test:watch` para desenvolvimento

### Debug de Testes

Para debugar testes específicos:
```bash
# Executar apenas um arquivo de teste
npm test -- ComponentName.test.tsx

# Executar testes com nome específico
npm test -- -t "test name"

# Executar testes com verbose
npm test -- --verbose
```

## Integração com CI/CD

O script `npm run test:ci` é otimizado para integração contínua:
- Gera relatórios LCOV para ferramentas externas
- Executa sem modo watch
- Falha se a cobertura estiver abaixo dos thresholds
- Gera relatórios em formato JSON para análise

## Contribuindo

Ao adicionar novos testes:
1. Siga as convenções de nomenclatura
2. Mantenha a cobertura acima dos thresholds
3. Use mocks apropriados para dependências externas
4. Teste casos de sucesso e erro
5. Documente testes complexos
