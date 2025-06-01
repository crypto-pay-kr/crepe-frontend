import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/common/BottomNavigate";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import PaymentOptionsList from "@/components/order/PaymentOptionList";
import { getCoinBalance} from "@/api/coin";
import { createOrder, getMyVouchers } from '@/api/order'
import { useTickerData } from '@/hooks/useTickerData'
import { OrderRequest } from '@/types/order'

interface SubscribeVoucherDto {
  id: number;                 // 바우처 ID
  productName: string;        // 상품 이름
  balance: number;            // 잔액
  expiredDate: string;        // 만기일
  storeType: string;          // 가게 종류
  bankTokenSymbol: string;
}

export default function SelectPaymentPage() {
    const navigate = useNavigate();
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

    const tickerData = useTickerData();
    const [balances, setBalances] = useState<{ [key: string]: number }>({});
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [vouchers, setVouchers] = useState<SubscribeVoucherDto[]>([]);
    const [paymentOptions, setPaymentOptions] = useState<any[]>([]);

    // 1. 로컬 스토리지에서 총 금액 가져오기
    useEffect(() => {
        const storedTotalPrice = localStorage.getItem("totalPrice");
        if (storedTotalPrice) {
            setTotalPrice(Number(storedTotalPrice));
        }
    }, []);


    // 3. 사용자 잔액 가져오기
    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const data = await getCoinBalance();
                const items=data.balance;
                const balanceMap = items.reduce((acc: any, item: any) => {
                    acc[item.currency] = item.balance;
                    return acc;
                }, {});
                setBalances(balanceMap);
            } catch (err) {
                console.error("Error fetching balances:", err);
            }
        };

        fetchBalances();
    }, []);


    // 내가 가진 바우처 목록 가져오기
    useEffect(() => {
      const loadVouchers = async () => {
        const voucherList = await getMyVouchers();
        console.log("바우처 불러오기 성공:", voucherList);
        setVouchers(voucherList);
      };

      loadVouchers();
    }, []);



    // 4. 결제 옵션 생성
  useEffect(() => {
    const coinOptions = ["XRP", "SOL", "USDT"].map((symbol) => {
      const tradePrice = tickerData[`KRW-${symbol}`]?.trade_price;
      return {
        id: symbol,
        label: symbol,
        amount: tradePrice ? `${(totalPrice / tradePrice).toFixed(2)} ${symbol}` : "Loading...",
        insufficientBalance: !tradePrice || (balances[symbol] ?? 0) < totalPrice / tradePrice,
        type: "COIN",
      };
    });

    const voucherOptions = vouchers.map((v) => ({
      id: `VOUCHER-${v.id}`,
      label: `${v.productName}`,
      amount: `${v.balance.toFixed(2)} ${v.bankTokenSymbol} `,
      insufficientBalance: v.balance < totalPrice,
      type: "VOUCHER",
      voucherId: v.id,
    }));

    setPaymentOptions([...coinOptions, ...voucherOptions]);
  }, [balances, tickerData, totalPrice, vouchers]);




  // 5. 결제 수단 선택 핸들러
    const handlePaymentSelect = (method: string) => {
        setSelectedPayment(method);
    };

    // 6. 주문 생성을 위한 orderRequest 생성 및 결제 요청 핸들러
    const handlePayment = async () => {
        if (!selectedPayment) {
          return;
        }

        const selectedOption = paymentOptions.find(
            (option) => option.id === selectedPayment
        );

        if (selectedOption?.insufficientBalance) {
            alert("잔액이 부족합니다.");
            return;
        }

        // 로컬스토리지에서 cartItems 가져오기 (JSON 문자열 -> 배열)
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
        };
      } else if (selectedOption.type === "VOUCHER" && selectedOption.voucherId != null) {
        orderRequest = {
          ...baseRequest,
          paymentType: "VOUCHER",
          voucherSubscribeId: selectedOption.voucherId,
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
        const orderId = await createOrder(orderRequest);
        navigate("/mall/store/order-pending", { state: { orderId } });
      } catch (error: any) {
        console.error("Order creation failed:", error);
        alert("주문 생성에 실패했습니다.");
      }
    };


    return (
        <div className="flex flex-col min-h-screen">
            <Header title="결제수단 선택" isStore={false} />

            <div className="flex-grow page-container bg-white pb-0 pt-5">
                <div className="p-4 min-h-[70vh]">
                    <PaymentOptionsList
                        options={paymentOptions}
                        selectedPaymentId={selectedPayment}
                        onSelectPayment={handlePaymentSelect}
                    />
                </div>

                <div className="flex justify-center mt-auto px-4 pb-4">
                    <Button
                        text="주문하기"
                        onClick={handlePayment}
                        color="primary"
                        disabled={
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