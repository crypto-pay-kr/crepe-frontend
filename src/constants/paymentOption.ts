export interface PaymentOption {
  id: string;
  label: string;
  amount: string;
  insufficientBalance: boolean;
}