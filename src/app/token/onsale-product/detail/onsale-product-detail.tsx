import Button from "@/components/common/Button";
import Header from "@/components/common/Header"
import { BankLogo } from "@/components/common/BankLogo";
import { ProductTag } from "@/components/token/onsale-product/ProductTag";
import { useNavigate } from "react-router-dom"
import BankProductInfo from "@/components/token/onsale-product/TokenProductInfo";
import ProductDetailInfo from "@/components/token/onsale-product/ProductDetailInfo";
import ProductAdditionalInfo from "@/components/token/onsale-product/ProductAdditionalInfo";
import { useEffect, useState } from 'react'
import { fetchProductDetail } from '@/api/product'
import { useParams } from "react-router-dom"
import { GetOnsaleProductListResponse, GetProductDetailResponse } from '@/types/product'
import { bankMeta } from "@/utils/bankMeta";
import { useLocation } from "react-router-dom";



export default function OnSaleTokenProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState<GetProductDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const productFromList = location.state?.product as GetOnsaleProductListResponse | undefined

  const tagColors = ["gray", "purple", "green"] as const;
  type TagColor = typeof tagColors[number];

  function getColorForTag(tag: string): TagColor {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % tagColors.length;
    return tagColors[index];
  }

  useEffect(() => {
    fetchProductDetail(Number(productId))
      .then(setProduct)
      .catch(() => setError("상품 정보를 불러오는 데 실패했습니다."));
  }, [productId]);

  if (!product) {
    return <div className="p-4">상품 정보를 불러오는 중입니다...</div>;
  }
  const mergedProduct = {
    ...productFromList,
    ...product,
  }

  const bankInfo = bankMeta[mergedProduct.bankName ?? "WTK"]

  const handleSignupClick = () => {
    navigate("/token/onsale/products/signup", { state: { product: mergedProduct } })
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="자산관리" />

      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-4">
            <BankLogo bank={bankInfo?.code ?? "WTK"} />
            <BankProductInfo
              productTitle={mergedProduct.productName}
              interestRange={
                mergedProduct.minInterestRate && mergedProduct.maxInterestRate
                  ? `연 ${mergedProduct.minInterestRate}% ~ 연 ${mergedProduct.maxInterestRate}%`
                  : `기본금리 연 ${mergedProduct.baseInterestRate}%`
              }
            />

            <div className="flex gap-2 mt-3 flex-wrap">
              {mergedProduct.tags?.map((tag, index) => (
                <ProductTag
                  key={index}
                  text={tag}
                  color={getColorForTag(tag)}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">상품 안내</h2>
            <ProductDetailInfo
              productName={mergedProduct.productName}
              productType={mergedProduct.type}
              target={mergedProduct.joinCondition?.allAges ? "전 연령" : mergedProduct.joinCondition?.ageGroups?.join(", ") ?? "-"}
              amount={mergedProduct.maxMonthlyPayment + "원"}
              condition={mergedProduct.joinCondition?.occupations?.join(", ") ?? "-"}
              interestPayment="만기 일시 지급"
              baseRate={`연 ${mergedProduct.baseInterestRate}%`}
              preferentialRate={
                mergedProduct.rateConditions?.length
                  ? `최대 연 ${Math.max(...mergedProduct.rateConditions.map(c => c.rate))}%`
                  : "없음"
              }
              infoMessage="자세한 우대조건은 상품 가이드를 확인하세요."
            />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">추가 정보</h2>
            <ProductAdditionalInfo
              depositorProtection="예금자 보호 대상 아님"
              productType={mergedProduct.type}
              selectionEnrollment={mergedProduct.rateConditions?.map(cond => cond.title) ?? []}
              interestRateNotice={
                mergedProduct.rateConditions?.length
                  ? `우대 조건 만족 시 최대 연 ${Math.max(...mergedProduct.rateConditions.map(c => c.rate))}% 우대 이율 제공`
                  : "우대 조건 없음"
              }
            />
          </div>
        </div>
      </div>


      <div className="p-4">
        <Button text="토큰 상품 가입" onClick={handleSignupClick} fullWidth />
      </div>
    </div>
  )
}