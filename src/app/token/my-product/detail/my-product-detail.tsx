import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNavigate';
import TransactionItem from '@/components/coin/TransactionItem';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchTokenBalance,
  fetchTokenExchangeHistory, getTokenInfo,
} from '@/api/token'
import { useTokenStore } from '@/constants/useToken';
import { useTickerData } from '@/hooks/useTickerData'

interface Transaction {
  id: number;
  amount: number;
  afterBalance: number;
  transferredAt: string;
  status: 'ACCEPTED' | 'PENDING' | 'FAILED';
  type:string;
}

export default function TokenGroupDetailPage() {
  const { bank } = useParams<{ bank: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isUser = location.state?.isUser ?? false;
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [tokenInfo, setTokenInfo] = useState<any | null>(null);
  const observerElemRef = useRef<HTMLDivElement | null>(null);
  const tokenList = useTokenStore(state => state.tokens); // 스토어에서 가져옴
  const tickerData = useTickerData();

// bank에 해당하는 토큰 정보 찾기
  const tokenMeta = tokenList.find(t => t.currency === bank);
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
    if (!tokenInfo || !tickerData) return;

    const totalCapital = tokenInfo.portfolios.reduce((acc: number, p: any) => {
      const price = tickerData[`KRW-${p.currency}`]?.trade_price ?? 0;
      return acc + (p.amount ?? 0) * price;
    }, 0);

    setTokenCapital(totalCapital);
    const pricePerToken = calculateTokenPrice(totalCapital, tokenInfo.totalSupply ?? 0);
    setTokenPrice(pricePerToken);
  }, [tokenInfo, tickerData]);

  useEffect(() => {
    if (!bank) return;

    const fetchAllData = async () => {
      const [info] = await Promise.all([
        getTokenInfo(bank),

      ]);
      setTokenInfo(info);

    };
    fetchAllData();
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, [bank]);


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







  if (!bank) return <div className="p-4">잘못된 경로입니다.</div>;

  return (
    <div className="relative flex h-full flex-col bg-gray-50">
      <Header
        title={`${bank} 상세`}
        onBackClick={() => {navigate('/my/coin')}}
      />

      <main
        className={`flex-1 overflow-auto p-3 transition-all duration-500 ease-in-out sm:p-4 md:p-5`}
      >
        {/* 총 보유 금액 카드 */}
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-500 ease-in-out sm:mb-5 sm:p-8 md:mb-6 md:rounded-2xl md:border-2 md:p-12 md:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {tokenMeta?.bankImageUrl && (
                <img
                  src={tokenMeta.bankImageUrl}
                  alt={tokenMeta.name}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <p className="ml-3 text-lg font-semibold sm:text-xl md:text-2xl">
                총 보유
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold sm:text-xl md:text-2xl">
                {balance.toFixed(2)} {bank}
              </p>
              <p className="text-sm text-gray-500 sm:text-base">
                {(tokenPrice * balance).toFixed(2)} KRW
              </p>
            </div>
          </div>
        </div>

        {/* 환전 버튼 */}
        <div className="mb-4 w-full sm:mb-5 md:mb-6">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4B5EED] py-3 font-semibold text-white shadow transition-all hover:bg-[#4B5EED]"
            onClick={() => {
              setTimeout(() => {
                navigate(`/token/exchange/${bank}`, { state: { bank, isUser } })
              }, 200)
            }}
          >
            <span className="text-base text-white">토큰 환전</span>
          </button>
        </div>

        {/* 거래 내역 헤더 */}
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h3 className="text-base font-bold text-gray-800 sm:text-lg">
            거래 내역
          </h3>
        </div>

        {/* 거래 내역 리스트 */}
        <div className="space-y-4 pb-16 text-sm sm:space-y-5 sm:pb-10 sm:text-base md:space-y-6 md:text-lg lg:text-xl">
          {Array.isArray(data?.pages) && data.pages.length > 0
            ? data.pages.map((page, pageIndex) =>
                page.content.map((tx: Transaction, idx: number) => {
                  const tokenPrice = calculateTokenPrice(
                    tokenCapital,
                    tokenInfo?.totalSupply ?? 0
                  )
                  const krw = Math.floor(
                    tx.amount * tokenPrice
                  ).toLocaleString()

                  return (
                    <div
                      key={
                        tx.id ||
                        `${tx.transferredAt}-${tx.amount}-${pageIndex}-${idx}`
                      }
                      className="transition-all duration-300 ease-in-out"
                    >
                      <TransactionItem
                        date={new Date(tx.transferredAt).toLocaleString()}
                        type={
                          tx.type === "EXCHANGE"
                            ? tx.amount > 0
                              ? "환전 입금 완료"
                              : "환전 출금 완료"
                            : tx.type === "SUBSCRIBE"
                              ? tx.amount < 0
                                ? "상품 예치 완료"
                                : "상품 해지 및 만기 입금"
                              : "-"
                        }
                        balance={`${tx.afterBalance?.toFixed(2) ?? '-'} ${bank}`}
                        amount={`${tx.amount.toFixed(2)} ${bank}`}
                        krw={`${krw} KRW`}
                        isDeposit={tx.amount < 0}
                        showAfterBalance={tx.status === 'ACCEPTED'}
                      />
                    </div>
                  )
                })
              )
            : !isLoading && (
                <div className="flex items-center justify-center py-10 text-gray-500">
                  <p>거래 내역이 없습니다</p>
                </div>
              )}

          <div
            ref={observerElemRef}
            className="mt-4 flex h-10 items-center justify-center"
          >
            {isFetchingNextPage && (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0a2e64]" />
            )}
            {!hasNextPage && data?.pages[0]?.content.length > 0 && (
              <p className="text-sm text-gray-500">
                더 이상 거래 내역이 없습니다
              </p>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}