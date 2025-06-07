import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import React, { useEffect, useMemo, useState } from 'react'
import Button from '@/components/common/Button';
import { getCoinBalanceByCurrency } from '@/api/coin'
import { ArrowUpDown } from 'lucide-react'
import { fetchTokenBalance, getTokenInfo, requestExchange } from '@/api/token'
import {
  calculateAvailableCapital,
  calculateTokenPrice,
  calculateMaxExchangeCoin,
  calculateMaxExchangeToken, calculateConversion,
} from '@/utils/exchangeCalculator'
import { useTokenStore } from '@/constants/useToken';
import { useCoinStore } from '@/constants/useCoin';
import { useTickerData } from '@/hooks/useTickerData'
import { ChevronDown } from 'lucide-react';
import { ApiError } from '@/error/ApiError'
import { toast } from 'react-toastify' // 아이콘 import 추가
import { v4 as uuidv4 } from 'uuid';
interface Portfolio {
  currency: string;
  amount: number;
  nonAvailableAmount?: number;
}
export default function TokenExchangePage() {
  const navigate = useNavigate();
  const { bank } = useParams();
  const [tokenInfo, setTokenInfo] = useState<any | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("XRP");
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [tokenCapital, setTokenCapital] =useState<number>(0);
  const [isCoinToToken, setIsCoinToToken] = useState(true);
  const [myCoinBalance, setMyCoinBalance] = useState<number>(0);
  const [myTokenBalance, setMyTokenBalance] = useState<number>(0);
  const selectedPortfolio = tokenInfo?.portfolios.find(
    (p: Portfolio) => p.currency === selectedCurrency
  );
  const coinList = useCoinStore(state => state.coins);
  const tokenList = useTokenStore(state => state.tokens);
  const coinMeta = coinList.find(c => c.currency === selectedCurrency);
  const tokenMeta = tokenList.find(t => t.currency === bank);
  const tickerData = useTickerData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCurrencyClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const [isHovered, setIsHovered] = useState(false);



  // 토큰 정보 불러오기
  useEffect(() => {
    if (!bank) return;
    const fetchAllData = async () => {
      const [info] = await Promise.all([
        getTokenInfo(bank),
      ]);
      setTokenInfo(info);


      setSelectedCurrency(prev =>
        prev || (info.portfolios.length > 0 ? info.portfolios[0].currency : "")
      );
    };
    fetchAllData();
  }, [bank]);


  // 환전 수량 계산 (코인 < - > 토큰 )
  useEffect(() => {
    if (!tokenInfo || !selectedCurrency ) return;

    const totalCapital = calculateAvailableCapital(tokenInfo.portfolios, tickerData);
    setTokenCapital(Number(totalCapital.toFixed(2)));

    const tokenPrice = calculateTokenPrice(totalCapital, tokenInfo.tokenBalance);
    const rate = tickerData[`KRW-${selectedCurrency}`]?.trade_price ?? 0;
    if (!rate || !tokenPrice) return;

    const result = calculateConversion(isCoinToToken, coinAmount, tokenAmount, rate, tokenPrice);
    if (isCoinToToken) {
      setTokenAmount(Number(result.toFixed(8)));
    } else {
      setCoinAmount(Number(result.toFixed(8)));
    }
  }, [tokenInfo, selectedCurrency, coinAmount, tokenAmount, isCoinToToken,tickerData]);



  const tokenPrice = useMemo(() => {
    return calculateTokenPrice(tokenCapital, tokenInfo?.tokenBalance ?? 0);
  }, [tokenCapital, tokenInfo?.tokenBalance]);

  //최대로 교환 가능한 토큰 수량
  const maxExchangeToken = useMemo(() =>
      calculateMaxExchangeToken({ tokenInfo, selectedCurrency, tokenCapital, tickerData }),
    [tokenInfo, selectedCurrency, tokenCapital, tickerData]
  );

  //최대로 교환가능한 코인 수량
  const maxExchangeCoin = useMemo(() =>
      calculateMaxExchangeCoin({ tokenInfo, selectedCurrency, tokenCapital, tickerData }),
    [tokenInfo, selectedCurrency, tokenCapital, tickerData]
  );

  //코인을 원화로 환산한 값
  const coinToKRW = useMemo(() => {
    if (!coinAmount || !selectedCurrency || !tickerData) return 0;
    const rate = tickerData[`KRW-${selectedCurrency}`]?.trade_price ?? 0;
    return coinAmount * rate;
  }, [coinAmount, selectedCurrency, tickerData]);

  //토큰을 원화로 환산한 값
  const tokenToKRW = useMemo(() => {
    if (!tokenAmount || !tokenPrice) return 0;
    return tokenAmount * tokenPrice;
  }, [tokenAmount, tokenPrice]);


  const handleExchangeClick = async () => {
    if (!tokenInfo)return console.error('Exchange error');
    const filteredCoinRates: Record<string, number> = {};
    tokenInfo.portfolios.forEach((p: any) => {
      const currency = p.currency;
      const rate = tickerData[`KRW-${currency}`]?.trade_price;
      if (rate !== undefined && rate !== null) {
        filteredCoinRates[currency] = Number(rate.toFixed(2));
      } else {
       toast(` ${currency} 시세를 찾을 수 없습니다.`);
      }
    });
    if (isLoading) return;
    setIsLoading(true);
    try {
      const traceId=uuidv4();
      await requestExchange(isCoinToToken, {
        fromCurrency: isCoinToToken ? selectedCurrency : tokenInfo.currency,
        toCurrency: isCoinToToken ? tokenInfo.currency : selectedCurrency,
        coinRates: filteredCoinRates,
        tokenAmount: tokenAmount ?? 0,
        coinAmount: coinAmount ?? 0,
        traceId
      });
      navigate("/token/exchange/complete", {
        state: {
          bank: tokenInfo.currency,
          fromCurrency: selectedCurrency,
          toCurrency: tokenInfo.currency,
          fromAmount: coinAmount,
          toAmount: tokenAmount,
          isCoinToToken: isCoinToToken
        }
      });
    } catch (e) {
      if (e instanceof ApiError) {
        toast(`${e.message}`);
      } else {
        toast('예기치 못한 오류가 발생했습니다.');
      }
    }
    finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (!bank) return;
    //현재 사용자의 토큰 잔액 불러오기
    fetchTokenBalance(bank)
      .then(setMyTokenBalance)
      .catch(err => {
        console.error('토큰 잔액 조회 실패:', err);
        setMyTokenBalance(0);
      });

    // 현재 사용자의 코인 잔액 불러오기
    getCoinBalanceByCurrency(selectedCurrency)
      .then((res) => {
        setMyCoinBalance(res.balance); // balance 필드만 추출
      })
      .catch((err) => {
        console.error('코인 잔액 조회 실패:', err);
        setMyCoinBalance(0);
      });
  }, [bank, selectedCurrency]);

  const isExchangeable = useMemo(() => {
    if (!tokenInfo || !selectedCurrency) return false;

    const portfolio = tokenInfo.portfolios.find((p: any) => p.currency === selectedCurrency);
    if (!portfolio) return false;

    const available = (portfolio.amount ?? 0) - (portfolio.nonAvailableAmount ?? 0);

    return available > 0;
  }, [tokenInfo, selectedCurrency]);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="토큰 환전" />
      <main className="flex-1 overflow-scroll p-5">
        {/* 위 상단 입력 박스 */}
        <div className="mb-6 mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
          <div className="flex mt-3 items-start justify-between">
            {/* 좌측: 코인/토큰 이미지 + 이름 + 보유 */}
            <div className="flex flex-col items-start">
              <div className="mb-1 flex items-center space-x-3">
                {isCoinToToken
                  ? coinMeta?.coinImageUrl && (
                      <img
                        src={coinMeta.coinImageUrl}
                        alt={coinMeta.coinName}
                        className="h-10 w-10 rounded-full"
                      />
                    )
                  : tokenMeta?.bankImageUrl && (
                      <img
                        src={tokenMeta.bankImageUrl}
                        alt={tokenMeta.name}
                        className="h-10 w-10 rounded-full"
                      />
                    )}
                <div className="text-lg font-semibold">
                  {isCoinToToken
                    ? tokenInfo?.portfolios?.length > 0 && (
                        <div className="relative ml-4">
                          <div
                            className="group flex cursor-pointer items-center gap-2"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={handleCurrencyClick}
                          >
                            <span className="text-lg font-bold text-gray-800">
                              {selectedCurrency}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 text-gray-400 transition-all duration-200 ${
                                isHovered || isDropdownOpen
                                  ? 'rotate-180 text-gray-600'
                                  : ''
                              }`}
                            />
                          </div>

                          {isDropdownOpen && (
                            <div className="absolute left-0 top-full z-10 mt-2 min-w-[120px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                              {tokenInfo.portfolios.map((item: Portfolio) => (
                                <button
                                  key={item.currency}
                                  onClick={() => {
                                    setSelectedCurrency(item.currency)
                                    setIsDropdownOpen(false)
                                  }}
                                  className="w-full px-4 py-2 text-left font-medium text-gray-800 transition-colors hover:bg-gray-50"
                                >
                                  {item.currency}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    : tokenInfo?.currency}
                </div>
              </div>
              <p className="text-xs text-gray-400">
                보유:{' '}
                {isCoinToToken
                  ? `${myCoinBalance.toLocaleString('ko-KR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ${selectedCurrency}`
                  : `${myTokenBalance.toLocaleString('ko-KR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ${bank}`}
              </p>
            </div>

            {/* 우측: 입력창 */}
            <div className="mt-1 flex w-1/2 flex-col items-end space-y-1">
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full border-none bg-transparent text-right text-xl font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={isCoinToToken
                  ? coinAmount.toFixed(2)
                  : tokenAmount.toFixed(2)}
                onChange={e => {
                  const value = Number(e.target.value)
                  const max = isCoinToToken ? myCoinBalance : myTokenBalance
                  const clamped = Math.min(value, max)
                  isCoinToToken
                    ? setCoinAmount(clamped)
                    : setTokenAmount(clamped)
                }}
                placeholder="0"
              />
              <p className="text-sm text-gray-500">
                ≈ {isCoinToToken ? `${coinToKRW.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KRW` : `${tokenToKRW.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KRW`}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            {[25, 50, 75, 100].map(percent => {
              const maxBalance = isCoinToToken ? myCoinBalance : myTokenBalance
              return (
                <button
                  key={percent}
                  onClick={() => {
                    const amount =((maxBalance * percent) / 100)
                    isCoinToToken
                      ? setCoinAmount(Number(amount))
                      : setTokenAmount(Number(amount))
                  }}
                  className={`rounded-full px-4 py-2 text-sm text-black font-medium transition-colors bg-gray-100`}
                >
                  {percent}%
                </button>
              )
            })}
          </div>

        </div>
        <div className="my-4 flex justify-center">
          <button
            onClick={() => setIsCoinToToken(!isCoinToToken)}
            className="h-10 w-10 rounded-full border border-gray-300 bg-white shadow transition hover:bg-gray-100"
            aria-label="Switch direction"
          >
            <ArrowUpDown size={18} className="m-auto text-gray-600" />
          </button>
        </div>

        {/* 아래 결과 박스 */}
        <div className="mb-6 min-h-[110px] rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex flex-wrap items-center justify-between">
            {/* 좌측: 로고 + 이름 */}
            <div className="flex items-center gap-0.5">
              {!isCoinToToken
                ? coinMeta?.coinImageUrl && (
                    <img
                      src={coinMeta.coinImageUrl}
                      alt={coinMeta.coinName}
                      className="h-10 w-10 rounded-full"
                    />
                  )
                : tokenMeta?.bankImageUrl && (
                    <img
                      src={tokenMeta.bankImageUrl}
                      alt={tokenMeta.name}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
              {/* 셀렉트 or 고정 텍스트 */}
              {isCoinToToken ? (
                <p className="ml-4 text-lg font-bold">{tokenInfo?.currency}</p>
              ) : (
                tokenInfo?.portfolios?.length > 0 && (
                  <div className="relative ml-4">
                    <div
                      className="group flex cursor-pointer items-center gap-2"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onClick={handleCurrencyClick}
                    >
                      <span className="text-lg font-bold text-gray-800">
                        {selectedCurrency}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-all duration-200 ${
                          isHovered || isDropdownOpen
                            ? 'rotate-180 text-gray-600'
                            : ''
                        }`}
                      />
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute left-0 top-full z-10 mt-2 min-w-[120px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                        {tokenInfo.portfolios.map((item: Portfolio) => (
                          <button
                            key={item.currency}
                            onClick={() => {
                              setSelectedCurrency(item.currency)
                              setIsDropdownOpen(false)
                            }}
                            className="w-full px-4 py-2 text-left font-medium text-gray-800 transition-colors hover:bg-gray-50"
                          >
                            {item.currency}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* 우측: 환전 결과 */}
            <div className="text-blue-600 min-w-[100px] text-right text-xl font-bold">
              {isCoinToToken && tokenAmount !== null
                ? `${tokenAmount.toLocaleString('ko-KR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ${tokenInfo?.currency}`
                : coinAmount !== null
                  ? `${coinAmount.toLocaleString('ko-KR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ${selectedCurrency}`
                  : '-'}
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="mt-2 space-y-1 text-sm text-gray-500">
          <p>
            * 잔여 교환 가능{' '}
            {isCoinToToken
              ? `${selectedCurrency} → ${tokenInfo?.currency} : ${Number(maxExchangeToken).toLocaleString('ko-KR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} ${tokenInfo?.currency}`
              : `${tokenInfo?.currency} → ${selectedCurrency} : ${Number(maxExchangeCoin).toLocaleString('ko-KR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} ${selectedCurrency}`}
          </p>
          {isCoinToToken && !isExchangeable && (
            <p className="text-red-500 text-sm mt-2">
              교환 가능한 수량이 없습니다.
            </p>
          )}
        </div>

        <div className="mb-20 border-none p-5">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-xl font-bold">토큰 구성</h2>
            <p className="text-sm text-gray-500">
              총 자본금 {tokenCapital?.toLocaleString('ko-KR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
              KRW
            </p>
          </div>

          {tokenInfo?.portfolios.map((p: any) => {
            const swappedRatio =
              p.nonAvailableAmount && p.amount > 0
                ? (p.nonAvailableAmount / p.amount) * 100
                : 0

            return (
              <div key={p.currency} className="mb-4">
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {p.currency}
                  </span>
                  <span className="text-sm text-gray-600">
                    교환됨 {swappedRatio.toLocaleString('ko-KR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}%
                  </span>
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="bg-indigo-500"
                    style={{ width: `${100 - swappedRatio}%` }}
                  />
                  <div
                    className="bg-fuchsia-400"
                    style={{ width: `${swappedRatio}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <Button
          text="환전 요청"
          onClick={handleExchangeClick}
          className="w-full rounded-lg py-3 text-lg font-semibold shadow-md"
          disabled={isLoading || (isCoinToToken && !isExchangeable)}
        />
      </main>
      <BottomNav />
    </div>
  )
}