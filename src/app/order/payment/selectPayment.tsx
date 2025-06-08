import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/common/BottomNavigate";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import PaymentOptionsList from "@/components/order/PaymentOptionList";
import { getCoinBalance } from "@/api/coin";
import { createOrder, getMyVouchers, getAvailableCurrency } from "@/api/order";
import { getTokenInfo } from "@/api/token";
import { useTickerData } from "@/hooks/useTickerData";
import { OrderRequest } from "@/types/order";
import { toast } from "react-toastify";
import { ApiError } from "@/error/ApiError";
import { v4 as uuidv4 } from "uuid";
interface SubscribeVoucherDto {
  id: number;
  productName: string;
  balance: number;
  expiredDate: string;
  storeType: string;
  bankTokenSymbol: string;
  tokenBalance?: number;
}
interface PortfolioData {
  currency: string;
  amount: number;
}

export default function SelectPaymentPage() {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const tickerData = useTickerData();
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [vouchers, setVouchers] = useState<SubscribeVoucherDto[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<any[]>([]);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [totalTokenValue, setTotalTokenValue] = useState<number>(0);
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 로컬 스토리지에서 총 금액 가져오기
  useEffect(() => {
    const storedTotalPrice = localStorage.getItem("totalPrice");
    if (storedTotalPrice) {
      setTotalPrice(Number(storedTotalPrice));
    }
  }, []);

  // 사용 가능한 currency 조회
  useEffect(() => {
    const fetchAvailableCurrencies = async () => {
      try {
        const cartItemsStr = localStorage.getItem("cartItems");
        if (!cartItemsStr) {
          throw new Error("장바구니가 비어있습니다.");
        }

        const cartItems = JSON.parse(cartItemsStr);
        if (!cartItems.length) {
          throw new Error("장바구니에 상품이 없습니다.");
        }

        const storeId = cartItems[0]?.storeId;
        if (!storeId) {
          throw new Error("가게 정보가 없습니다.");
        }

        const currencies = await getAvailableCurrency(storeId);
        setAvailableCurrencies(currencies);
      } catch (err) {
        console.error("사용 가능한 currency 조회 실패:", err);
        toast.error("결제 가능한 수단을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchAvailableCurrencies();
  }, []);

  // 2. 페이지 진입 시 getTokenInfo 호출
  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const voucherList = await getMyVouchers();
        const updatedVouchers: SubscribeVoucherDto[] = [];
        const portfolioList: PortfolioData[] = [];

        for (const voucher of voucherList) {
          if (voucher.bankTokenSymbol) {
            try {
              const tokenInfo = await getTokenInfo(voucher.bankTokenSymbol);
              // Portfolio 정보 가져오기
              if (tokenInfo?.portfolios) {
                tokenInfo.portfolios.forEach((portfolio: any) => {
                  if (
                    portfolio.currency &&
                    portfolio.amount &&
                    !portfolioList.some((p) => p.currency === portfolio.currency)
                  ) {
                    portfolioList.push({
                      currency: portfolio.currency,
                      amount: portfolio.amount,
                    });
                  }
                });
              }
              // tokenBalance 값 추가
              updatedVouchers.push({
                ...voucher,
                tokenBalance: tokenInfo.tokenBalance,
              });
            } catch (err) {
              console.error(`토큰 정보 조회 실패 (${voucher.bankTokenSymbol}):`, err);
              if (err instanceof ApiError) {
                toast.error(`${err.message}`);
              } else {
                toast.error("토큰 정보를 불러오는 중 오류가 발생했습니다.");
              }
            }
          }
        }

        setVouchers(updatedVouchers);
        setPortfolioData(portfolioList);
      } catch (err) {
        console.error("바우처 불러오기 실패:", err);
        toast.error("바우처를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchTokenInfo();
  }, []);

  // 3. 사용자 잔액 가져오기
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const data = await getCoinBalance();
        const items = data.balance;
        const balanceMap = items.reduce((acc: any, item: any) => {
          acc[item.currency] = item.balance;
          return acc;
        }, {});
        setBalances(balanceMap);
      } catch (err) {
        console.error("잔액 불러오기 실패:", err);
      }
    };
    fetchBalances();
  }, []);

  // 4. 현재 토큰 총 시세 계산
  useEffect(() => {
    if (portfolioData.length > 0) {
      let sum = 0;
      portfolioData.forEach((portfolio) => {
        const tradePrice = tickerData[`KRW-${portfolio.currency}`]?.trade_price;
        if (tradePrice) {
          sum += tradePrice * portfolio.amount;
        }
      });
      setTotalTokenValue(sum); // 시세 저장
    }
  }, [portfolioData, tickerData]);

  // 코인 결제 옵션 생성
  useEffect(() => {
  const coinOptions = ["XRP", "SOL", "USDT"]
  .filter((symbol) => availableCurrencies.includes(symbol))
  .map((symbol) => {
    const tradePrice = tickerData[`KRW-${symbol}`]?.trade_price;
    const balance = balances[symbol] ?? 0;
    return {
      id: symbol,
      label: symbol,
      amount: tradePrice
        ? `${(totalPrice / tradePrice).toFixed(2)} ${symbol}`
        : "Loading...",
      balance: `${balance.toFixed(2)} ${symbol}`,
      insufficientBalance: !tradePrice || balance < totalPrice / tradePrice,
      type: "COIN",
    };
  });

setPaymentOptions((prevOptions) => {
  const allOptions = [
    ...prevOptions.filter((opt) => opt.type === "VOUCHER"),
    ...coinOptions,
  ];
  return allOptions.sort((a, b) => {
    if (a.type === b.type) {
      return a.id.localeCompare(b.id); // 같은 타입일 경우 id로 정렬
    }
    return a.type === "VOUCHER" ? -1 : 1; // VOUCHER가 COIN보다 먼저 오도록 정렬
  });
});
}, [balances, tickerData, totalPrice, availableCurrencies]);

