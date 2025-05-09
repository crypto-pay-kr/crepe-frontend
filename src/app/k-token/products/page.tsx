import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/common/Header"
import Button from "@/components/common/Button"

import { Clock, AlertCircle } from "lucide-react"
import { BankProductItemProps } from "@/components/k-token/product/BankProductItem"
import BankProductList from "@/components/k-token/product/BankProductList"
import TokenCategoryTab from "@/components/common/TokenCategoryTab"

export default function KTokenHomePage() {
  const navigate = useNavigate()

  const categories = ["전체", "예금", "적금", "입출금", "상품권"]
  const [selectedCat, setSelectedCat] = useState("전체")

  const items: BankProductItemProps[] = [
    {
      bank: "woori",
      name: "청년도약토큰",
      subtitle: "연 2.6% ~ 연5.0%",
      tags: ["29세이하", "월 최대 50만 토큰", "세제혜택"],
      onClick: () => navigate("/k-token/products/detail", { state: { product: "woori" } }),
    },
    {
      bank: "shinhan",
      name: "서울시동작사랑상품권",
      tags: ["서울 동작구", "월 최대 50만 토큰", "세제혜택"],
      statusText: "마감 임박",
      statusIcon: Clock,
      statusIconColor: "text-red-500",  
    },
    {
      bank: "woori",
      name: "서울시관악사랑상품권",
      tags: ["서울 관악구", "월 최대 50만 토큰", "세제혜택"],
      statusText: "잔여금액 30% 이하 남음",
      statusIcon: AlertCircle,
      statusIconColor: "text-red-500",  
    },
  ]

  // TODO: 카테고리별 필터링 로직 추가
  const filtered = items // 현재는 전체

  return (
    <div className="flex flex-col h-full">
      <Header title="K-계좌" />

      <div className="flex-1 overflow-auto p-4">
        {/* 검색 입력은 그대로 남김 */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="상품 검색어를 입력해 주세요."
            className="w-full py-3 px-4 bg-gray-100 rounded-full"
          />
          {/* ... */}
        </div>

        <TokenCategoryTab
          categories={categories}
          selected={selectedCat}
          onSelect={setSelectedCat}
        />

        <BankProductList items={filtered} />
      </div>

      <div className="p-4">
        <Button text="홈으로 이동" onClick={() => navigate("/user/coin")} fullWidth />
      </div>
    </div>
  )
}