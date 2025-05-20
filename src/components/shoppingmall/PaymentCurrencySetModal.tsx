import React, { useState } from "react";
import { CoinList } from "@/types/store";
import { patchStoreCoin } from "@/api/store";

interface PaymentCurrencySetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  coins?: CoinList[]; // 예: [{ name: "XRP" }, { name: "USDT" }, { name: "SOL" }]
}

export default function PaymentCurrencySetModal({
                                                  isOpen,
                                                  onClose,
                                                  title,
                                                  coins = [],
                                                }: PaymentCurrencySetModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  // CryptocurrencyTags에서 사용한 색상 매핑
  const cryptoColors: Record<string, string> = {
    XRP: "bg-yellow-100 text-yellow-800 border-yellow-100",
    USDT: "bg-green-100 text-green-800 border-green-100",
    SOL: "bg-purple-100 text-purple-800 border-purple-100",
    default: "bg-gray-500 text-gray-800 border-gray-100",
  };

  // 선택한 코인들을 상태로 관리
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);

  const toggleCoin = (coinName: string) => {
    setSelectedCoins((prev) =>
      prev.includes(coinName)
        ? prev.filter((c) => c !== coinName)
        : [...prev, coinName]
    );
  };

  // "변경하기" 버튼 클릭 시 API 호출
  const handleUpdate = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      await patchStoreCoin(selectedCoins);
      alert("결제 수단 지원 설정이 업데이트되었습니다.");
      onClose();
    } catch (err) {
      console.error("코인 업데이트 실패:", err);
      alert("코인 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h3 className="text-center text-lg font-medium mb-6">{title}</h3>

        <div className="flex justify-around">
          {coins.map((coin, index) => {
            const coinName = typeof coin === "string" ? coin : coin.name || "";
            const isSelected = selectedCoins.includes(coinName);

            return (
              <button
                key={index}
                onClick={() => coinName && toggleCoin(coinName)}
                className={`px-4 py-2 rounded-full text-sm transition-colors border 
                   ${cryptoColors[coinName] || cryptoColors.default}
                   ${isSelected ? "font-semibold" : ""}
                  `}
              >
                {coinName}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-6 space-x-3">
          <button
            onClick={handleUpdate}
            className="bg-[#0a2e65] text-white px-8 py-2 rounded w-full"
          >
            변경하기
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-8 py-2 rounded w-full"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
