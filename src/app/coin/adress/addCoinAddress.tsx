import React, { useState } from "react"
import Button from '@/components/common/Button'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import BottomNav from '@/components/common/BottomNavigate'
import AddressInput from "@/components/coin/AddressInput"
import AddressInstructions from "@/components/coin/AddressInstructions"

interface LocationState {
  symbol?: string;
  isUser?: boolean;
}

export default function AddCoinAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const { symbol } = location.state as LocationState || {};
  const isSeller = location.pathname.includes("/store");

  const [useExistingAddress, setUseExistingAddress] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [tagAddress, setTagAddress] = useState<string>("");

  // 주소 입력 핸들러
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  // XRP 태그 주소 입력 핸들러
  const handleTagAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagAddress(e.target.value);
  };

  // 다음 단계로 이동하는 함수
  const handleNext = () => {
    if (!symbol) {
      alert("코인 심볼이 없습니다.");
      return;
    }

    navigate(`/coin-detail/${symbol}`, {
      state: { isUser: false }
    });
  };

  const isButtonDisabled = !address && !useExistingAddress;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="코인 입금" />
      <div className="flex-1 px-6 py-6 overflow-auto">
        <div className="mb-8">
          <div className="bg-gray-50 rounded-lg p-4 mb-8 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">네트워크: 솔라나</h2>
                <p className="text-sm text-gray-600">SOL 토큰을 지원하는 블록체인 네트워크</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-8 border border-gray-100 shadow-sm">
            <AddressInput
              label="고객님의 SOL 주소"
              value={address}
              onChange={handleAddressChange}
              placeholder="고객님의 SOL 주소를 입력해주세요."
            />

            {symbol === "XRP" && (
              <AddressInput
                label="고객님의 XRP Tag 주소"
                value={tagAddress}
                onChange={handleTagAddressChange}
                placeholder="고객님의 XRP 주소를 입력해주세요."
                className="mt-6"
              />
            )}
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <h3 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              안내사항
            </h3>
            <AddressInstructions />
          </div>
        </div>
      </div>

      <div className="p-5 bg-white">
        <Button
          text="계좌 등록 요청"
          onClick={handleNext}
          disabled={isButtonDisabled}
          color={isButtonDisabled ? "gray" : "blue"}
          className="rounded-lg shadow-md w-full py-3 text-lg font-medium"
        />
      </div>

      <BottomNav />
    </div>
  );
}