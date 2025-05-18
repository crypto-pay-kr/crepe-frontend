import { CircleDollarSign, X } from 'lucide-react'
import Header from "@/components/common/Header"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import React, { useEffect, useState, useRef } from 'react'
import BottomNav from '@/components/common/BottomNavigate'
import TransactionItem from "@/components/coin/TransactionItem"
import CoinAddressModal from "@/components/coin/CoinAddressModal";
import {
  isAccountAddressRegistered,
  getCoinBalanceByCurrency,
  getCoinHistory, fetchCoinPrices,
} from '@/api/coin'
import { useInfiniteQuery } from '@tanstack/react-query'

export interface PaymentHistory {
  status: 'ACCEPTED' | 'PENDING' | 'FAILED'; // PaymentStatus enum
  amount: number;
  transferredAt: string; // ISO string
  afterBalance: number;
  type: string;

}
const coinMeta = {
  XRP: {
    name: "리플",
    icon: <X className="w-5 h-5 md:w-6 md:h-6" />,
    bg: "bg-gray-200",
    balance: "0.3 XRP",
    krw: "1000 KRW",
  },
  SOL: {
    name: "솔라나",
    icon: (
      <div className="w-4 h-4 md:w-5 md:h-5 flex flex-col justify-between">
        <div className="h-[2px] bg-white" />
        <div className="h-[2px] bg-white" />
        <div className="h-[2px] bg-white" />
      </div>
    ),
    bg: "bg-[#9945FF]",
    balance: "0.3 SOL",
    krw: "1000 KRW",
  },
  USDT: {
    name: "테더",
    icon: <div className="text-white text-xs md:text-sm font-bold">T</div>,
    bg: "bg-[#26A17B]",
    balance: "0.3 USDT",
    krw: "1000 KRW",
  },
}

