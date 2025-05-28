
// 해결책 1: 스토어에 fetch 함수 추가 및 persist 적용

// stores/useCoinStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCoinBalance } from '@/api/coin'; // 실제 API 함수명으로 변경

interface Coin {
  coinImageUrl: string;
  coinName: string;
  currency: string;
  balance: number;
}

interface CoinStore {
  coins: Coin[];
  isLoading: boolean;
  setCoins: (coins: Coin[]) => void;
  fetchCoins: () => Promise<void>;
  getCoinImage: (currency: string) => string | undefined;
}

export const useCoinStore = create<CoinStore>()(
  persist(
    (set, get) => ({
      coins: [],
      isLoading: false,

      setCoins: (coins) => set({ coins }),

      fetchCoins: async () => {
        try {
          set({ isLoading: true });
          const coins = await getCoinBalance(); // 실제 API 호출
          set({ coins:coins.balance, isLoading: false });
        } catch (error) {
          console.error('코인 데이터 로딩 실패:', error);
          set({ coins: [], isLoading: false });
        }
      },

      getCoinImage: (currency) =>
        get().coins.find((c) => c.currency === currency)?.coinImageUrl,
    }),
    {
      name: 'coin-store', // localStorage에 저장될 키
      partialize: (state) => ({ coins: state.coins }), // coins만 저장
    }
  )
);