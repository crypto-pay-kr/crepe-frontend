import { X, Wallet, ShoppingCart } from "lucide-react";
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNavigate';
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useMemo, useRef } from 'react'
import CoinAssets from '@/components/coin/CoinAssets';

import { getCoinBalance } from '@/api/coin'

import { useTokenStore } from '@/constants/useToken'
import { useCoinStore } from '@/constants/useCoin'
import { useTickerData } from '@/hooks/useTickerData'
import { getTokenInfo } from '@/api/token'
import { BankProduct } from '@/types/token'
import TokenAssets from '@/components/token/my-product/TokenAssets'
import {Token} from '@/types/token'


export interface GetAllBalanceResponse {
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
    krw: string| number;
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
  const [tokenInfos, setTokenInfos] = useState<any[]>([]); // 서버에서 받은 토큰 정보 저장
  const [enrichedTokenBalance, setEnrichedTokenBalance] = useState<Token[]>([]);
  const tokenInfosFetched = useRef(false);

// 1. 최초 한 번만 서버 호출
  useEffect(() => {

    if (!tokenBalance.length || tokenInfosFetched.current) return;
    if (tokenBalance.some(token => token.krw && token.krw !== "- KRW")) return;
    const fetchTokenInfos = async () => {

      try {
        const infos = await Promise.all(
          tokenBalance.map(token => getTokenInfo(token.currency))
        );
        setTokenInfos(infos);
        tokenInfosFetched.current = true;
      } catch (e) {
        console.error("getTokenInfo 실패", e);
      }
    };

    fetchTokenInfos();
  }, [tokenBalance]);

// 2. tickerData 바뀔 때만 가격 계산
  useEffect(() => {
    if (!tokenInfos.length || !tickerData) return;

    const isAllInfosReady = tokenBalance.every(token =>
      tokenInfos.some(info => info.currency === token.currency)
    );
    if (!isAllInfosReady) return;

    let total = 0;
    const enriched = tokenBalance.map(token => {
      const info = tokenInfos.find(i => i.currency === token.currency);
      if (!info) return { ...token, krw: "- KRW" };

      const unitPrice = info.portfolios.reduce((sum: number, p: any) => {
        const price = tickerData[`KRW-${p.currency}`]?.trade_price ?? 0;
        return sum + ((p.amount ?? 0)-(p.nonAvailableAmount)) * price;
      }, 0) / (info.tokenBalance || 1);

      const totalKRW =token.balance * unitPrice;
      total += totalKRW;

      return {
        ...token,
        krw: totalKRW,
      };
    });

    setEnrichedTokenBalance(enriched);
    setTotalTokenBalanceKRW(total);
  }, [tokenInfos, tickerData,tokenBalance]);

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

      const balanceText = `${amount.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${item.currency}`;
      const krw = amount && krwRate
        ? `${amount * krwRate}`
        : 0;

      const formattedRate =
        direction === "EVEN" ? "-" :
          `${direction === "RISE" ? "+" : "-"}${(Math.abs(rate) * 100).toFixed(2)}%`;

      return {
        currency: item.currency,
        coinName: item.coinName,
        icon: item.coinImageUrl,
        balance: balanceText,
        krw: krw,
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
    const n= Number(coin.krw);
    return sum + n;
  }, 0);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="자산관리" disableBack />
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="px-4 py-6">
          <div className="overflow-hidden rounded-2xl bg-white px-6 py-8 shadow-sm transition hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="relative -top-2 mr-2 h-6 w-6 text-[#4B5EED] drop-shadow-sm" />
                <span className="relative -top-2 text-lg font-bold text-[#4B5EED]">
                  내 자산
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                  {totalBalanceKRW === 0 || totalTokenBalanceKRW === 0
                    ? '- KRW'
                    : (totalBalanceKRW + totalTokenBalanceKRW).toLocaleString(
                        'ko-KR',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )} KRW
                </h2>
              </h2>
              <button
                onClick={() => navigate('/transfer')}
                className="flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500"
              >
                송금
              </button>
            </div>
          </div>

          <div className="mt-5 w-full">
            <button
              className="w-full rounded-xl bg-[#4B5EED] py-3 text-base font-medium text-white shadow-sm"
              onClick={handleExchangeClick}
            >
              K-토큰 상품 가입
            </button>
          </div>
        </div>

        <div className="mb-4 flex border-b border-gray-200 bg-white">
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'coin' ? 'border-b-2 border-[#4B5EED] text-[#4B5EED]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('coin')}
          >
            가상 자산
          </button>
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'token' ? 'border-b-2 border-[#4B5EED] text-[#4B5EED]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('token')}
          >
            K-토큰
          </button>
        </div>

        <div className="px-4">
          {activeTab === 'coin' ? (
            <CoinAssets coins={coins} onClick={handleCoinClick} />
          ) : (
            <TokenAssets
              tokens={enrichedTokenBalance}
              onClick={handleExchangeClick}
            />
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}