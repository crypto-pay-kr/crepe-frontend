// stores/useCoinStore.ts
import { create } from 'zustand';

interface Coin {
  coinImageUrl: string;
  coinName: string;
  currency: string;
  balance: number;
}

interface CoinStore {
  coins: Coin[];
  setCoins: (coins: Coin[]) => void;
  getCoinImage: (currency: string) => string | undefined;
}

export const useCoinStore = create<CoinStore>((set, get) => ({
  coins: [],
  setCoins: (coins) => set({ coins }),
  getCoinImage: (currency) =>
    get().coins.find((c) => c.currency === currency)?.coinImageUrl,
}));