useEffect(() => {
const voucherOptions = vouchers
  .filter((v) => availableCurrencies.includes(v.bankTokenSymbol))
  .map((v) => {
    let convertedTokenValue = "Loading...";
    let exchangeRate = 0;

    if (totalTokenValue > 0 && v.tokenBalance) {
      exchangeRate = v.tokenBalance / totalTokenValue;
      const adjustedValue = totalPrice * exchangeRate;
      convertedTokenValue = `${adjustedValue.toFixed(2)} ${v.bankTokenSymbol}`;
    }

    return {
      id: `VOUCHER-${v.id}`,
      label: `${v.productName}`,
      bankTokenSymbol: v.bankTokenSymbol,
      amount: convertedTokenValue,
      balance: `${v.balance.toFixed(2)} ${v.bankTokenSymbol}`,
      insufficientBalance: v.balance < totalPrice,
      type: "VOUCHER",
      voucherId: v.id,
      exchangeRate,
    };
  });

setPaymentOptions((prevOptions) => {
  const allOptions = [
    ...prevOptions.filter((opt) => opt.type === "COIN"),
    ...voucherOptions,
  ];
  return allOptions.sort((a, b) => {
    if (a.type === b.type) {
      return a.id.localeCompare(b.id); // 같은 타입일 경우 id로 정렬
    }
    return a.type === "VOUCHER" ? -1 : 1; // VOUCHER가 COIN보다 먼저 오도록 정렬
  });
});
}, [vouchers, totalTokenValue, totalPrice, availableCurrencies]);

  // 결제 수단 선택 핸들러
  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
  };

  // 주문 생성 핸들러
  const handlePayment = async () => {
    if (!selectedPayment || isLoading) return;

    const selectedOption = paymentOptions.find(
      (option) => option.id === selectedPayment
    );

    if (selectedOption?.insufficientBalance) {
      alert("잔액이 부족합니다.");
      return;
    }

    const cartItemsStr = localStorage.getItem("cartItems");
    if (!cartItemsStr) {
      alert("장바구니에 담긴 상품이 없습니다.");
      return;
    }

    const cartItems = JSON.parse(cartItemsStr);
    if (!cartItems.length) {
      alert("장바구니가 비어있습니다.");
      return;
    }

    const storeId = cartItems[0]?.storeId;
    if (storeId == null) {
      alert("유효한 가게 정보가 없습니다. (storeId is null)");
      return;
    }
    const traceId = uuidv4();

    const orderDetails = cartItems.map((item: any) => ({
      menuId: item.id,
      menuCount: item.quantity,
    }));
    const baseRequest = { storeId, orderDetails };

    let orderRequest: OrderRequest;

    if (selectedOption.type === "COIN") {
      const selectedPrice = tickerData[`KRW-${selectedOption.id}`]?.trade_price;
      if (!selectedPrice) {
        alert("시세 정보를 불러오지 못했습니다.");
        return;
      }
      orderRequest = {
        ...baseRequest,
        paymentType: "COIN",
        currency: selectedOption.id,
        exchangeRate: selectedPrice,
        traceId
      };
    } else if (
      selectedOption.type === "VOUCHER" &&
      selectedOption.voucherId != null
    ) {
      orderRequest = {
        ...baseRequest,
        paymentType: "VOUCHER",
        currency: selectedOption.bankTokenSymbol,
        voucherSubscribeId: selectedOption.voucherId,
        exchangeRate: selectedOption.exchangeRate,
        traceId
      };
    } else {
      alert("유효한 결제 방식이 아닙니다.");
      return;
    }

    try {
      if (!orderRequest) {
        alert("유효한 결제 요청이 생성되지 않았습니다.");
        return;
      }
      setIsLoading(true);
      const orderId = await createOrder(orderRequest);
      navigate("/mall/store/order-pending", { state: { orderId } });
    } catch (e: any) {
      console.error("Order creation failed:", e);
      if (e instanceof ApiError) {
        toast.error(`${e.message}`);
      } else {
        toast.error("예기치 못한 오류가 발생했습니다.");
      }
    }finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="결제수단 선택" isStore={false} />

      <div className="flex-grow page-container bg-white pb-0 pt-5">
        <div className="p-4 min-h-[70vh]">
          {/* 결제 가능한 수단이 없을 경우 메시지 표시 */}
          {availableCurrencies.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">결제 가능한 수단이 없습니다.</p>
            </div>
          ) : (
            <PaymentOptionsList
              options={paymentOptions}
              selectedPaymentId={selectedPayment}
              onSelectPayment={handlePaymentSelect}
            />
          )}
        </div>

        <div className="flex justify-center mt-auto px-4 pb-4">
          <Button
            text={isLoading ? "주문 처리 중..." : "주문하기"}
            onClick={handlePayment}
            color="primary"
            disabled={
              isLoading ||
              !selectedPayment ||
              paymentOptions.find((opt) => opt.id === selectedPayment)
                ?.insufficientBalance
            }
            fullWidth={true}
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}