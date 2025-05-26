// stores/useTokenStore.ts
import { create } from 'zustand';

interface BankProduct {
  subId: string;
  name: string;
  balance: number;
}

export interface Token {
  bankImageUrl: string;
  currency: string;
  name: string;
  balance: number;
  product: BankProduct[];
}

interface TokenStore {
  tokens: Token[];
  setTokens: (tokens: Token[]) => void;
  getTokenImage: (currency: string) => string | undefined;
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  tokens: [],
  setTokens: (tokens) => set({ tokens }),
  getTokenImage: (currency) =>
    get().tokens.find((t) => t.currency === currency)?.bankImageUrl,
}));