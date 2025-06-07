import { Calendar, CircleDollarSign, X } from 'lucide-react'
import Header from "@/components/common/Header"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import React, { useEffect, useState, useRef } from 'react'
import BottomNav from '@/components/common/BottomNavigate'
import TransactionItem from "@/components/coin/TransactionItem"
import CoinAddressModal from "@/components/coin/CoinAddressModal";
import {
  isAccountAddressRegistered,
  getCoinBalanceByCurrency,
  getCoinHistory,
} from '@/api/coin'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useCoinStore } from '@/constants/useCoin';
import { useTickerData } from '@/hooks/useTickerData'

// 수정된 PaymentHistory 인터페이스 - Backend enum과 일치
export interface PaymentHistory {
  status: 'ACCEPTED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  amount: number;
  transferredAt: string;
  afterBalance: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'INTEREST' | 'SETTLEMENT' | 'REFUND' | 'PAY' | 'CANCEL' | 'TRANSFER' | 'EXCHANGE';
  name?: string; // optional로 변경
}

export default function CoinDetailPage() {
  const styleSheet = document.createElement("style");
  document.head.appendChild(styleSheet);
  const { symbol } = useParams()
  const location = useLocation()
  const tickerData = useTickerData();
  const [addressStatus, setAddressStatus] = useState<'ACTIVE' | 'REGISTERING' | 'NOT_REGISTERED' |'UNREGISTERED'|'UNREGISTERED_AND_REGISTERING'|'REJECTED'| null>(null);
  const [showModal, setShowModal] = useState(false)
  const [addressInfo, setAddressInfo] = useState<{
    address: string;
    tag?: string;
    addressStatus?: string;
  } | null>(null);
  const navigate = useNavigate()
  const [balance, setBalance] = useState<number>(0);
  const coinList = useCoinStore(state => state.coins);
  const coinMeta = coinList.find(c => c.currency === symbol);
  const livePrice = tickerData[`KRW-${symbol}`]?.trade_price ?? 0;

  const isUser = sessionStorage.getItem("userRole") === "USER"
  
  const getTransactionDirection = (item: PaymentHistory, isUser: boolean): 'deposit' | 'withdraw' => {
    
  switch (item.type) {
    case 'DEPOSIT':
      return 'deposit'; // 입금 (양쪽 동일)
      
    case 'WITHDRAW':
      return 'withdraw'; // 출금 (양쪽 동일)
      
    case 'PAY':
      // 결제: 유저는 돈이 나가고, 스토어는 돈이 들어옴
      return isUser ? 'withdraw' : 'deposit';
      
    case 'REFUND':
      return 'deposit'; // 환불 = 입금 (양쪽 동일 - 돈 돌려받음)
      
    case 'CANCEL':
      // 주문 취소: 유저는 돈을 돌려받고, 스토어는 돈이 나감
      return isUser ? 'deposit' : 'withdraw';
      
    case 'INTEREST':
      return 'deposit'; // 이자 = 입금 (양쪽 동일)
      
    case 'EXCHANGE':
      return item.amount > 0 ? 'deposit' : 'withdraw'; // 교환은 금액으로 판별
      
    case 'SETTLEMENT':
      return item.amount > 0 ? 'deposit' : 'withdraw'; // 정산은 금액으로 판별
      
    case 'TRANSFER':
      return item.amount > 0 ? 'deposit' : 'withdraw'; // 송금도 금액으로 판별
      
    default:
      return item.amount > 0 ? 'deposit' : 'withdraw'; // 기본값은 금액으로 판별
  }
};

const getTransactionTypeDisplay = (item: PaymentHistory, isUser: boolean): string => {
  console.log('Processing transaction:', item.type, item.status, item.amount, 'isUser:', isUser);
  
  switch (item.type) {
    case 'DEPOSIT':
      return item.status === 'ACCEPTED' ? '입금 완료' : '입금 대기중';
      
    case 'WITHDRAW':
      return item.status === 'ACCEPTED' ? '출금 완료' : '출금 대기중';
      
    case 'PAY':
      if (isUser) {
        // 유저 관점: 결제
        switch (item.status) {
          case 'ACCEPTED': return '결제 완료';
          case 'PENDING': return '결제 대기중';
          case 'FAILED': return '결제 실패';
          case 'REFUNDED': return '결제 환불';
          default: return '결제';
        }
      } else {
        // 스토어 관점: 매출
        switch (item.status) {
          case 'ACCEPTED': return '매출 입금';
          case 'PENDING': return '매출 대기중';
          case 'FAILED': return '매출 실패';
          case 'REFUNDED': return '매출 환불';
          default: return '매출';
        }
      }
      
    case 'REFUND':
      return '환불 완료';
      
    case 'SETTLEMENT':
      return item.status === 'ACCEPTED' ? '정산 완료' : '정산 대기중';
      
    case 'INTEREST':
      return '이자 지급';
      
    case 'CANCEL':
      if (isUser) {
        // 유저 관점: 주문 취소 (돈 돌려받음)
        switch (item.status) {
          case 'ACCEPTED': return '주문 취소 완료';
          case 'PENDING': return '주문 취소 대기중';
          case 'FAILED': return '주문 취소 실패';
          default: return '주문 취소';
        }
      } else {
        // 스토어 관점: 주문 취소 (환불 처리)
        switch (item.status) {
          case 'ACCEPTED': return '주문 취소 환불';
          case 'PENDING': return '주문 취소 환불 대기중';
          case 'FAILED': return '주문 취소 환불 실패';
          default: return '주문 취소 환불';
        }
      }
      
    case 'EXCHANGE':
      return item.amount > 0 ? '토큰 매도' : '토큰 매수';
      
    case 'TRANSFER':
      if (item.name) {
        return item.amount > 0 
          ? `${item.name}님에게서 받은 송금`
          : `${item.name}님에게 송금 완료`;
      }
      return item.amount > 0 ? '송금 받음' : '송금 완료';
      
    default:
      console.warn('Unknown transaction type:', item.type);
      return '알 수 없는 거래';
  }
};

// 표시할 금액 계산 (항상 양수로 표시하되, 방향은 별도 처리)
const getDisplayAmount = (item: PaymentHistory): number => {
  return Math.abs(item.amount);
};


  // 입금 주소가 유효한지 확인
  useEffect(() => {
    if (symbol) {
      isAccountAddressRegistered(symbol)
        .then((res) => {
          setAddressStatus(res.addressRegistryStatus);
          setAddressInfo({ address: res.address, tag: res.tag, addressStatus: res.addressRegistryStatus });
        })
        .catch((err) => {
          console.error("등록된 주소없음", err);
          setAddressStatus('NOT_REGISTERED');
          setAddressInfo(null);
        });
    }
  }, [symbol]);

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
    <div className="relative flex h-full flex-col bg-gray-50">
      <Header
        title={`${coinMeta?.coinName ?? symbol} 상세`}
        onBackClick={() => {
          navigate('/my/coin')
        }}
      />

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
          <div className="overflow-hidden rounded-2xl py-10 px-6 bg-white shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={coinMeta?.coinImageUrl}
                  alt={coinMeta?.coinName ?? symbol}
                  className="h-8 w-8 rounded-full mr-2"
                />
                <p className="text-lg font-semibold sm:text-xl md:text-2xl">
                  총 보유
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold sm:text-xl md:text-2xl">
                  {balance.toFixed(2)} {symbol}
                </p>
                <p className="text-sm text-gray-500 sm:text-base">
                  = {(balance * livePrice).toLocaleString()} KRW
                </p>
              </div>
            </div>
          </div>
          
          {/* 버튼 영역 */}
          <div className="mb-4 w-full sm:mb-5 md:mb-6">
            <div className="flex gap-2 sm:gap-3">
              {/* 코인 충전 버튼 */}
              <button
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#4B5EED] py-1.5 font-medium text-base  text-white shadow sm:gap-2 sm:rounded-xl sm:py-2 sm:text-lg"
                onClick={() => {
                  // Add transition before navigation
                  setTimeout(() => {
                    navigate(`/coin/address/${symbol}`, {
                      state: { isUser, symbol },
                    })
                  }, 200)
                }}
              >
                <CircleDollarSign
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  stroke={addressStatus === 'ACTIVE' ? 'white' : 'gray'}
                />
                <span className="sm:text-base, text-sm text-white">
                  코인 충전
                </span>
              </button>
              <button
                className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 font-medium text-base  shadow transition sm:gap-2 sm:rounded-xl sm:py-2 sm:text-lg ${
                  addressStatus === 'ACTIVE'
                    ? 'bg-[#4B5EED] text-white'
                    : 'cursor-not-allowed bg-gray-300 text-gray-400'
                }`}
                disabled={addressStatus !== 'ACTIVE'}
                onClick={() => {
                  if (addressStatus === 'ACTIVE') {
                    // Add transition before navigation
                    setTimeout(() => {
                      navigate('/settlement', { state: { isUser, symbol } })
                    }, 200)
                  }
                }}
              >
                <CircleDollarSign
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  stroke={addressStatus === 'ACTIVE' ? 'white' : 'gray'}
                />
                <span className="text-sm text-white">코인 출금</span>
              </button>
            </div>

            <div
              className={`mt-2 w-full rounded-lg py-2 text-center font-medium text-sm transition sm:mt-3 sm:rounded-xl sm:py-3 sm:text-base ${
                addressStatus === 'REGISTERING' ||
                addressStatus === 'UNREGISTERED_AND_REGISTERING'
                  ? 'cursor-not-allowed bg-gray-300 text-gray-400'
                  : 'cursor-pointer bg-[#4B5EED] text-white'
              }`}
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }}
              onClick={() => {
                if (
                  addressStatus === 'REGISTERING' ||
                  addressStatus === 'UNREGISTERED_AND_REGISTERING'
                ) {
                  setShowModal(true)
                } else {
                  navigate('/coin/address/add', { state: { symbol } })
                }
              }}
            >
              <span className="text-white font-medium text-base ">
                {addressStatus === 'ACTIVE' && '계좌 변경'}
                {addressStatus === 'REGISTERING' && '계좌가 등록중입니다.'}
                {addressStatus === 'UNREGISTERED' && '계좌가 등록 해제 중입니다...'}
                {addressStatus === 'UNREGISTERED_AND_REGISTERING' && '계좌 등록 해제 후 변경 중입니다...'}
                {addressStatus === 'NOT_REGISTERED' && '출금계좌 등록하기'}
                {addressStatus === 'REJECTED' && '거절 되었습니다 다시 등록하기'}
              </span>
            </div>
          </div>

          {showModal && addressInfo && (
            <CoinAddressModal
              symbol={symbol!}
              coinName={coinMeta?.coinName || symbol || ''}
              address={addressInfo.address}
              tag={addressInfo.tag}
              onClose={() => setShowModal(false)}
            />
          )}

          {/* 거래 내역 섹션 */}
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h3 className="text-base font-bold text-gray-800 sm:text-lg">
              거래 내역
            </h3>
          </div>

          {/* 거래 내역 - +/- 표시가 제대로 되도록 수정 */}
          <div className="mb-0 space-y-4 pb-16 text-sm sm:space-y-5 sm:pb-10 sm:text-base md:space-y-6 md:text-lg lg:text-xl">
            {data?.pages.map((page, pageIndex) =>
              page.content.map((item: PaymentHistory, idx: number) => {
                console.log('거래내역 item:', item);
                
                const rate = tickerData[`KRW-${symbol}`]?.trade_price ?? 0;
                const displayAmount = getDisplayAmount(item);
                const krw = Math.floor(displayAmount * rate).toLocaleString();
                const showAfterBalance = item.status === 'ACCEPTED';
                const isDeposit = getTransactionDirection(item, isUser) === 'deposit';

                return (
                  <div
                    key={`${pageIndex}-${idx}`}
                    className="transition-all duration-300 ease-in-out"
                  >
                    <TransactionItem
                      date={new Date(item.transferredAt).toLocaleString()}
                      type={getTransactionTypeDisplay(item, isUser)}
                      balance={`${item.afterBalance ?? '-'} ${symbol}`}
                      amount={`${displayAmount.toFixed(2)} ${symbol}`}
                      krw={`${krw} KRW`}
                      isDeposit={isDeposit}
                      showAfterBalance={showAfterBalance}
                      originalAmount={item.amount}
                      transactionType={item.type} 
                  />
                </div>
              );
            })
          )}
            <div
              ref={observerElemRef}
              className="mt-4 flex h-10 items-center justify-center"
            >
              {isFetchingNextPage && (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0a2e64]"></div>
              )}
              {!hasNextPage && data?.pages[0]?.content.length > 0 && (
                <p className="text-sm text-gray-500">
                  더 이상 거래 내역이 없습니다
                </p>
              )}
              {data?.pages[0]?.content.length === 0 && (
                <p className="text-sm text-gray-500">거래 내역이 없습니다</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}