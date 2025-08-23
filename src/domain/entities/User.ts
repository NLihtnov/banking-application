export interface UserProps {
  id: number;
  name: string;
  email: string;
  password: string;
  balance: number;
  transactionPassword: string;
}

export class User {
  private _id: number;
  private _name: string;
  private _email: string;
  private _password: string;
  private _balance: number;
  private _transactionPassword: string;

  constructor(props: UserProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._balance = props.balance;
    this._transactionPassword = props.transactionPassword;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get balance(): number {
    return this._balance;
  }

  get password(): string {
    return this._password;
  }

  get transactionPassword(): string {
    return this._transactionPassword;
  }

  updateBalance(newBalance: number): void {
    if (newBalance < 0) {
      throw new Error('Saldo não pode ser negativo');
    }
    this._balance = newBalance;
  }

  canMakeTransaction(amount: number): boolean {
    return this._balance >= amount;
  }

  validateTransactionPassword(password: string): boolean {
    return this._transactionPassword === password;
  }

  toJSON(): UserProps {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      password: this._password,
      balance: this._balance,
      transactionPassword: this._transactionPassword,
    };
  }
}
