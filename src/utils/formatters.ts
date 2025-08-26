export const formatCurrency = (value: number, language: string = 'pt'): string => {
  const currencyConfigs = {
    pt: { locale: 'pt-BR', currency: 'BRL' },
    en: { locale: 'en-US', currency: 'USD' },
    es: { locale: 'es-ES', currency: 'EUR' },
  };

  const config = currencyConfigs[language as keyof typeof currencyConfigs] || currencyConfigs.pt;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDocument = (document: string): string => {
  const cleanDocument = document.replace(/\D/g, '');
  
  if (cleanDocument.length === 11) {
    return cleanDocument.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  if (cleanDocument.length === 14) {
    return cleanDocument.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return document;
};

export const applyCurrencyMask = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  
  if (!numericValue) return '';
  
  const numberValue = parseInt(numericValue) / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue);
};

export const removeCurrencyMask = (value: string): number => {
  const numericValue = value.replace(/\D/g, '');
  
  if (!numericValue) return 0;
  
  return parseInt(numericValue) / 100;
};

export const formatCurrencyForDisplay = (value: number): string => {
  if (value === 0) return '';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
