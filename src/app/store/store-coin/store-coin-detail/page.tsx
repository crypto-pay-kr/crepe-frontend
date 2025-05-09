import { CircleDollarSign, DollarSign, X } from 'lucide-react'
import Header from "@/components/common/Header"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import BottomNav from '@/components/common/BottomNavigate'
import TransactionItem from "@/components/coin/TransactionItem"
import CoinAddressModal from "@/components/coin/CoinAddressModal";
import {
  isAccountAddressRegistered,
  getCoinBalanceByCurrency,
  getCoinHistory,
} from '@/api/coin'

export interface PaymentHistory {
  status: 'ACCEPTED' | 'PENDING' | 'FAILED'; // PaymentStatus enum
  amount: number;
  transferredAt: string; // ISO string
  type: string;
}
const coinMeta = {
  XRP: {
    name: "리플",
    icon: <X className="w-6 h-6" />,
    bg: "bg-gray-200",
    balance: "0.3 XRP",
    krw: "1000 KRW",
  },
  SOL: {
    name: "솔라나",
    icon: (
      <div className="w-5 h-5 flex flex-col justify-between">
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
    icon: <div className="text-white text-sm font-bold">T</div>,
    bg: "bg-[#26A17B]",
    balance: "0.3 USDT",
    krw: "1000 KRW",
  },
}

export default function CoinDetailPage() {
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

  const navigate = useNavigate()
  const isSeller = location.pathname.includes('/store');
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const coin = coinMeta[symbol as keyof typeof coinMeta]
  const [balance, setBalance] = useState<number>(0);
  if (!coin) return <div className="p-4">잘못된 경로입니다.</div>



  //입금 주소가 유효한지 확인
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


//코인 잔액 조회
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


// 코인 거래 내역 조회
  useEffect(() => {
    if (!symbol) return;
    getCoinHistory(symbol)
      .then(setHistory)
      .catch(err => console.error("정산 내역 실패:", err));
  }, [isUser, symbol]);




  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header
        title={`${coin.name} 상세`}
        onBackClick={() => {
          navigate(isUser ? '/user/coin' : '/store/coin')
        }}
      />

      <main className="flex-1 overflow-auto p-5">
        {/* 보유 자산 카드 */}
        <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-12 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`h-10 w-10 ${coin.bg} mr-4 flex items-center justify-center rounded-full`}
              >
                {coin.icon}
              </div>
              <p className="text-2xl font-semibold">총 보유</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {balance} {symbol}
              </p>
              <p className="text-base text-gray-500">
                = {(balance * 1000).toLocaleString()} KRW
              </p>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mb-6 w-full">
          <div className="flex gap-3">
            {/* 코인 충전 버튼 */}
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0a2e64] py-2 text-lg font-semibold text-white shadow"
              onClick={() => {
                navigate(`/coin/address/${symbol}`, {
                  state: { isUser, symbol },
                })
              }}
            >
              <CircleDollarSign
                className="h-5 w-5"
                stroke={addressStatus === 'ACTIVE' ? 'white' : 'gray'}
              />
              코인 충전
            </button>
            <button
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-lg font-semibold shadow transition ${
                addressStatus === 'ACTIVE'
                  ? 'bg-[#0a2e64] text-white'
                  : 'cursor-not-allowed bg-gray-300 text-gray-400'
              }`}
              disabled={addressStatus !== 'ACTIVE'}
              onClick={() => {
                if (addressStatus === 'ACTIVE') {
                  navigate('/settlement', { state: { isUser, symbol } })
                }
              }}
            >
              <CircleDollarSign
                className="h-5 w-5"
                stroke={addressStatus === 'ACTIVE' ? 'white' : 'gray'}
              />
              코인 출금
            </button>
          </div>

          <div
            className={`mt-3 w-full rounded-xl py-3 text-center text-base font-medium transition ${
              addressStatus === 'REGISTERING'
                ? 'cursor-not-allowed bg-gray-300 text-gray-400'
                : 'cursor-pointer bg-[#0a2e64] text-white'
            }`}
            style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }}
            onClick={() => {
              if (addressStatus === 'REGISTERING') {
                setShowModal(true)
              } else if (addressStatus === 'NOT_REGISTERED') {
                navigate('/coin/address/add', { state: { isUser, symbol } })
              } else if (addressStatus === 'ACTIVE' && addressInfo) {
                navigate('/coin/address/add', {
                  state: {
                    symbol,
                    isUser: false,
                    useExistingAddress: true,
                    address: addressInfo.address,
                    tag: addressInfo.tag,
                  },
                })
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

        {/* 기간 선택 탭 - 계좌등록 버튼 아래로 이동 */}
        <div className="mb-6">
          <div className="flex rounded-xl bg-white p-1 shadow-sm">
            {['day', 'week', 'month', 'year'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition ${
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
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">거래 내역</h3>
          <button className="flex items-center text-sm font-medium text-[#0a2e64]">
            전체보기
            <svg
              width="16"
              height="16"
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
        <div className="space-y-6 pb-10 text-[20px]">
          {(history ?? []).map((item, idx) => (
            <TransactionItem
              key={idx}
              date={new Date(item.transferredAt).toLocaleString()}
              type={ item.status === 'ACCEPTED'
                ? item.type === 'DEPOSIT'
                  ? '입금 완료'
                  : '출금 완료'
                : item.type === 'DEPOSIT'
                  ? '입금 대기중'
                  : '출금 대기중'}
              balance={`${balance} ${symbol}`}
              amount={item.amount + ' ' + symbol}
              krw={Math.floor(item.amount * 1000).toLocaleString()}
              isDeposit={item.type === 'DEPOSIT'}
            />
          ))}
          {(history?.length ?? 0) === 0 && (
            <p className="text-sm text-gray-500">거래 내역이 없습니다.</p>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}