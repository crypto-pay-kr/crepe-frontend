//BankTokenAccount 타입 관리
export interface BankTokenAccount {
  bankTokenId: number;
  bankId: number;
  bankTokenName: string;
  balances: string[];
  currency: string;
  products: SubscribeResponse[];
}

export interface SubscribeResponse {
  id: number;
  productName: string;
  status: string;
  startDate: string;
  endDate: string;
  balance: number;
  baseInterestRate: number;
  appliedPreferentialRates: number | null;
  productType: string;
  maxMonthlyPayment: number;
  preTaxInterest: number;
}

export interface BankToken {
  bankTokenName: string;
  currency: string;
  totalBalance: string;
  products: Product[];
}

export interface Product {
  subscribeId: number;
  name: string;
  amount: string; //product balance
  status: string;
  rate: string;
  maxMonthlyPayment: number;
  preTaxInterest: number;
}


export interface SubscribeTransaction {
  eventType: string;
  amount: string;
  date: string;
}
