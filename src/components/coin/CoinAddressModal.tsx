import React from "react";
import { useNavigate } from "react-router-dom";

interface CoinAddressModalProps {
  symbol: string;
  coinName: string;
  onClose: () => void;
  address: string;
  tag?: string; // XRP 같은 경우에만 필요
}

export default function CoinAddressModal({ symbol, coinName, onClose,address, tag }: CoinAddressModalProps) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl px-6 py-8 text-center w-[320px] shadow-lg">
        <h2 className="text-lg font-bold mb-6">{coinName} 코인 입금 주소 </h2>

        <div className="mb-6">
          <p className="text-sm font-medium mb-1 text-gray-600">내 주소</p>
          <div
            className="w-full border border-gray-200 rounded-xl py-3 px-4 text-blue-900 font-semibold text-sm bg-gray-50">
            {address}
          </div>
        </div>

        {symbol === "XRP" && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-1 text-gray-600">태그 주소</p>
            <div
              className="w-full border border-gray-200 rounded-xl py-3 px-4 text-blue-900 font-semibold text-sm bg-gray-50">
              {tag}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6">
          계좌를 잘못 입력했다면?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() =>
              navigate("/coin/address/add", {
                state: {
                  symbol, isUser: false,
                  useExistingAddress: true,
              address,
              tag, }
              })
            }
          >
    재등록하기
  </span>
        </p>

        <button
          className="bg-[#0a2e64] text-white w-full py-3 rounded-xl text-base font-semibold"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
