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
  name: string;
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
    const pricePerToken = calculateTokenPrice(totalCapital, tokenInfo.tokenBalance ?? 0);
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
    <div className="flex h-full flex-col bg-gray-50">
      <Header
        title={`${bank} 상세`}
        onBackClick={() => navigate("/my/coin")}
      />

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
          <div className="overflow-hidden rounded-2xl py-10 px-6 bg-white p-6 shadow-sm transition hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {tokenMeta?.bankImageUrl && (
                  <img
                    src={tokenMeta.bankImageUrl}
                    alt={tokenMeta.name}
                    className="h-8 w-8 rounded-full mr-2"
                  />
                )}
                <p className="text-lg font-semibold sm:text-xl md:text-2xl">
                  총 보유
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold sm:text-xl md:text-2xl">
                  {balance.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {bank}
                </p>
                <p className="text-sm text-gray-500 sm:text-base">
                  {tokenPrice > 0
                    ? `${(tokenPrice * balance).toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KRW`
                    : '- KRW'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#4B5EED] py-3 font-medium text-base text-white shadow hover:bg-[#3a4ed3] transition-all"
              onClick={() =>
                setTimeout(() => {
                  navigate(`/token/exchange/${bank}`, { state: { bank, isUser } });
                }, 200)
              }
            >
              <span className="text-base">토큰 환전</span>
            </button>
          </div>

          {/* ✅ 거래 내역 헤더 */}
          <div className="flex items-center justify-between">
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
                  const krw = Math.abs(tx.amount) * tokenPrice
                  const isDeposit =
                    tx.type === "EXCHANGE" ? tx.amount > 0 : // 토큰 매수 = 입금, 매도 = 출금
                      tx.type === "TRANSFER" ? tx.amount > 0 :
                        tx.type === "SUBSCRIBE" ? tx.amount > 0 :
                          tx.type === "PAY" ? tx.status !== "PENDING" : // 정산완료만 입금 처리
                            tx.amount > 0;

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
                            ? tx.amount < 0
                              ? "토큰 매도"
                              : "토큰 매수"
                            : tx.type === "SUBSCRIBE"
                              ? tx.amount < 0
                                ? "상품 예치 완료"
                                : "상품 해지 및 만기 입금"
                              : tx.type === "TRANSFER"
                                ? tx.amount > 0
                                  ? `${tx.name ?? ''}님에게서 받은 송금`
                                  : `${tx.name ?? ''}님에게 송금 완료`
                                : tx.type === "PAY"
                                  ? tx.status === "PENDING"
                                    ? "정산 대기중"
                                    : "정산 완료"
                                  : "-"
                        }
                        balance={
                          tx.afterBalance !== undefined && tx.afterBalance !== null
                            ? `${Number(tx.afterBalance).toFixed(2)} ${bank}`
                            : "-"
                        }
                        amount={`${Math.abs(Number(tx.amount)).toFixed(2)} ${bank}`}
                        krw={Number(krw).toFixed(2)}
                        isDeposit={
                          tx.type === "EXCHANGE"
                            ? tx.amount >0
                            : tx.type === "TRANSFER"
                              ? tx.amount > 0
                          : tx.type === "SUBSCRIBE"
                          ? tx.amount > 0
                          : tx.type === "PAY"
                          ? tx.status === "PENDING"
                          : tx.amount < 0
                        }
                        showAfterBalance={tx.status === "ACCEPTED"}
                        originalAmount={Number(tx.amount)}
                        transactionType={tx.type}
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

        </div>

      </main>

      <BottomNav />
    </div>
  )
}