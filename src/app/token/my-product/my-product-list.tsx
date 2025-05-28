import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Button from '@/components/common/Button'
import { GetMySubscribeTransactionList, GetMyTokenList } from '@/api/token'
import { SubscribeTransaction } from '@/types/BankTokenAccount';
import SubscribeTransactionList from '@/components/token/transaction/SubscribeTransactionList'
import { useBankStore } from '@/stores/BankStore'

export default function TokenProductListPage() {
  const { subscribeId } = useParams<{ subscribeId: string }>();
  const { bankTokens, fetchBankTokens } = useBankStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<SubscribeTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const location = useLocation();

  const [hasNext, setHasNext] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] =  useState(false);
  const [productState, setProductState] = useState<any>(null);
  const [tokenInfoState, setTokenInfoState] = useState<any>(null);
  const { products, } = (location.state as any) || {};

  const handleCancelClick = () => {
    navigate(`/token/product/cancel/${subscribeId}`, {
      state: {
        productState,
        tokenInfoState
      },
    });
  };
  const handleExchangeClick = () => {
    navigate(`/token/product/deposit/${subscribeId}`, {
      state: {
        products,
        productState,
        tokenInfoState
      },
    });
  };


  // 가입 상품 거래내역 불러오기 (무한 스크롤 적용)
  const fetchTransactions = useCallback(async () => {
    if (!subscribeId || !hasNext || loading) return;
    setLoading(true);
    try {
      const data = await GetMySubscribeTransactionList(Number(subscribeId), page, 3);

      const mapped: SubscribeTransaction[] = (data.content || []).map((transaction: any) => ({
        eventType: transaction.eventType,
        amount: transaction.amount,
        afterBalance: transaction.afterBalance,
        date: transaction.date,
      }));

      setTransactions((prev) => [...prev, ...mapped]);
      setHasNext(!data.last);
      setPage((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [subscribeId, page, hasNext, loading]);

  // 상태 초기화
  useEffect(() => {
    if (!location.state) return;

    setTransactions([]);
    setPage(0);
    setHasNext(true);

    fetchBankTokens().then(() => {
      // 최신 bankTokens에서 현재 subscribeId에 해당하는 product를 다시 찾아서 상태 업데이트
      const latest = useBankStore.getState().bankTokens?.flatMap(token => {
        return token.products.map(product => ({
          product,
          tokenInfo: {
            currency: token.currency,
            totalBalance: token.totalBalance,
            bankTokenName: token.bankTokenName,
          }
        }))
      }).find(item => Number(subscribeId) === item.product.subscribeId);


      if (latest) {
        console.log(latest.product)
        setProductState(latest.product);
        setTokenInfoState(latest.tokenInfo);
      }
      setIsInitialized(true);

    });
  }, [location.state, subscribeId]);

  useEffect(() => {
    if (isInitialized && !hasFetchedOnce) {
      fetchTransactions();
      setHasFetchedOnce(true);
    }
  }, [isInitialized, hasFetchedOnce, fetchTransactions]);


  useEffect(() => {
    if (loading) return;

    const currentRef = loaderRef.current;
    if (!currentRef) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNext) {
        fetchTransactions();
      }
    });

    observer.current.observe(currentRef);
    console.log("fetch called with page:", page);


    return () => observer.current?.disconnect();
  }, [fetchTransactions,page, hasNext, loading]);

  if (!isInitialized) {
    return <div className="p-4">로딩 중입니다...</div>;
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header
        title={`${productState.name} 상세`}
        onBackClick={() => navigate(-1)}
      />

        <main className="flex-1 overflow-auto p-5">
          {/* 보유 자산 카드 */}
          <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  {products.imageUrl ? (
                    <img src={products.imageUrl} alt={products.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    <span className="whitespace-pre text-xs font-medium">?</span>
                  )}
                </div>
                <p className="text-2xl font-semibold">총 보유</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {productState.amount} {tokenInfoState.currency}
                </p>
                <p className="text-lg mt-1 font-semibold text-indigo-800">연 <span className="text-lg font-semibold text-indigo-800">{productState.rate}</span></p>
              </div>
            </div>
          </div>
          <div className="-mt-2 mb-4 w-full">
            <button className="w-full bg-[#0a2e64] text-white py-3 rounded-lg font-semibold text-base shadow-sm"
            onClick={handleExchangeClick}>
              토큰 예치
            </button>
          </div>


        {/* 거래 내역 헤더 */}
        <div className="mb-7 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">거래 내역</h3>
        </div>
          {/* 거래 내역 세부 */}
          <SubscribeTransactionList
            transactions={transactions}
            loaderRef={loaderRef}
            loading={loading}
            hasNext={hasNext}
            currency={tokenInfoState.currency}
            afterBalance={tokenInfoState.afterBalance}
            totalBalance={tokenInfoState.totalBalance}
          />
        </main>

      <div className="p-5 bg-gray-50 shadow-lg border-t border-gray-50">
        <Button
          text="해지하기"
          onClick={handleCancelClick}
          className="w-full rounded-lg py-3 font-semibold text-base shadow-md"
        />
      </div>
      <BottomNav />
    </div>
  );
}
