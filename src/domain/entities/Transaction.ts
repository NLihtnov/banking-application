export type TransactionType = 'TED' | 'PIX';

export interface TransactionProps {
  id: number;
  userId: number;
  type: TransactionType;
  amount: number;
  recipientName: string;
  recipientDocument: string;
  bank?: string;
  agency?: string;
  account?: string;
  pixKey?: string;
  date: string;
  balance: number;
}

export class Transaction {
  private _id: number;
  private _userId: number;
  private _type: TransactionType;
  private _amount: number;
  private _recipientName: string;
  private _recipientDocument: string;
  private _bank?: string;
  private _agency?: string;
  private _account?: string;
  private _pixKey?: string;
  private _date: string;
  private _balance: number;

  constructor(props: TransactionProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._type = props.type;
    this._amount = props.amount;
    this._recipientName = props.recipientName;
    this._recipientDocument = props.recipientDocument;
    this._bank = props.bank;
    this._agency = props.agency;
    this._account = props.account;
    this._pixKey = props.pixKey;
    this._date = props.date;
    this._balance = props.balance;
  }

  get id(): number {
    return this._id;
  }

  get userId(): number {
    return this._userId;
  }

  get type(): TransactionType {
    return this._type;
  }

  get amount(): number {
    return this._amount;
  }

  get recipientName(): string {
    return this._recipientName;
  }

  get recipientDocument(): string {
    return this._recipientDocument;
  }

  get bank(): string | undefined {
    return this._bank;
  }

  get agency(): string | undefined {
    return this._agency;
  }

  get account(): string | undefined {
    return this._account;
  }

  get pixKey(): string | undefined {
    return this._pixKey;
  }

  get date(): string {
    return this._date;
  }

  get balance(): number {
    return this._balance;
  }

  validate(): void {
    if (this._amount <= 0) {
      throw new Error('Valor da transação deve ser maior que zero');
    }

    if (!this._recipientName.trim()) {
      throw new Error('Nome do destinatário é obrigatório');
    }

    if (!this._recipientDocument.trim()) {
      throw new Error('Documento do destinatário é obrigatório');
    }

    if (this._type === 'TED') {
      if (!this._bank || !this._agency || !this._account) {
        throw new Error('Dados bancários são obrigatórios para TED');
      }
    }

    if (this._type === 'PIX') {
      if (!this._pixKey) {
        throw new Error('Chave PIX é obrigatória');
      }
    }
  }

  toJSON(): TransactionProps {
    return {
      id: this._id,
      userId: this._userId,
      type: this._type,
      amount: this._amount,
      recipientName: this._recipientName,
      recipientDocument: this._recipientDocument,
      bank: this._bank,
      agency: this._agency,
      account: this._account,
      pixKey: this._pixKey,
      date: this._date,
      balance: this._balance,
    };
  }
}
