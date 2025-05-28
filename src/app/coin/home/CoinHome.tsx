import { X, Wallet, ShoppingCart } from "lucide-react";
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNavigate';
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useMemo } from 'react'
import CoinAssets from '@/components/coin/CoinAssets';
import TokenAssets, { BankProduct } from '@/components/token/my-product/TokenAssets'
import { getCoinBalance } from '@/api/coin'

import { useTokenStore } from '@/constants/useToken'
import { useCoinStore } from '@/constants/useCoin'
import { useTickerData } from '@/hooks/useTickerData'
import { calculateTokenPrice } from '@/utils/exchangeCalculator'
import { getTokenInfo } from '@/api/token'




interface GetAllBalanceResponse {
  balance: {
    coinImageUrl: string;
    coinName: string;
    currency: string;
    balance: number;
  }[];
  bankTokenInfo: {
    bankImageUrl: string;
    currency: string;
    name: string;
    balance: number;
    krw: string;
    product:BankProduct[];
  }[];

}

export default function CoinHome() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'coin' | 'token'>('coin');
  const [coinBalance, setCoinBalance] = useState<GetAllBalanceResponse['balance']>([]);
  const [tokenBalance, setTokenBalance] = useState<GetAllBalanceResponse['bankTokenInfo']>([]);
  const tickerData = useTickerData();
  const [totalTokenBalanceKRW, setTotalTokenBalanceKRW] = useState(0);

  useEffect(() => {
  if (!tokenBalance.length || !tickerData) return;
  if (tokenBalance.some(token => token.krw && token.krw !== "- KRW")) return;
    const fetchAllTokenInfo = async () => {
      try {
        const tokenInfos = await Promise.all(
          tokenBalance.map(token => getTokenInfo(token.currency))
        );

        let total = 0;

        // 토큰별 가격 저장용
        const enrichedTokens = tokenBalance.map((token) => {
          const info = tokenInfos.find(i => i.currency === token.currency);
          if (!info) return { ...token, krw: "- KRW" };

          const unitPrice = info.portfolios.reduce((sum: number, p: any) => {
            const price = tickerData[`KRW-${p.currency}`]?.trade_price ?? 0;
            return sum + (p.amount ?? 0) * price;
          }, 0) / (info.totalSupply || 1);

          const totalKRW = Math.floor(token.balance * unitPrice);
          total += totalKRW;

          return {
            ...token,
            krw: `${totalKRW.toLocaleString()} KRW`
          };
        });

        setTokenBalance(enrichedTokens);
        setTotalTokenBalanceKRW(total);
      } catch (e) {
        console.error("토큰 정보 불러오기 실패:", e);
      }
    };

    fetchAllTokenInfo();
  }, [tokenBalance.length, tickerData]);



  // 잔액 - 초기 1회만 로딩
  useEffect(() => {
    const loadBalances = async () => {
      try {

        const data: GetAllBalanceResponse = await getCoinBalance();
        setCoinBalance(data.balance);
        setTokenBalance(data.bankTokenInfo);
        useTokenStore.getState().setTokens(data.bankTokenInfo);
        useCoinStore.getState().setCoins(data.balance);

      } catch (e) {
        console.error("잔액 불러오기 실패", e);
      }
    };
    loadBalances();
  }, []);

  // 준비되지 않은 값은 "-" 형태로 처리해 로딩 중에도 UI가 먼저 뜰 수 있게 함.
  const coins = useMemo(() => {
    return coinBalance.map((item) => {
      const amount = item.balance;
      const data = tickerData[`KRW-${item.currency}`];

      const krwRate = data?.trade_price ?? 0;
      const rate = data?.signed_change_rate ?? 0;
      const direction = data?.change ?? 'EVEN';

      const balanceText = `${amount} ${item.currency}`;
      const krwText = amount && krwRate
        ? `${Math.floor(amount * krwRate).toLocaleString()} KRW`
        : `- KRW`;

      const formattedRate =
        direction === "EVEN" ? "-" :
          `${direction === "RISE" ? "+" : "-"}${(Math.abs(rate) * 100).toFixed(2)}%`;

      return {
        currency: item.currency,
        coinName: item.coinName,
        icon: item.coinImageUrl,
        balance: balanceText,
        krw: krwText,
        change: formattedRate,
        changeDirection: direction,
      };
    });
  }, [coinBalance, tickerData]);

  const handleCoinClick = (symbol: string) => {
    navigate(`/coin-detail/${symbol}`);
  };

  const handleExchangeClick = () => {
    navigate(`/token/onsale/products`);
  };

  const totalBalanceKRW = coins.reduce((sum, coin) => {
    const n = Number(coin.krw.replace(/[^0-9]/g, ''));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="자산관리" />
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="px-4 py-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-500 p-5 shadow-lg">
            <div className="mb-4 flex items-center">
              <Wallet className="mr-2 h-6 w-6 text-blue-100" />
              <span className="text-lg font-medium text-blue-100">총 자산</span>
            </div>
            <h2 className="mb-1 text-3xl font-bold text-white">{totalTokenBalanceKRW+totalBalanceKRW} KRW</h2>
            <div className="flex items-center text-green-300">
            </div>
          </div>
          <div className="mt-5 w-full">
            <button
              className="w-full bg-[#0a2e64] text-white py-2 rounded-xl font-medium text-base shadow-sm"
              onClick={handleExchangeClick}
            >
              K-토큰 상품 가입
            </button>
          </div>
        </div>

        <div className="mb-4 flex border-b border-gray-200 bg-white">
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'coin' ? 'border-b-2 border-indigo-400 text-indigo-400' : 'text-gray-500'}`}
            onClick={() => setActiveTab('coin')}
          >
            가상 자산
          </button>
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'token' ? 'border-b-2 border-indigo-400 text-indigo-400' : 'text-gray-500'}`}
            onClick={() => setActiveTab('token')}
          >
            K-토큰
          </button>
        </div>

        <div className="px-4">
          {activeTab === 'coin' ? (
            <CoinAssets coins={coins} onClick={handleCoinClick} />
          ) : (
            <TokenAssets tokens={tokenBalance} onClick={handleExchangeClick} />
          )}
        </div>

        <button
          onClick={() => navigate('/my/orders')}
          className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-500"
          aria-label="주문 내역으로 이동"
        >
          <ShoppingCart className="h-6 w-6 stroke-white" />
        </button>

      </main>
      <BottomNav />
    </div>
  );
}