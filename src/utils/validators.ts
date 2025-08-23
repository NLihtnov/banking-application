export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateDocument = (document: string): boolean => {
  const cleanDocument = document.replace(/\D/g, '');
  return cleanDocument.length === 11 || cleanDocument.length === 14;
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000;
};

export const validatePixKey = (pixKey: string): boolean => {
  return pixKey.length > 0;
};

export const validateBankData = (bank: string, agency: string, account: string): boolean => {
  return bank.length > 0 && agency.length > 0 && account.length > 0;
};
