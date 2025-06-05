import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import { Clock } from "lucide-react";
import TokenProductList from "@/components/token/onsale-product/TokenProductList";
import TokenCategoryTab from "@/components/common/TokenCategoryTab";
import TokenSearchBar from "@/components/common/TokenSearchBar";
import BottomNav from "@/components/common/BottomNavigate";
import { GetOnsaleProductListResponse } from "@/types/product";
import { fetchOnSaleTokenProducts } from "@/api/product";
import { calculateRemainingPercentage } from "@/utils/calculateRemainingPercentage";
import { getTagColor } from "@/utils/tagUtils";
import { mapProductTypeToFrontend } from "@/utils/productTypeUtils";

export default function OnSaleTokenProductListPage() {
  const navigate = useNavigate();

  // 카테고리 목록
  const categories = ["전체", "예금", "적금", "상품권"];

  // 선택된 카테고리
  const [selectedCat, setSelectedCat] = useState<string>("전체");

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState<string>("");

  // API에서 받아온 전체 상품 목록
  const [products, setProducts] = useState<GetOnsaleProductListResponse[]>([]);

  useEffect(() => {
    fetchOnSaleTokenProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  // ▷ 카테고리와 검색어를 동시에 반영한 필터링 결과
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. 카테고리 필터
      const frontType = mapProductTypeToFrontend(p.type);
      const matchesCategory =
        selectedCat === "전체" || frontType === selectedCat;

      if (!matchesCategory) return false;

      // 2. 검색어 필터 (상품명에 searchTerm이 포함되어야 함)
      if (searchTerm.trim() !== "") {
        const lowerName = p.productName.toLowerCase();
        const lowerSearch = searchTerm.trim().toLowerCase();
        return lowerName.includes(lowerSearch);
      }

      return true;
    });
  }, [products, selectedCat, searchTerm]);

  // ▷ 필터링된 상품을 화면에 그릴 아이템 형태로 매핑
  const tokenProductItems = filteredProducts.map((p) => {
    const remainingPercentage = calculateRemainingPercentage(
      p.totalParticipants,
      p.currentParticipants
    );

    // 이자 범위 문자열 생성
    const frontType = mapProductTypeToFrontend(p.type);
    let interestRange = "";

    if (frontType === "상품권") {
      interestRange = `할인율 ${p.maxInterestRate}%`;
    } else if (
      p.minInterestRate != null &&
      p.maxInterestRate != null &&
      p.minInterestRate !== p.maxInterestRate
    ) {
      interestRange = `연 ${p.minInterestRate}% ~ 연 ${p.maxInterestRate}%`;
    } else if (
      p.minInterestRate != null &&
      p.maxInterestRate != null &&
      p.minInterestRate === p.maxInterestRate
    ) {
      interestRange = `연 ${p.minInterestRate}%`;
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
      onClick: () =>
        navigate(`/token/onsale/products/${p.id}`, { state: { product: p } }),
    };
  });

  return (
    <div className="flex flex-col h-full">
      <Header title="K-토큰 상품" />

      <div className="flex-1 overflow-auto p-4">
        {/* 1) 검색창 컴포넌트 */}
        <TokenSearchBar value={searchTerm} onChange={setSearchTerm} />

        {/* 2) 카테고리 탭 */}
        <TokenCategoryTab
          categories={categories}
          selected={selectedCat}
          onSelect={setSelectedCat}
        />

        {/* 3) 상품 리스트 */}
        <TokenProductList items={tokenProductItems} />
      </div>

      <BottomNav />
    </div>
  );
}
