import Button from "@/components/common/Button";
import Header from "@/components/common/Header"
import { BankLogo } from "@/components/common/BankLogo";
import { ProductTag } from "@/components/token/onsale-product/ProductTag";
import { useNavigate } from "react-router-dom"
import { productInfoData, additionalInfoData, bankProductData,productTags } from "@/mocks/token";
import BankProductInfo from "@/components/token/onsale-product/TokenProductInfo";
import ProductDetailInfo from "@/components/token/onsale-product/ProductDetailInfo";
import ProductAdditionalInfo from "@/components/token/onsale-product/ProductAdditionalInfo";


export default function OnSaleTokenProductDetail() {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/token/onsale/products/signup", { state: { product: "woori" } })
  }

  const tagColorMapping: { [key: string]: string } = {
    "29세이하": "gray",
    "월 최대 50만 토큰": "purple",
    "세제혜택": "green",
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="자산관리" />

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <BankLogo bank="HTK" />
          <BankProductInfo {...bankProductData} />
          <div className="flex gap-2 mt-2 mb-4">
            {productTags.map((tag, index) => (
              <ProductTag key={index} text={tag} color={(tagColorMapping[tag] || "gray") as "gray" | "purple" | "green"} />
            ))}
          </div>
        </div>

        <ProductDetailInfo {...productInfoData} />

        <ProductAdditionalInfo {...additionalInfoData} />
      </div>

      <div className="p-4">
        <Button text="토큰 상품 가입" onClick={handleSignupClick} fullWidth />
      </div>
    </div>


  )
}
