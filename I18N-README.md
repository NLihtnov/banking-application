# Internacionalização (i18n) - Banking App

Este documento descreve a implementação de internacionalização no projeto Banking App, que suporta múltiplos idiomas com detecção automática e persistência de preferências.

## Visão Geral

O projeto suporta três idiomas:
- **Português (pt)** - Idioma padrão
- **Inglês (en)** - Idioma secundário
- **Espanhol (es)** - Idioma terciário

## Tecnologias Utilizadas

- **react-i18next**: Biblioteca principal para React
- **i18next**: Core da biblioteca de internacionalização
- **i18next-browser-languagedetector**: Detecção automática de idioma
- **i18next-http-backend**: Carregamento de arquivos de tradução

## Estrutura de Arquivos

```
src/
├── i18n.ts                          # Configuração principal do i18n
├── hooks/
│   └── useTranslation.ts            # Hook personalizado para traduções
└── components/
    └── common/
        ├── LanguageSelector.tsx     # Componente de seleção de idioma
        └── LanguageSelector.css     # Estilos do seletor

public/
└── locales/                         # Arquivos de tradução
    ├── en/
    │   └── translation.json         # Traduções em inglês
    ├── es/
    │   └── translation.json         # Traduções em espanhol
    └── pt/
        └── translation.json         # Traduções em português
```

## Como Usar

### 1. Hook useTranslation

```typescript
import { useTranslation } from '../hooks';

const MyComponent = () => {
  const { t, changeLanguage, currentLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('welcomeMessage', { name: 'João' })}</p>
      <button onClick={() => changeLanguage('en')}>
        Change to English
      </button>
    </div>
  );
};
```

### 2. Componente LanguageSelector

```typescript
import LanguageSelector from '../components/common/LanguageSelector';

const Navbar = () => {
  return (
    <nav>
      <LanguageSelector />
      {/* outros elementos */}
    </nav>
  );
};
```

### 3. Traduções com Interpolação

```typescript
// No arquivo de tradução
{
  "welcomeMessage": "Bem-vindo, {{name}}!",
  "totalTransactions": "{{count}} transações no total"
}

// No componente
t('welcomeMessage', { name: 'João' })
t('totalTransactions', { count: 5 })
```

## Adicionando Novas Traduções

### 1. Adicionar nos arquivos de tradução

**Português** (`public/locales/pt/translation.json`):
```json
{
  "newKey": "Nova tradução em português"
}
```

**Inglês** (`public/locales/en/translation.json`):
```json
{
  "newKey": "New translation in English"
}
```

**Espanhol** (`public/locales/es/translation.json`):
```json
{
  "newKey": "Nueva traducción en español"
}
```

### 2. Usar no componente

```typescript
const { t } = useTranslation();
return <div>{t('newKey')}</div>;
```

## Configurações

### Detecção de Idioma

O sistema detecta automaticamente o idioma na seguinte ordem:
1. **localStorage**: Idioma salvo pelo usuário
2. **navigator**: Idioma do navegador
3. **htmlTag**: Tag HTML lang

### Fallback

Se uma tradução não for encontrada, o sistema usa o português como fallback.

### Debug

No modo de desenvolvimento, o i18n exibe logs de debug para facilitar o desenvolvimento.

## Estrutura de Traduções

### Organização por Seções

```json
{
  "common": {
    "loading": "Carregando...",
    "error": "Erro",
    "success": "Sucesso"
  },
  "auth": {
    "login": "Entrar",
    "register": "Registrar",
    "email": "E-mail",
    "password": "Senha"
  },
  "transactions": {
    "new": "Nova Transação",
    "amount": "Valor",
    "type": "Tipo",
    "recipient": "Destinatário"
  },
  "notifications": {
    "welcome": "Bem-vindo!",
    "transactionSuccess": "Transação realizada com sucesso",
    "transactionError": "Erro na transação"
  }
}
```

### Uso com Namespaces

```typescript
// Usar tradução específica de uma seção
t('auth:login')           // "Entrar"
t('transactions:amount')  // "Valor"

// Ou usar diretamente
t('login')                // "Entrar" (se não houver conflito)
```

## Funcionalidades Avançadas

### 1. Pluralização

```json
{
  "transactionCount": "{{count}} transação",
  "transactionCount_plural": "{{count}} transações"
}
```

```typescript
t('transactionCount', { count: 1 })  // "1 transação"
t('transactionCount', { count: 5 })  // "5 transações"
```

### 2. Formatação de Números

```typescript
import { formatCurrency } from '../utils/formatters';

const amount = 1234.56;
const formattedAmount = formatCurrency(amount, currentLanguage);
// pt: "R$ 1.234,56"
// en: "$1,234.56"
// es: "€1.234,56"
```

### 3. Formatação de Datas

```typescript
import { formatDate } from '../utils/formatters';

const date = new Date();
const formattedDate = formatDate(date, currentLanguage);
// pt: "15 de janeiro de 2024"
// en: "January 15, 2024"
// es: "15 de enero de 2024"
```

