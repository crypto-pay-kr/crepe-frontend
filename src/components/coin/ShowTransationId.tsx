"use client"

import { Home, ShoppingBag, User} from "lucide-react"
import Header from '@/components/common/Header'
import Button from '@/components/common/Button'
import { useParams, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/common/BottomNavigate'

export default function ShowTransationId() {
  const navigate = useNavigate();
  const { symbol } = useParams();

  const isSeller = location.pathname.includes('/store');

  const navItems = [
    {
      icon: <Home className="w-6 h-6" color="white" />,
      label: "홈",
      isActive: false,
      onClick: () => navigate("/home")
    },
    {
      icon: <ShoppingBag className="w-6 h-6" color="white" />,
      label: "쇼핑몰",
      isActive: false,
      onClick: () => navigate("/shop")
    },
    {
      icon: <User className="w-6 h-6" color="white" />,
      label: "마이페이지",
      isActive: true,
      onClick: () => navigate(isSeller ? "/store/my" : "/home/my")
    }
  ];

  const isButtonDisabled = false

  const onNext = () => {
    if (!symbol) {
      alert("코인 심볼이 없습니다.");
      return;
    }
    navigate(`/coin-detail/${symbol}`, {
      state: { isUser: true, symbol:symbol } // 필요 시 isUser 등도 같이 전달
    });
  }


  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="코인 입금" />

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-10">거래 ID 입력</h2>

          <div className="mb-8">
            <p className="text-lg font-semibold mb-3">거래 ID</p>
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <span className="text-red-500 text-base font-medium">TNgzwecDR23DDKFodjkfn20d</span>
            </div>
          </div>

          <ol className="list-decimal pl-5 text-base space-y-2 mb-8">
            <li>Upbit 내 출금 완료 후 해당 코인 내역에 접속 후 거래 내역 클릭</li>
            <li className="text-red-500 font-bold">출금 완료되지 않 확인 후 클릭</li>
          </ol>


          <div className="mb-10">
            <img
              src="/transaction1.svg"
              alt="출금 완료 확인 이미지"
              className="w-full rounded border border-gray-300"
            />
          </div>

          <p className="text-base mb-6">2. 거래 ID 복사하여 Crepe에 입력하여 거래 확인</p>

          <div className="mb-6">
            <img
              src="/transaction2.svg"
              alt="거래 ID 복사 이미지"
              className="w-full rounded border border-gray-300"
            />
          </div>
        </div>
      </div>


      {/* Bottom Button */}
      <div className="p-5">
        <Button text="확인" onClick={onNext} color={isButtonDisabled ? "gray" : "blue"} />
      </div>


      {/* Bottom Navigation */}
      <BottomNav navItems={navItems} />
    </div>
  )
}