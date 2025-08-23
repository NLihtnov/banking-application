export const TRANSACTION_TYPES = {
  TED: 'TED',
  PIX: 'PIX',
} as const;

export const FILTER_PERIODS = {
  LAST_7_DAYS: 7,
  LAST_15_DAYS: 15,
  LAST_30_DAYS: 30,
  LAST_90_DAYS: 90,
} as const;

export const SORT_OPTIONS = {
  DATE: 'date',
  AMOUNT: 'amount',
} as const;

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/register',
  TRANSACTION: '/transaction',
  HISTORY: '/history',
} as const;

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'Senha deve ter pelo menos 6 caracteres',
  INVALID_DOCUMENT: 'Documento inválido',
  INVALID_AMOUNT: 'Valor inválido',
  INSUFFICIENT_BALANCE: 'Saldo insuficiente',
  INVALID_TRANSACTION_PASSWORD: 'Senha de transação incorreta',
  USER_NOT_FOUND: 'Usuário não encontrado',
  EMAIL_ALREADY_EXISTS: 'Email já cadastrado',
} as const;
