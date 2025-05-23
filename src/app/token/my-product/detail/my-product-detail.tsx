import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNavigate';
import TransactionItem from '@/components/coin/TransactionItem';
import { useRef, useEffect, useState, useMemo } from 'react';
import { BankLogo } from '@/components/common/BankLogo';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchTokenBalance,
  fetchTokenExchangeHistory, getTokenInfo,
} from '@/api/token'
import { fetchCoinPrices } from '@/api/coin'

interface Transaction {
  id: number;
  amount: number;
  afterBalance: number;
  transferredAt: string;
  status: 'ACCEPTED' | 'PENDING' | 'FAILED'; // 필요한 status만 추가
}

export default function TokenGroupDetailPage() {
  const { bank } = useParams<{ bank: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isUser = location.state?.isUser ?? false;
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [coinPrice, setCoinPrice] = useState<Record<string, number>>({});
  const [tokenInfo, setTokenInfo] = useState<any | null>(null);
  const observerElemRef = useRef<HTMLDivElement | null>(null);

  // 1. 토큰 가격 계산 함수
  const calculateTokenPrice = (totalCapital: number, totalSupply: number): number => {
    if (totalSupply === 0) return 0;
    return totalCapital / totalSupply;
  };

  // 2. 상태값
  const [tokenCapital, setTokenCapital] = useState<number>(0);
  const [tokenPrice, setTokenPrice] = useState<number>(0);

  // 3. useEffect로 계산
  useEffect(() => {
    if (!tokenInfo || !coinPrice) return;

    const totalCapital = tokenInfo.portfolios.reduce((acc: number, p: any) => {
      const price = coinPrice[`KRW-${p.currency}`] ?? 0;
      return acc + (p.amount ?? 0) * price;
    }, 0);

    setTokenCapital(totalCapital);
    const pricePerToken = calculateTokenPrice(totalCapital, tokenInfo.totalSupply ?? 0);
    setTokenPrice(pricePerToken);
  }, [tokenInfo, coinPrice]);


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['tokenExchangeHistory', bank],
    queryFn: ({ pageParam = 0 }) =>
      fetchTokenExchangeHistory(bank ?? '', pageParam, 5),
    getNextPageParam: (lastPage) => {
      if (lastPage.last || (lastPage.content?.length || 0) === 0) {
        return undefined;
      }

      return lastPage.pageable.pageNumber + 1;
    },
    enabled: !!bank,
    initialPageParam: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (observerElemRef.current) observer.observe(observerElemRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


  useEffect(() => {
    if (!bank) return;

    fetchTokenBalance(bank)
      .then((bal) => setBalance(bal))
      .catch((err) => {
        console.error('잔액 조회 실패:', err);
        setBalance(0);
      });
  }, [bank]);


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
    };
    fetchAllData();
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, [bank]);




  if (!bank) return <div className="p-4">잘못된 경로입니다.</div>;

  return (
    <div className="flex h-full flex-col bg-gray-50 relative">
      <Header
        title={`${bank} 상세`}
        onBackClick={() => {
          setTimeout(() => navigate(-1), 200);
        }}
      />

      <main
        className={`flex-1 overflow-auto p-3 sm:p-4 md:p-5 transition-all duration-500 ease-in-out`}
      >
        {/* 총 보유 금액 카드 */}
        <div
          className="mb-4 sm:mb-5 md:mb-6 rounded-xl md:rounded-2xl border border-gray-200 md:border-2 bg-white p-4 sm:p-8 md:p-12 shadow-[0_2px_10px_rgba(0,0,0,0.04)] md:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-500 ease-in-out"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/*<BankLogo bank={bank as "WTK" | "STK" | "HTK" | "KTK" | "NTK"} />*/}
              <p className="text-lg sm:text-xl md:text-2xl font-semibold ml-3">총 보유</p>
            </div>
            <div className="text-right">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {balance.toFixed(2)} {bank}
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                {(tokenPrice*balance).toFixed(2)} KRW
              </p>
            </div>
          </div>
        </div>

        {/* 환전 버튼 */}
        <div
          className="mb-4 sm:mb-5 md:mb-6 w-full"
        >
          <button
            className="w-full flex items-center justify-center gap-2 bg-[#0a2e64] text-white py-3 rounded-xl font-semibold shadow transition-all hover:bg-[#081d40]"
            onClick={() => {
              setTimeout(() => {
                navigate(`/token/exchange/${bank}`, { state: { bank, isUser } });
              }, 200);
            }}
          >

            <span className="text-base text-white">토큰 환전</span>
          </button>
        </div>

        {/* 거래 내역 헤더 */}
        <div
          className="mb-3 sm:mb-4 flex items-center justify-between"
        >
          <h3 className="text-base sm:text-lg font-bold text-gray-800">거래 내역</h3>
          <button className="flex items-center text-xs sm:text-sm font-medium text-[#0a2e64]">
            전체보기
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
            >
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 거래 내역 리스트 */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 pb-16 sm:pb-10 text-sm sm:text-base md:text-lg lg:text-xl">

          {Array.isArray(data?.pages) && data.pages.length > 0 ? (
            data.pages.map((page, pageIndex) =>
              page.content.map((tx: Transaction, idx: number) => {
                const tokenPrice = calculateTokenPrice(tokenCapital, tokenInfo?.totalSupply ?? 0);
                const krw = Math.floor(tx.amount * tokenPrice).toLocaleString();

                return (
                  <div
                    key={tx.id || `${tx.transferredAt}-${tx.amount}-${pageIndex}-${idx}`}
                    className="transition-all duration-300 ease-in-out"
                  >
                    <TransactionItem
                      date={new Date(tx.transferredAt).toLocaleString()}
                      type={tx.amount > 0 ? '환전 입금 완료' : '환전 출금 완료'}
                      balance={`${tx.afterBalance?.toFixed(2) ?? '-'} ${bank}`}
                      amount={`${tx.amount.toFixed(2)} ${bank}`}
                      krw={`${krw} KRW`}
                      isDeposit={tx.amount > 0}
                      showAfterBalance={tx.status === 'ACCEPTED'}
                    />
                  </div>
                );
              })
            )
          ) : (
            !isLoading && (
              <div className="flex justify-center items-center py-10 text-gray-500">
                <p>거래 내역이 없습니다</p>
              </div>
            )
          )}

          <div ref={observerElemRef} className="h-10 flex items-center justify-center mt-4">
            {isFetchingNextPage && (
              <div className="w-8 h-8 rounded-full border-2 border-t-[#0a2e64] border-gray-200 animate-spin" />
            )}
            {!hasNextPage && data?.pages[0]?.content.length > 0 && (
              <p className="text-gray-500 text-sm">더 이상 거래 내역이 없습니다</p>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}