import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/common/BottomNavigate";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import PaymentOptionsList from "@/components/order/PaymentOptionList";
import { getUserBalance, fetchCoinPrices } from "@/api/coin";
import { createOrder } from "@/api/order";


export default function SelectPaymentPage() {
    const navigate = useNavigate();
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
    const [prices, setPrices] = useState<{ [key: string]: number }>({
        "KRW-SOL": 0,
        "KRW-XRP": 0,
        "KRW-USDT": 0,
    });
    const [balances, setBalances] = useState<{ [key: string]: number }>({});
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // 1. 로컬 스토리지에서 총 금액 가져오기
    useEffect(() => {
        const storedTotalPrice = localStorage.getItem("totalPrice");
        if (storedTotalPrice) {
            setTotalPrice(Number(storedTotalPrice));
        }
    }, []);

    // 2. 코인 시세 가져오기
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const updatedPrices = await fetchCoinPrices();
                setPrices(updatedPrices);
            } catch (err) {
                console.error("Error fetching prices:", err);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 3000);
        return () => clearInterval(interval);
    }, []);

    // 3. 사용자 잔액 가져오기
    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const data = await getUserBalance();
                const balanceMap = data.reduce((acc: any, item: any) => {
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

    // 4. 결제 옵션 생성
    const paymentOptions = [
        {
            id: "XRP",
            label: "XRP",
            amount: prices["KRW-XRP"]
                ? `${(totalPrice / prices["KRW-XRP"]).toFixed(2)} XRP`
                : "Loading...",
            insufficientBalance:
                !prices["KRW-XRP"] ||
                (balances["XRP"] === undefined ||
                    balances["XRP"] < totalPrice / prices["KRW-XRP"]),
        },
        {
            id: "SOL",
            label: "SOL",
            amount: prices["KRW-SOL"]
                ? `${(totalPrice / prices["KRW-SOL"]).toFixed(2)} SOL`
                : "Loading...",
            insufficientBalance:
                !prices["KRW-SOL"] ||
                (balances["SOL"] === undefined ||
                    balances["SOL"] < totalPrice / prices["KRW-SOL"]),
        },
        {
            id: "USDT",
            label: "USDT",
            amount: prices["KRW-USDT"]
                ? `${(totalPrice / prices["KRW-USDT"]).toFixed(2)} USDT`
                : "Loading...",
            insufficientBalance:
                !prices["KRW-USDT"] ||
                (balances["USDT"] === undefined ||
                    balances["USDT"] < totalPrice / prices["KRW-USDT"]),
        }
    ];

    // 5. 결제 수단 선택 핸들러
    const handlePaymentSelect = (method: string) => {
        setSelectedPayment(method);
    };

    // 6. 주문 생성을 위한 orderRequest 생성 및 결제 요청 핸들러
    const handlePayment = async () => {
        if (!selectedPayment) return;

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

        // orderRequest 객체 생성
        const orderRequest = {
            storeId,
            orderDetails,
            currency: selectedPayment,
        };

        try {
            const orderId = await createOrder(orderRequest);
            // 주문 생성 후 로딩 페이지로 이동
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