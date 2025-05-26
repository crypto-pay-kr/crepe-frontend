// src/stores/BankStore.ts
import { create } from 'zustand'
import { GetMyTokenList } from '@/api/token'
import { BankToken, BankTokenAccount, Product } from '@/types/BankTokenAccount'

interface BankStoreState {
  bankTokens: BankToken[] | null;
  fetchBankTokens: () => Promise<void>;
}

export const useBankStore = create<BankStoreState>((set) => ({
  bankTokens: null,

  fetchBankTokens: async () => {
    try {
      const response = await GetMyTokenList();

      const bankTokens: BankToken[] = response.map((account: BankTokenAccount) => {
        const totalBalance = account.balances
          .map(balance => parseFloat(balance))
          .reduce((sum, value) => sum + value, 0)
          .toFixed(2);

        const myproducts: Product[] = account.products.map(product => ({
          subscribeId: product.id,
          name: product.productName,
          amount: product.balance.toFixed(2),
          status: product.status === 'ACTIVE' ? '진행 중' : '만료',
          rate: `${product.baseInterestRate.toFixed(2)}%`,
          maxMonthlyPayment: product.maxMonthlyPayment,
          preTaxInterest: product.preTaxInterest
        }))

        return {
          bankTokenName: account.bankTokenName,
          currency: account.currency,
          totalBalance,
          products: myproducts,
        };
      }).sort((a: BankToken, b: BankToken) => a.bankTokenName.localeCompare(b.bankTokenName));

      set({ bankTokens });
    } catch (error) {
      console.error('토큰 계좌 조회 실패:', error);
      set({ bankTokens: [] });
    }
  },
}))
