import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCoinBalance } from '@/api/coin'; // 실제 API 함수명으로 변경
import { Token } from '@/types/token'
import { GetAllBalanceResponse } from '@/app/coin/home/CoinHome'

interface TokenStore {
  tokens: Token[];
  isLoading: boolean;
  setTokens: (tokens: Token[]) => void;
  fetchTokens: () => Promise<void>;
  getTokenImage: (currency: string) => string | undefined;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      tokens: [],
      isLoading: false,

      setTokens: (tokens) => set({ tokens }),

      fetchTokens: async () => {
        try {
          set({ isLoading: true });
          const tokens:GetAllBalanceResponse = await getCoinBalance(); // 실제 API 호출
          set({ tokens: tokens.bankTokenInfo, isLoading: false });
        } catch (error) {
          console.error('토큰 데이터 로딩 실패:', error);
          set({ tokens: [], isLoading: false });
        }
      },

      getTokenImage: (currency) =>
        get().tokens.find((t) => t.currency === currency)?.bankImageUrl,
    }),
    {
      name: 'token-store', // localStorage에 저장될 키
      partialize: (state) => ({ tokens: state.tokens }), // tokens만 저장
    }
  )
);