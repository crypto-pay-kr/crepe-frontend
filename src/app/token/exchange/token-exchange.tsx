import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import React, { useEffect, useMemo, useState } from 'react'
import { BankLogo } from '@/components/common/BankLogo';
import Button from '@/components/common/Button';
import { fetchCoinPrices } from '@/api/coin';
import { ArrowUpDown } from 'lucide-react'
import { COIN_INFO } from '@/app/coin/home/CoinHome'
import { getTokenInfo, requestExchange } from '@/api/token'
import {
  calculateAvailableCapital,
  calculateTokenPrice,
  calculateTokenAmount,
  calculateCoinAmountFromToken,
  calculateMaxTokenExchangeable
} from "@/utils/exchangeCalculator";
export default function TokenExchangePage() {
  const navigate = useNavigate();
  const { bank } = useParams();

  const [coinPrice, setCoinPrice] = useState<Record<string, number>>({});
  const [tokenInfo, setTokenInfo] = useState<any | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("XRP");
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [tokenCapital, setTokenCapital] =useState<number>(0);
  const [isCoinToToken, setIsCoinToToken] = useState(true);

  // 시세 및 토큰 정보 불러오기 5초 마다
  useEffect(() => {
    if (!bank) return;

    const fetchAllData = async () => {
      const [info, prices] = await Promise.all([
        getTokenInfo(bank),
        fetchCoinPrices()
      ]);
      setTokenInfo(info);
      setCoinPrice(prices);

      // 🔥 최초 로딩일 때만 설정
      setSelectedCurrency(prev =>
        prev || (info.portfolios.length > 0 ? info.portfolios[0].currency : "")
      );
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, [bank]);

  // 환전 수량 계산 (코인 < - > 토큰 )
  useEffect(() => {
    if (!tokenInfo || !selectedCurrency || !coinPrice) return;

    const totalCapital = calculateAvailableCapital(tokenInfo.portfolios, coinPrice);
    setTokenCapital(Number(totalCapital.toFixed(8)));

    const tokenPrice = calculateTokenPrice(totalCapital, tokenInfo.totalSupply);
    const selectedRate = coinPrice[`KRW-${selectedCurrency}`];

    if (!selectedRate || !tokenPrice) return;

    if (isCoinToToken) {
      if (!coinAmount) {
        setTokenAmount(0);
        return;
      }
      const result = calculateTokenAmount(coinAmount, selectedRate, tokenPrice);
      setTokenAmount(Number(result.toFixed(8)));
    } else {
      if (!tokenAmount) {
        setCoinAmount(0);
        return;
      }
      const krwValue = tokenAmount * tokenPrice;
      const resultCoin = krwValue / selectedRate;
      setCoinAmount(Number(resultCoin.toFixed(8)));
    }
  }, [tokenInfo, selectedCurrency, coinPrice, coinAmount, tokenAmount, isCoinToToken]);

  const tokenPrice = useMemo(() => {
    return calculateTokenPrice(tokenCapital, tokenInfo?.totalSupply ?? 0);
  }, [tokenCapital, tokenInfo?.totalSupply]);

  const selectedRate = useMemo(() => {
    return coinPrice[`KRW-${selectedCurrency}`] || 0;
  }, [coinPrice, selectedCurrency]);


  useEffect(() => {
    if (!tokenInfo || !selectedRate || !tokenPrice) return;

    if (isCoinToToken) {
      if (!coinAmount) {
        setTokenAmount(0);
        return;
      }
      const result = calculateTokenAmount(coinAmount, selectedRate, tokenPrice);
      setTokenAmount(Number(result.toFixed(8)));
    } else {
      if (!tokenAmount) {
        setCoinAmount(0);
        return;
      }
      const krwValue = tokenAmount * tokenPrice;
      const resultCoin = krwValue / selectedRate;
      setCoinAmount(Number(resultCoin.toFixed(8)));
    }
  }, [coinAmount, tokenAmount, tokenInfo, selectedRate, tokenPrice, isCoinToToken]);


  // 최대로 교환 가능한 토큰 수량 계산
  const maxExchangeToken = useMemo(() => {
    if (!tokenInfo || !selectedCurrency || !tokenCapital || !tokenInfo.totalSupply) return '-';

    const tokenPrice = calculateTokenPrice(tokenCapital, tokenInfo.totalSupply);
    const coinRate = coinPrice[`KRW-${selectedCurrency}`] || 0;
    const portfolio = tokenInfo.portfolios.find(p => p.currency === selectedCurrency);
    const available = (portfolio?.amount ?? 0) - (portfolio?.nonAvailableAmount ?? 0);

    const maxToken = calculateMaxTokenExchangeable(available, coinRate, tokenPrice);
    return maxToken.toFixed(8);
  }, [tokenInfo, selectedCurrency, coinPrice, tokenCapital]);

  // 최대로 교환 가능한 코인 수량 계산
  const maxExchangeCoin = useMemo(() => {
    if (
      !tokenInfo || !selectedCurrency || !tokenInfo.totalSupply || !tokenCapital) return '-';

    const tokenPrice = calculateTokenPrice(tokenCapital, tokenInfo.totalSupply);
    const coinRate = coinPrice[`KRW-${selectedCurrency}`] || 0;

    const availableToken = tokenInfo.tokenBalance ?? 0;
    const coinAmount = calculateCoinAmountFromToken(availableToken, tokenPrice, coinRate);

    return coinAmount.toFixed(8);
  }, [tokenInfo, selectedCurrency, coinPrice, tokenCapital]);


  const handleExchangeClick = async () => {
    if (!tokenInfo || !tokenPrice || !selectedRate) return;

    // 포트폴리오에 있는 코인 시세만 추출
    const filteredCoinRates: Record<string, number> = {};
    tokenInfo.portfolios.forEach((p: any) => {
      const currency = p.currency;
      const rate = coinPrice[`KRW-${currency}`];
      if (rate) {
        filteredCoinRates[currency] = Number(rate.toFixed(4));
      }
    });

    try {
      await requestExchange(isCoinToToken, {
        fromCurrency: isCoinToToken ? selectedCurrency : tokenInfo.currency,
        toCurrency: isCoinToToken ? tokenInfo.currency : selectedCurrency,
        coinRates: filteredCoinRates, // 여기에 정제된 시세만 전달
        tokenAmount: tokenAmount ?? 0,
        coinAmount: coinAmount ?? 0
      });
      alert("환전 요청 완료되었습니다.");
      navigate("/token/exchange/complete", {
        state: {
          bank: tokenInfo.currency, // 예: "HTK"
          fromCurrency: selectedCurrency,
          toCurrency: tokenInfo.currency,
          fromAmount: coinAmount,
          toAmount: tokenAmount,
          isCoinToToken: isCoinToToken
        }
      });
    } catch (error) {
      console.error(error);
      alert("환전 요청에 실패했습니다.");
    }
  };



  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="토큰 환전" />

      <main className="flex-1 overflow-auto p-5">
        {/* 위 상단 입력 박스 */}
        <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tokenInfo && (
                <>
                  {/* 아이콘 */}
                  <div className="flex items-center gap-3">
                    {isCoinToToken ? (
                      COIN_INFO[selectedCurrency] && (
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${COIN_INFO[selectedCurrency].bg}`}
                        >
                          {COIN_INFO[selectedCurrency].icon}
                        </div>
                      )
                    ) : (
                      <BankLogo bank={tokenInfo.currency} />
                    )}
                  </div>

                  {/* 셀렉트 or 고정 텍스트 */}
                  {isCoinToToken ? (
                    tokenInfo?.portfolios?.length > 0 && (
                      <select
                        value={selectedCurrency}
                        onChange={e => setSelectedCurrency(e.target.value)}
                        className="rounded border border-none px-3 py-1 text-lg font-bold outline-none"
                      >
                        {tokenInfo.portfolios.map((item: any) => (
                          <option key={item.currency} value={item.currency}>
                            {item.currency}
                          </option>
                        ))}
                      </select>
                    )
                  ) : (
                    <p className="text-lg font-bold">{tokenInfo.currency}</p>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="min-w-[140px] appearance-none border-none bg-transparent text-right text-lg outline-none"
                style={{
                  MozAppearance: 'textfield',
                  WebkitAppearance: 'none',
                }}
                value={isCoinToToken ? coinAmount : (tokenAmount ?? 0)}
                onChange={e =>
                  isCoinToToken
                    ? setCoinAmount(Number(e.target.value))
                    : setTokenAmount(Number(e.target.value))
                }
                placeholder="0"
              />

              <span className="text-lg font-semibold">
                {isCoinToToken ? selectedCurrency : tokenInfo?.currency}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-center">
          <button
            onClick={() => setIsCoinToToken(!isCoinToToken)}
            className="border-blue-300 hover:bg-blue-50 flex items-center justify-center rounded-full border bg-white p-3 shadow transition"
            aria-label="Switch direction"
          >
            <ArrowUpDown size={20} className="text-blue-800" />
          </button>
        </div>

        {/* 아래 결과 박스 */}
        <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            {/* 좌측: 로고 + 이름 */}
            <div className="flex items-center gap-2">
              {isCoinToToken
                ? tokenInfo?.currency && <BankLogo bank={tokenInfo.currency} />
                : COIN_INFO[selectedCurrency] && (
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${COIN_INFO[selectedCurrency].bg}`}
                    >
                      {COIN_INFO[selectedCurrency].icon}
                    </div>
                  )}
              {/* 셀렉트 or 고정 텍스트 */}
              {isCoinToToken ? (
                <p className="text-lg font-bold">{tokenInfo?.currency}</p>
              ) : (
                tokenInfo?.portfolios?.length > 0 && (
                  <select
                    value={selectedCurrency}
                    onChange={e => setSelectedCurrency(e.target.value)}
                    className="rounded border border-none px-3 py-1 text-lg font-bold outline-none"
                  >
                    {tokenInfo.portfolios.map((item: any) => (
                      <option key={item.currency} value={item.currency}>
                        {item.currency}
                      </option>
                    ))}
                  </select>
                )
              )}
            </div>

            {/* 우측: 환전 결과 */}
            <div className="text-blue-600 min-w-[100px] text-right text-xl font-bold">
              {isCoinToToken
                ? tokenAmount !== null
                  ? `${tokenAmount} ${tokenInfo?.currency}`
                  : '-'
                : coinAmount !== null
                  ? `${coinAmount} ${selectedCurrency}`
                  : '-'}
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="mt-2 space-y-1 text-sm text-gray-500">
          <p>
            * 잔여 교환 가능{' '}
            {isCoinToToken
              ? `${selectedCurrency} → ${tokenInfo?.currency} : ${maxExchangeToken} ${tokenInfo?.currency}`
              : `${tokenInfo?.currency} → ${selectedCurrency} : ${maxExchangeCoin} ${selectedCurrency}`}
          </p>
        </div>
      </main>

      <div className="mb-28 border-none p-5">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-bold">토큰 구성</h2>
          <p className="text-sm text-gray-500">
            총 자본금 {tokenCapital?.toFixed(8).toLocaleString()} KRW
          </p>
        </div>

        {tokenInfo?.portfolios.map((p: any) => {
          const rate = coinPrice[`KRW-${p.currency}`] || 0
          const swappedRatio =
            p.nonAvailableAmount && p.amount > 0
              ? (p.nonAvailableAmount / p.amount) * 100
              : 0

          return (
            <div key={p.currency} className="mb-4">
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {p.currency} ({COIN_INFO[p.currency]?.coinName})
                </span>
                <span className="text-sm text-gray-600">
                  교환됨 {swappedRatio.toFixed(1)}%
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

      <div className="border-t border-gray-50 bg-gray-50 p-5 shadow-lg">
        <Button
          text="환전 요청"
          onClick={handleExchangeClick}
          className="w-full rounded-lg py-3 text-lg font-semibold shadow-md"
        />
      </div>
      <BottomNav />
    </div>
  )
}