import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from "@/components/common/Header"
import { Clock, AlertCircle } from "lucide-react"
import { BankProductItemProps } from "@/components/token/onsale-product/TokenProductItem"
import BankProductList from "@/components/token/onsale-product/TokenProductList"
import TokenCategoryTab from "@/components/common/TokenCategoryTab"
import BottomNav from "@/components/common/BottomNavigate"
import { GetOnsaleProductListResponse } from '@/types/product'
import { fetchOnSaleTokenProducts, fetchProductDetail } from '@/api/product'
import { bankMeta } from '@/utils/bankMeta'

export default function OnSaleTokenProductListPage() {
  const navigate = useNavigate()

  const categories = ["전체", "예금", "적금", "입출금", "상품권"]
  const [selectedCat, setSelectedCat] = useState("전체")
  const { productId } = useParams()
  const [products, setProducts] = useState<GetOnsaleProductListResponse[]>([]);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOnSaleTokenProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);


  /*useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token || !productId) {
      setError("인증 오류 또는 잘못된 접근입니다.")
      return
    }

    fetchProductDetail(Number(productId), token)
      .then(setProduct)
      .catch(() => setError("상품 정보를 불러오는 데 실패했습니다."))
  }, [productId])*/

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

        <BankProductList
          items={products.map((p) => {
            const bankInfo = bankMeta[p.bankName];
            return {
              productId: p.id,
              bank: bankInfo?.code ?? "WTK",
              name: p.productName,
              subtitle: `연 ${p.minInterestRate}% ~ 연 ${p.maxInterestRate}%`,
              tags: [
                `잔여 자본금: ${p.remainingBudget.toLocaleString()}원`,
                `참여자 ${p.currentParticipants}/${p.totalParticipants}`
              ],
              statusText: p.status === "CLOSED" ? "모집 마감" : undefined,
              statusIcon: p.status === "CLOSED" ? Clock : undefined,
              statusIconColor: p.status === "CLOSED" ? "text-red-500" : undefined,
              onClick: () => navigate(`/token/onsale/products/${p.id}`, { state: { product: p } }),
            };
          })}
        />
      </div>
      <BottomNav />
    </div>
  )
}