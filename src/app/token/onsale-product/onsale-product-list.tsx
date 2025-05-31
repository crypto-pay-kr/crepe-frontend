import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/common/Header";
import { Clock } from "lucide-react";
import TokenProductList from "@/components/token/onsale-product/TokenProductList";
import TokenCategoryTab from "@/components/common/TokenCategoryTab";
import BottomNav from "@/components/common/BottomNavigate";
import { GetOnsaleProductListResponse } from '@/types/product';
import { fetchOnSaleTokenProducts } from '@/api/product';
import { calculateRemainingPercentage } from '@/utils/calculateRemainingPercentage';
import { getTagColor } from "@/utils/tagUtils";
import { mapProductTypeToFrontend } from "@/utils/productTypeUtils";

export default function OnSaleTokenProductListPage() {
  const navigate = useNavigate();

  const categories = ["전체", "예금", "적금", "입출금", "상품권"];
  const [selectedCat, setSelectedCat] = useState("전체");
  const [products, setProducts] = useState<GetOnsaleProductListResponse[]>([]);

  useEffect(() => {
    fetchOnSaleTokenProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  const tokenProductItems = products.map((p) => {
    const remainingPercentage = calculateRemainingPercentage(
      p.totalParticipants,
      p.currentParticipants
    );

    // 이자 범위 문자열 생성
    const frontType = mapProductTypeToFrontend(p.type);
    let interestRange = "";

    if (frontType === "상품권") {
      interestRange = `할인율 ${p.maxInterestRate}%`;
    } else if (p.minInterestRate && p.maxInterestRate && p.minInterestRate !== p.maxInterestRate) {
      interestRange = `연 ${p.minInterestRate}% ~ 연 ${p.maxInterestRate}%`;
    }

    return {
      productId: p.id,
      bankName: p.bankName,
      imageUrl: p.imageUrl,
      name: p.productName,
      productType: p.type,
      subtitle: interestRange,
      tags: p.tags.map((tag) => ({
        text: tag,
        color: getTagColor(tag),
      })),
      statusText: remainingPercentage <= 10 ? "마감 임박" : undefined,
      statusIcon: remainingPercentage <= 10 ? Clock : undefined,
      statusIconColor: remainingPercentage <= 10 ? "text-red-500" : undefined,
      onClick: () => navigate(`/token/onsale/products/${p.id}`, { state: { product: p } }),
    };
  });

  return (
    <div className="flex flex-col h-full">
      <Header title="K-토큰 상품" />

      <div className="flex-1 overflow-auto p-4">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="상품 검색어를 입력해 주세요."
            className="w-full py-3 px-4 bg-gray-100 rounded-full"
          />
        </div>

        <TokenCategoryTab
          categories={categories}
          selected={selectedCat}
          onSelect={setSelectedCat}
        />

        <TokenProductList items={tokenProductItems} />
      </div>
      <BottomNav />
    </div>
  );
}