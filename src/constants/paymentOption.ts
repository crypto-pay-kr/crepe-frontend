export interface PaymentOption {
  id: string;
  label: string;
  amount: string;
  insufficientBalance: boolean;
  type: "COIN" | "VOUCHER";
  voucherId?: number;
  convertedPrice?: string;
  balance?: string; 
}