## Testes

### Executar testes do i18n

```bash
npm test -- --testPathPattern="i18n|LanguageSelector|useTranslation"
```

### Testes disponíveis

- `LanguageSelector.test.tsx`: Testa o componente de seleção de idioma
- `useTranslation.test.ts`: Testa o hook personalizado

### Exemplo de Teste

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSelector from './LanguageSelector';

describe('LanguageSelector', () => {
  it('should change language when option is selected', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'en');
    
    expect(select).toHaveValue('en');
  });
});
```

## Boas Práticas

1. **Use chaves descritivas**: Em vez de `t('msg')`, use `t('welcomeMessage')`
2. **Interpolação**: Use interpolação para valores dinâmicos
3. **Pluralização**: Use contadores para pluralização quando necessário
4. **Organização**: Mantenha as traduções organizadas por seções
5. **Consistência**: Use as mesmas chaves em todos os idiomas
6. **Namespace**: Use namespaces para organizar traduções por funcionalidade
7. **Fallback**: Sempre forneça traduções em português como fallback

## Exemplo de Uso Completo

```typescript
import React, { useEffect } from 'react';
import { useTranslation } from '../hooks';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionHistory = () => {
  const { t, currentLanguage } = useTranslation();
  
  const transactions = [
    { id: 1, amount: 100, date: new Date(), type: 'PIX' },
    { id: 2, amount: 250, date: new Date(), type: 'TED' }
  ];
  
  return (
    <div>
      <h1>{t('transactions:history')}</h1>
      <p>{t('transactions:totalCount', { count: transactions.length })}</p>
      
      {transactions.map(transaction => (
        <div key={transaction.id}>
          <span>{t('transactions:type')}: {t(`transactions:types.${transaction.type}`)}</span>
          <span>{t('transactions:amount')}: {formatCurrency(transaction.amount, currentLanguage)}</span>
          <span>{t('transactions:date')}: {formatDate(transaction.date, currentLanguage)}</span>
        </div>
      ))}
    </div>
  );
};
```

## Troubleshooting

### Problema: Tradução não aparece
- Verifique se a chave existe em todos os idiomas
- Confirme se o hook `useTranslation` está sendo usado
- Verifique se o componente está dentro do contexto do i18n
- Verifique se o arquivo de tradução está sendo carregado corretamente

### Problema: Idioma não muda
- Verifique se `changeLanguage` está sendo chamado
- Confirme se o localStorage está funcionando
- Verifique se não há erros no console
- Verifique se o arquivo de tradução do idioma existe

### Problema: Interpolação não funciona
- Verifique se as chaves estão corretas: `{{key}}`
- Confirme se os valores estão sendo passados corretamente
- Verifique se não há espaços extras nas chaves
- Verifique se o formato JSON está correto

### Problema: Arquivo de tradução não carrega
- Verifique se o caminho está correto: `public/locales/{idioma}/translation.json`
- Confirme se o arquivo JSON é válido
- Verifique se o servidor está servindo os arquivos estáticos
- Verifique se não há erros de CORS

## Performance e Otimização

### 1. Lazy Loading de Idiomas

```typescript
// Carregar idioma apenas quando necessário
const loadLanguage = async (language: string) => {
  if (!i18n.hasResourceBundle(language, 'translation')) {
    const bundle = await import(`../locales/${language}/translation.json`);
    i18n.addResourceBundle(language, 'translation', bundle.default);
  }
};
```

### 2. Memoização de Traduções

```typescript
import { useMemo } from 'react';

const MyComponent = () => {
  const { t, currentLanguage } = useTranslation();
  
  const translatedText = useMemo(() => {
    return t('complexTranslation', { 
      name: 'User',
      count: 5,
      date: new Date()
    });
  }, [t, currentLanguage]);
  
  return <div>{translatedText}</div>;
};
```

## Integração com Outras Funcionalidades

### 1. WebSocket Notifications

```typescript
// Notificações em tempo real com suporte a i18n
const handleWebSocketMessage = (message: any) => {
  const { t } = useTranslation();
  
  if (message.type === 'transaction') {
    showNotification({
      title: t('notifications:transactionReceived'),
      message: t('notifications:amountReceived', { 
        amount: formatCurrency(message.amount, currentLanguage) 
      })
    });
  }
};
```

### 2. Formulários

```typescript
// Validação de formulários com mensagens traduzidas
const validateForm = (values: any) => {
  const errors: any = {};
  
  if (!values.email) {
    errors.email = t('validation:emailRequired');
  }
  
  if (!values.password) {
    errors.password = t('validation:passwordRequired');
  }
  
  return errors;
};
```

## Recursos Adicionais

- **Documentação oficial do react-i18next**: https://react.i18next.com/
- **Guia de boas práticas**: https://www.i18next.com/overview/best-practices
- **Exemplos de uso**: https://github.com/i18next/react-i18next/tree/master/example
- **Formatação de números e datas**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
