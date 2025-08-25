# Internacionalização (i18n) - Banking App

Este documento descreve a implementação de internacionalização no projeto Banking App.

## Visão Geral

O projeto agora suporta três idiomas:
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

### 1. Adicionar no arquivo `src/i18n.ts`

```typescript
resources: {
  pt: {
    translation: {
      // Adicionar nova chave
      newKey: 'Nova tradução em português',
    }
  },
  en: {
    translation: {
      // Adicionar nova chave
      newKey: 'New translation in English',
    }
  },
  es: {
    translation: {
      // Adicionar nova chave
      newKey: 'Nueva traducción en español',
    }
  }
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

## Testes

### Executar testes do i18n

```bash
npm test -- --testPathPattern="i18n|LanguageSelector|useTranslation"
```

### Testes disponíveis

- `LanguageSelector.test.tsx`: Testa o componente de seleção de idioma
- `useTranslation.test.ts`: Testa o hook personalizado

## Boas Práticas

1. **Use chaves descritivas**: Em vez de `t('msg')`, use `t('welcomeMessage')`
2. **Interpolação**: Use interpolação para valores dinâmicos
3. **Pluralização**: Use contadores para pluralização quando necessário
4. **Organização**: Mantenha as traduções organizadas por seções
5. **Consistência**: Use as mesmas chaves em todos os idiomas

## Exemplo de Uso Completo

```typescript
import React from 'react';
import { useTranslation } from '../hooks';

const WelcomePage = () => {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  
  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('welcomeMessage', { name: 'Usuário' })}</p>
      
      <div>
        <label>Idioma atual: {currentLanguage}</label>
        <select 
          value={currentLanguage} 
          onChange={(e) => changeLanguage(e.target.value)}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
```

## Troubleshooting

### Problema: Tradução não aparece
- Verifique se a chave existe em todos os idiomas
- Confirme se o hook `useTranslation` está sendo usado
- Verifique se o componente está dentro do contexto do i18n

### Problema: Idioma não muda
- Verifique se `changeLanguage` está sendo chamado
- Confirme se o localStorage está funcionando
- Verifique se não há erros no console

### Problema: Interpolação não funciona
- Verifique se as chaves estão corretas: `{{key}}`
- Confirme se os valores estão sendo passados corretamente
- Verifique se não há espaços extras nas chaves
