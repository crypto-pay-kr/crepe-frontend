type CoinOrderRequest = {
  storeId: number;
  orderDetails: { menuId: number; menuCount: number }[];
  paymentType: 'COIN';
  currency: string;
  exchangeRate: number;
};

type VoucherOrderRequest = {
  storeId: number;
  orderDetails: { menuId: number; menuCount: number }[];
  paymentType: 'VOUCHER';
  voucherSubscribeId: number;
};

export type OrderRequest = CoinOrderRequest | VoucherOrderRequest;