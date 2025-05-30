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

  // 선택되지 않은 상태와 선택된 상태의 색상 매핑
  const cryptoColors: Record<string, { selected: string; unselected: string }> = {
    XRP: {
      selected: "bg-yellow-500 text-white border-yellow-500 shadow-lg",
      unselected: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
    },
    USDT: {
      selected: "bg-green-500 text-white border-green-500 shadow-lg",
      unselected: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
    },
    SOL: {
      selected: "bg-purple-500 text-white border-purple-500 shadow-lg",
      unselected: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
    },
    default: {
      selected: "bg-blue-500 text-white border-blue-500 shadow-lg",
      unselected: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
    },
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

        <div className="flex justify-around gap-2">
          {coins.map((coin, index) => {
            const coinName = typeof coin === "string" ? coin : coin.name || "";
            const isSelected = selectedCoins.includes(coinName);
            const colorConfig = cryptoColors[coinName] || cryptoColors.default;

            return (
              <button
                key={index}
                onClick={() => coinName && toggleCoin(coinName)}
                className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 border-2 transform active:scale-95
                  ${isSelected 
                    ? colorConfig.selected 
                    : colorConfig.unselected
                  }
                `}
              >
                {coinName}
                {isSelected && (
                  <span className="ml-1">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 선택된 코인 개수 표시 */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {selectedCoins.length > 0 
            ? `${selectedCoins.length}개의 코인이 선택되었습니다.`
            : "결제 수단으로 지원할 코인을 선택해주세요."
          }
        </div>

        <div className="flex justify-center mt-6 space-x-3">
          <button
            onClick={handleUpdate}
            className="bg-[#0a2e65] text-white px-8 py-2 rounded w-full hover:bg-[#0a2158] transition-colors"
          >
            변경하기
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-8 py-2 rounded w-full hover:bg-gray-400 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}