export default function CoinDetailPage() {
  // Add CSS keyframes for animations
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(styleSheet);
  const { symbol } = useParams()
  const location = useLocation()
  const isUser = location.state?.isUser ?? false

  const [addressStatus, setAddressStatus] = useState<'ACTIVE' | 'REGISTERING' | 'NOT_REGISTERED' | null>(null);
  const [showModal, setShowModal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('day')
  const [addressInfo, setAddressInfo] = useState<{
    address: string;
    tag?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);

  const navigate = useNavigate()
  const isSeller = location.pathname.includes('/store');
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const coin = coinMeta[symbol as keyof typeof coinMeta]
  const [balance, setBalance] = useState<number>(0);

  // Handle page transitions
  useEffect(() => {
    // Start with loading state
    setIsLoading(true);

    // After a short delay, show the page with a fade-in effect
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPageVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [symbol]);

  if (!coin) return <div className="p-4">잘못된 경로입니다.</div>

  // 입금 주소가 유효한지 확인
  useEffect(() => {
    if (symbol) {
      isAccountAddressRegistered(symbol)
        .then((res) => {
          setAddressStatus(res.addressRegistryStatus);
          if (res.addressRegistryStatus === 'ACTIVE' || res.addressRegistryStatus === 'REGISTERING') {
            setAddressInfo({ address: res.address, tag: res.tag });
          }
        })
        .catch((err) => {
          console.error("등록된 주소없음", err);
          setAddressStatus('NOT_REGISTERED');
          setAddressInfo(null);
        });
    }
  }, [symbol]);


  const [prices, setPrices] = useState<{ [key: string]: number }>({
    "KRW-XRP": 0,
    "KRW-USDT": 0,
    "KRW-SOL": 0,
  });


  // 코인 시세 가져오기
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const updatedPrices = await fetchCoinPrices();
        setPrices(updatedPrices);
      } catch (err) {
        console.error("시세 조회 실패", err);
      }
    };

    loadPrices();

    const interval = setInterval(() => {
      loadPrices();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  // 코인 잔액 조회
  useEffect(() => {
    const fetchBalance = async () => {
      if (!symbol) return;

      try {
        const data = await getCoinBalanceByCurrency(symbol);
        setBalance(data.balance ?? 0);
      } catch (e) {
        console.warn("잔액 조회 실패:", e);
      }
    };

    fetchBalance();
  }, [symbol]);


  const observerElemRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['coinHistory', symbol],
    queryFn: getCoinHistory,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.pageable.pageNumber + 1;
    },
    enabled: !!symbol,
    initialPageParam: 0
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




  return (
    <div className="flex h-full flex-col bg-gray-50 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-50">
          <div className="w-12 h-12 rounded-full border-4 border-t-[#0a2e64] border-gray-200 animate-spin"></div>
        </div>
      )}

      <Header
        title={`${coin.name} 상세`}
        onBackClick={() => {
          // Add fade-out transition before navigating
          setPageVisible(false);
          setTimeout(() => navigate('/my/coin'), 200);
        }}
      />

      <main
        className={`flex-1 overflow-auto p-3 sm:p-4 md:p-5 transition-all duration-500 ease-in-out ${
          pageVisible
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-4'
        }`}>
        {/* 보유 자산 카드 */}
        <div
          className="mb-4 sm:mb-5 md:mb-6 rounded-xl md:rounded-2xl border border-gray-200 md:border-2 bg-white p-4 sm:p-8 md:p-12 shadow-[0_2px_10px_rgba(0,0,0,0.04)] md:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-500 ease-in-out"
          style={{
            animationName: 'fadeIn',
            animationDuration: '0.6s',
            animationFillMode: 'both',
            animationDelay: '0.3s'
          }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 ${coin.bg} mr-2 sm:mr-3 md:mr-4 flex items-center justify-center rounded-full`}
              >
                {coin.icon}
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold">총 보유</p>
            </div>
            <div className="text-right">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {balance.toFixed(8)} {symbol}
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                = {(balance * (prices[`KRW-${symbol}`] ?? 0)).toLocaleString()} KRW
              </p>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div
          className="mb-4 sm:mb-5 md:mb-6 w-full"
          style={{
            animationName: 'slideIn',
            animationDuration: '0.6s',
            animationFillMode: 'both',
            animationDelay: '0.5s'
          }}>
          <div className="flex gap-2 sm:gap-3">
            {/* 코인 충전 버튼 */}
            <button
              className="flex flex-1 items-center justify-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl bg-[#0a2e64] py-1.5 sm:py-2 text-base sm:text-lg font-semibold text-white shadow"
              onClick={() => {
                // Add transition before navigation
                setPageVisible(false);
                setTimeout(() => {
                  navigate(`/coin/address/${symbol}`, {
                    state: { isUser, symbol },
                  });
                }, 200);
              }}
            >
              <CircleDollarSign
                className="h-4 w-4 sm:h-5 sm:w-5"
                stroke={addressStatus === 'ACTIVE' ? 'white' : 'gray'}
              />
              <span className="text-sm sm:text-base, text-white">코인 충전</span>
            </button>
            <button
              className={`flex flex-1 items-center justify-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl py-1.5 sm:py-2 text-base sm:text-lg font-semibold shadow transition ${
                addressStatus === 'ACTIVE'
                  ? 'bg-[#0a2e64] text-white'
                  : 'cursor-not-allowed bg-gray-300 text-gray-400'
              }`}
              disabled={addressStatus !== 'ACTIVE'}
              onClick={() => {
                if (addressStatus === 'ACTIVE') {
                  // Add transition before navigation
                  setPageVisible(false);
                  setTimeout(() => {
                    navigate('/settlement', { state: { isUser, symbol } });
                  }, 200);
                }
              }}
            >
              <CircleDollarSign
                className="h-4 w-4 sm:h-5 sm:w-5"
                stroke={addressStatus === 'ACTIVE' ? 'white' : 'gray'}
              />
              <span className="text-sm sm:text-base text-white">코인 출금</span>
            </button>
          </div>

          <div
            className={`mt-2 sm:mt-3 w-full rounded-lg sm:rounded-xl py-2 sm:py-3 text-center text-sm sm:text-base font-medium transition ${
              addressStatus === 'REGISTERING'
                ? 'cursor-not-allowed bg-gray-300 text-gray-400'
                : 'cursor-pointer bg-[#0a2e64] text-white'
            }`}
            style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }}
            onClick={() => {
              if (addressStatus === 'REGISTERING') {
                setShowModal(true);
              } else if (addressStatus === 'NOT_REGISTERED' || (addressStatus === 'ACTIVE' && addressInfo)) {
                // Add transition before navigation
                setPageVisible(false);
                setTimeout(() => {
                  if (addressStatus === 'NOT_REGISTERED') {
                    navigate('/coin/address/add', { state: { isUser, symbol } });
                  } else if (addressStatus === 'ACTIVE' && addressInfo) {
                    navigate('/coin/address/add', {
                      state: {
                        symbol,
                        isUser: false,
                        useExistingAddress: true,
                        address: addressInfo.address,
                        tag: addressInfo.tag,
                      },
                    });
                  }
                }, 200);
              }
            }}
          >
            <span
              className={
                addressStatus === 'ACTIVE'
                  ? 'text-white'
                  : addressStatus === 'REGISTERING'
                    ? 'text-red-500'
                    : 'text-white'
              }
            >
              {addressStatus === 'ACTIVE'
                ? '계좌가 등록되어 있습니다. 변경하려면 눌러주세요.'
                : addressStatus === 'REGISTERING'
                  ? '계좌가 등록중입니다..'
                  : '출금계좌 등록하기'}
            </span>
          </div>
        </div>

        {/* 기간 선택 탭 */}
        <div
          className="mb-4 sm:mb-5 md:mb-6"
          style={{
            animationName: 'slideIn',
            animationDuration: '0.6s',
            animationFillMode: 'both',
            animationDelay: '0.7s'
          }}>
          <div className="flex rounded-lg sm:rounded-xl bg-white p-1 shadow-sm">
            {['day', 'week', 'month', 'year'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 rounded-md sm:rounded-lg py-1.5 sm:py-2 text-center text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-[#0a2e64] text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {period === 'day' && '1일'}
                {period === 'week' && '1주'}
                {period === 'month' && '1개월'}
                {period === 'year' && '1년'}
              </button>
            ))}
          </div>
        </div>

        {showModal && addressInfo && (
          <CoinAddressModal
            symbol={symbol!}
            coinName={coin.name}
            address={addressInfo.address}
            tag={addressInfo.tag}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* 거래 내역 섹션 */}
        <div
          className="mb-3 sm:mb-4 flex items-center justify-between"
          style={{
            animationName: 'slideIn',
            animationDuration: '0.6s',
            animationFillMode: 'both',
            animationDelay: '0.9s'
          }}>
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

        {/* 거래 내역 */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 pb-16 sm:pb-10 text-sm sm:text-base md:text-lg lg:text-xl">
          {/* Fade-in animation for each transaction item */}
          {data?.pages.map((page, pageIndex) =>
            page.content.map((item: PaymentHistory, idx: number) => {
              const rate = prices[`KRW-${symbol}`] ?? 0;
              const krw = Math.floor(item.amount * rate).toLocaleString();
              const showAfterBalance = item.status === 'ACCEPTED';

              return (
                <div
                  key={`${pageIndex}-${idx}`}
                  className="transition-all duration-300 ease-in-out"
                  style={{
                    animationName: 'fadeInUp',
                    animationDuration: '0.5s',
                    animationDelay: `${idx * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <TransactionItem
                    date={new Date(item.transferredAt).toLocaleString()}
                    type={
                      item.type === 'DEPOSIT'
                        ? item.status === 'ACCEPTED'
                          ? '입금 완료'
                          : '입금 대기중'
                        : item.type === 'WITHDRAW'
                          ? item.status === 'ACCEPTED'
                            ? '출금 완료'
                            : '출금 대기중'
                          : item.type === 'PAY'
                            ? item.status === 'ACCEPTED'
                              ? '결제 완료'
                              : item.status === 'PENDING'
                                ? '정산 대기중'
                                : item.status === 'FAILED'
                                  ? '결제 취소'
                                  : '환불 완료'
                            : item.type === 'REFUND'
                              ? '환불 완료'
                              : '알 수 없음'
                    }
                    balance={`${item.afterBalance ?? '-'} ${symbol}`}
                    amount={item.amount.toFixed(8)
                      + ' ' + symbol}
                    krw={`${krw} KRW`}
                    isDeposit={item.type === 'DEPOSIT'}
                    showAfterBalance={showAfterBalance}
                  />
                </div>
              );
            })
          )}
          <div
            ref={observerElemRef}
            className="h-10 flex items-center justify-center mt-4"
          >
            {isFetchingNextPage && (
              <div className="w-8 h-8 rounded-full border-2 border-t-[#0a2e64] border-gray-200 animate-spin"></div>
            )}
            {!hasNextPage && data?.pages[0]?.content.length > 0 && (
              <p className="text-gray-500 text-sm">더 이상 거래 내역이 없습니다</p>
            )}
            {data?.pages[0]?.content.length === 0 && (
              <p className="text-gray-500 text-sm">거래 내역이 없습니다</p>
            )}
          </div>
    </div>
</main>

  <BottomNav />
</div>
)
}