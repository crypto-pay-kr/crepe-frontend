
export interface Order {
  id: string;
  status: string;
  reason?: string;
  storeName: string;
  orderItems: string;
  orderDate: string;
  orderNumber: string;
  storeLocation: string;
  totalPrice: string;
}


type CoinOrderRequest = {
  storeId: number;
  orderDetails: { menuId: number; menuCount: number }[];
  paymentType: 'COIN';
  currency: string;
  exchangeRate: number;
  traceId: string;
};

type VoucherOrderRequest = {
  storeId: number;
  orderDetails: { menuId: number; menuCount: number }[];
  currency: string;
  paymentType: 'VOUCHER';
  voucherSubscribeId: number;
  exchangeRate: number;
  traceId: string;
};

export type OrderRequest = CoinOrderRequest | VoucherOrderRequest;