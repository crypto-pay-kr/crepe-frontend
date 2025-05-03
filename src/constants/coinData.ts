import React from 'react';

export interface Coin {
  currency: string;
  coinName: string;
  icon: React.ReactNode;
  bg: string;
  balance: string;
  krw: string;
  change: string;
}

export interface Order {
  id: string;
  status: 'completed' | 'cancelled';
  reason?: string;
  storeName: string;
  orderItems: string;
  orderDate: string;
  orderNumber: string;
  storeLocation: string;
}

