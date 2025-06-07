import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNavigate';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { requestTransfer, fetchReceiverName } from '@/api/token';
import { useCoinStore } from '@/constants/useCoin'
import { useTokenStore } from '@/constants/useToken'

export default function TransferPage() {
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { coins, fetchCoins } = useCoinStore();
  const { tokens, fetchTokens } = useTokenStore();
  const [isLoadingRecipient, setIsLoadingRecipient] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const [traceId, setTraceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const coinOptions = [
    ...coins.map((coin) => ({
      type: 'coin',
      value: coin.currency,
      label: `${coin.coinName}`,
      icon: coin.currency,
      balance: coin.balance,
    })),
    ...tokens.map((token) => ({
      type: 'token',
      value: token.currency,
      label: `${token.name} `,
      icon: token.currency,
      balance: token.balance,
    }))
  ];
  const selectedCoinInfo = coinOptions.find((coin) => coin.value === selectedCoin);

  useEffect(() => {
    fetchCoins();
    fetchTokens();
  }, []);

  useEffect(() => {
    if (recipient && selectedCoin) {
      const fetchName = async () => {
        try {
          const name = await fetchReceiverName(recipient, selectedCoin);
          setRecipientName(name);
        } catch (error: any) {
          setRecipientName('다시 입력해주세요');
          toast.error(error.message || '수신자 정보를 찾을 수 없습니다.');
        }
      };
      fetchName();
    }
  }, [selectedCoin]);
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipient(value);
    setIsLoadingRecipient(true);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      if (value && selectedCoin) {
        try {
          const name = await fetchReceiverName(value, selectedCoin);
          setRecipientName(name);
        } catch (error: any) {
          setRecipientName('');
          toast.error(error.message || '수신자 정보를 찾을 수 없습니다.');
        } finally {
          setIsLoadingRecipient(false);
        }
      } else {
        setIsLoadingRecipient(false);
      }
    }, 1000);

    setTypingTimeout(timeout);
  };


  const handleTransfer = () => {
    if (!recipient || !amount || !selectedCoin) {
      toast('모든 필드를 입력하세요.');
      return;
    }
    const newTraceId = uuidv4();   // 새 ID를 변수로 먼저 생성
    setTraceId(newTraceId);
    setShowModal(true);
  };

  const confirmTransfer = async () => {
    if (isLoading) return; // 중복 클릭 방지

    setIsLoading(true);
    try {
      await requestTransfer(recipient, selectedCoin, parseFloat(amount));
      toast.success('송금이 완료되었습니다');
      setRecipient('');
      setAmount('');
      setSelectedCoin('');
      setShowModal(false);
      navigate(`/my/coin`);
    } catch (error: any) {
      toast.error(error.message || '송금 실패');
      setShowModal(false);
    }finally{
      setIsLoadingRecipient(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="자산 송금" />

      <main className="flex-1 p-6 pb-10 flex flex-col justify-between">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <label className="block mb-3 text-sm font-semibold text-gray-800">
              코인/토큰 선택
            </label>
            <div className="relative">
              <select
                className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-[#4B5EED] focus:ring-2 focus:ring-[#4B5EED]/20 focus:outline-none transition-all appearance-none bg-white cursor-pointer"
                value={selectedCoin}
                onChange={(e) => {
                  setSelectedCoin(e.target.value);
                  setRecipient('');
                  setRecipientName('');
                }}
              >
                <option value="">코인을 선택하세요</option>
                {coinOptions.map((coin) => (
                  <option key={coin.value} value={coin.value}>
                    {coin.icon} {coin.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {selectedCoin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mt-6"
            >
              <label className="block mb-3 text-sm font-semibold text-gray-800">
                보낼 이메일 주소
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 p-3 pr-10 text-sm focus:border-[#4B5EED] focus:ring-2 focus:ring-[#4B5EED]/20 focus:outline-none transition-all"
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="이메일 주소를 입력하세요"
              />
              {isLoadingRecipient ? (
                <p className="text-gra text-sm font-mediumy">조회 중입니다...</p>
              ) : (
                recipientName && <p className="text-[#4B5EED] text-sm font-medium"> 받는 사람 : {recipientName}</p>
              )}
            </motion.div>
          )}

          {selectedCoin && recipient && recipientName && selectedCoinInfo &&  (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mt-6"
            >
              <label className="block mb-3 text-sm font-semibold text-gray-800">
                송금 금액
              </label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-200 p-3 pr-16 text-sm focus:border-[#4B5EED] focus:ring-2 focus:ring-[#4B5EED]/20 focus:outline-none transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
                <p className="mt-2 text-sm text-gray-500">
                  보유 잔액: <span className="font-semibold">{selectedCoinInfo.balance}</span> {selectedCoin}
                </p>
            </motion.div>
          )}

        </div>

        <div className="max-w-md mx-auto w-full mt-8">
          <button
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
              recipient && amount && selectedCoin
                ? 'bg-[#4B5EED] hover:bg-[#3D4ED8] active:scale-[0.98] shadow-lg shadow-[#4B5EED]/25'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            onClick={handleTransfer}
            disabled={!recipient || !amount || !selectedCoin}
          >
            {recipient && amount && selectedCoin ? '송금하기' : '정보를 모두 입력하세요'}
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">송금 확인</h3>
                <p className="text-sm text-gray-600">아래 내용을 확인해주세요</p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">받는 사람</div>
                  <div className="text-sm font-medium text-gray-900 break-all">{recipientName ? `${recipientName} (${recipient})` : recipient}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">코인/토큰</div>
                  <div className="text-sm font-medium text-gray-900">
                    {coinOptions.find(coin => coin.value === selectedCoin)?.label}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">송금 금액</div>
                  <div className="text-lg font-bold text-gray-900">{amount} {selectedCoin}</div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={confirmTransfer}
                  className="flex-1 py-3 px-4 bg-[#4B5EED] text-white rounded-lg font-medium hover:bg-[#3D4ED8] transition-colors"
                >
                  송금 확인
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
