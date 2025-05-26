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
import { ProductTag } from '@/components/token/onsale-product/ProductTag'

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


  const tagColors = ["gray", "purple", "green"] as const;
  type TagColor = typeof tagColors[number];

  function getColorForTag(tag: string): TagColor {
    // 간단한 해시로 index 추출
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % tagColors.length;
    return tagColors[index];
  }

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
              tags: p.tags ?? [],
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
