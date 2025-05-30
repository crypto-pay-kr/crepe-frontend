import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import BankProductInfo from "@/components/token/onsale-product/TokenProductInfo";
import ProductDetailInfo from "@/components/token/onsale-product/ProductDetailInfo";
import ProductAdditionalInfo from "@/components/token/onsale-product/ProductAdditionalInfo";
import { fetchProductDetail } from "@/api/product";
import { GetOnsaleProductListResponse, GetProductDetailResponse } from "@/types/product";
import { getTagColor } from "@/utils/tagUtils";
import { mapProductTypeToFrontend } from "@/utils/productTypeUtils";
import { AGE_OPTIONS, INCOME_OPTIONS, OCCUPATION_OPTIONS } from "@/constants/subscribe-condition";
import { ProductLogo } from "@/components/common/ProductLogo";

/* 나이•직업•소득 조건 매핑 함수 */
function mapJoinCondition(condition: string[], options: { id: string; label: string }[]) {
  return condition.map((id) => options.find((option) => option.id === id)?.label || id).join(", ");
}

export default function OnSaleTokenProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState<GetProductDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // 목록 페이지(onsale-product-list 등)에서 넘어온 데이터(선택된 상품)
  const productFromList = location.state?.product as GetOnsaleProductListResponse | undefined;

  useEffect(() => {
    // 상품 상세 정보 API 호출
    fetchProductDetail(Number(productId))
      .then(setProduct)
      .catch(() => setError("상품 정보를 불러오는 데 실패했습니다."));
  }, [productId]);

  if (!product) {
    return <div className="p-4">상품 정보를 불러오는 중입니다...</div>;
  }

  // 전달받은 목록 데이터와 상세 API 데이터를 합쳐 최종 상품 정보를 구성
  const mergedProduct = {
    ...productFromList,
    ...product,
  };

  // 가입 조건 매핑
  const mappedAgeGroups = mapJoinCondition(
    mergedProduct.joinCondition?.ageGroups || [],
    AGE_OPTIONS
  );
  const mappedOccupations = mapJoinCondition(
    mergedProduct.joinCondition?.occupations || [],
    OCCUPATION_OPTIONS
  );
  const mappedIncomeLevels = mapJoinCondition(
    mergedProduct.joinCondition?.incomeLevels || [],
    INCOME_OPTIONS
  );

  // 이자 범위 문자열 생성
  let interestRange = "";
  const frontType = mapProductTypeToFrontend(mergedProduct.type);

  if (frontType === "상품권") {
    // minInterestRate와 maxInterestRate가 있으면 할인율 범위, 없으면 단일 할인율
      interestRange = `할인율 ${mergedProduct.baseInterestRate}%`;
  } else {
    // 상품권이 아닌 경우
    if (mergedProduct.minInterestRate && mergedProduct.maxInterestRate) {
      interestRange = `연 ${mergedProduct.minInterestRate}% ~ 연 ${mergedProduct.maxInterestRate}%`;
    } else {
      interestRange = `기본금리 연 ${mergedProduct.baseInterestRate}%`;
    }
  }

  // 가입 버튼 클릭 시, signup 페이지로 필요한 데이터 전달
  const handleSignupClick = () => {
    navigate(`/token/onsale/products/${productId}/signup`, {
      state: {
        // signup에서 사용할 데이터
        productId: productId,
        productName: mergedProduct.productName,
        bankName: mergedProduct.bankName,
        tags: mergedProduct.tags,
        productType: mergedProduct.type,
        imageUrl: mergedProduct.imageUrl,
        guideFile: mergedProduct.guideFile, // PDF 파일 경로 (필수)
        interestRange,
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="자산관리" />

      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4 space-y-4">
          {/* 상품 대표 카드 */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <ProductLogo imageUrl={mergedProduct.imageUrl} />
            <BankProductInfo
              productTitle={mergedProduct.productName}
              interestRange={interestRange}
            />

            {/* 태그 렌더링 */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {mergedProduct.tags?.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 상품 안내 */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">상품 안내</h2>
            <ProductDetailInfo
              productName={mergedProduct.productName}
              bankName={mergedProduct.bankName}
              productType={mapProductTypeToFrontend(mergedProduct.type)}
              target={mappedAgeGroups || "전 연령"}
              amount={`${mergedProduct.maxMonthlyPayment}`}
              condition={mappedOccupations || "-"}
              incomeLevel={mappedIncomeLevels || "-"}
              interestPayment="만기 일시 지급"
              baseRate={`${mergedProduct.baseInterestRate}%`}
              preferentialRate={
                mergedProduct.rateConditions?.length
                  ? `최대 연 ${Math.max(...mergedProduct.rateConditions.map((c) => c.rate))}% 우대`
                  : "없음"
              }
              infoMessage="자세한 우대조건은 상품 가이드를 확인하세요."
            />
          </div>

          {/* 추가 정보 */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">추가 정보</h2>
            <ProductAdditionalInfo
              depositorProtection="예금자 보호 대상 아님"
              productType={mapProductTypeToFrontend(mergedProduct.type)}
              selectionEnrollment={mergedProduct.rateConditions?.map((cond) => cond.title) ?? []}
              interestRateNotice={
                mergedProduct.rateConditions?.length
                  ? `우대 조건 만족 시 최대 연 ${Math.max(...mergedProduct.rateConditions.map((c) => c.rate))}% 우대 이율 제공`
                  : "우대 조건 없음"
              }
            />
          </div>
        </div>
      </div>

      {/* 가입 버튼 */}
      <div className="p-3">
        <Button
          text="토큰 상품 가입"
          onClick={handleSignupClick}
          fullWidth
          className="text-base font-medium"
        />
      </div>
    </div>
  );
}