import { User, UserProps } from '../User';

describe('User Entity', () => {
  const mockUserProps: UserProps = {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'password123',
    balance: 1000.00,
    transactionPassword: '123456',
  };

  it('should create a user with valid props', () => {
    const user = new User(mockUserProps);

    expect(user.id).toBe(1);
    expect(user.name).toBe('João Silva');
    expect(user.email).toBe('joao@example.com');
    expect(user.balance).toBe(1000.00);
  });

  it('should update balance correctly', () => {
    const user = new User(mockUserProps);
    user.updateBalance(1500.00);

    expect(user.balance).toBe(1500.00);
  });

  it('should throw error when trying to set negative balance', () => {
    const user = new User(mockUserProps);

    expect(() => user.updateBalance(-100)).toThrow('Saldo não pode ser negativo');
  });

  it('should validate transaction password correctly', () => {
    const user = new User(mockUserProps);

    expect(user.validateTransactionPassword('123456')).toBe(true);
    expect(user.validateTransactionPassword('wrong')).toBe(false);
  });

  it('should check if user can make transaction', () => {
    const user = new User(mockUserProps);

    expect(user.canMakeTransaction(500)).toBe(true);
    expect(user.canMakeTransaction(1500)).toBe(false);
  });

  it('should convert to JSON correctly', () => {
    const user = new User(mockUserProps);
    const json = user.toJSON();

    expect(json).toEqual(mockUserProps);
  });
});
