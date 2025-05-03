import React, { useState } from "react";
import CryptocurrencyTags from "./CryptocurrencyTags";

interface ShopInfoProps {
  likeCount: number;
  storeName: string;
  storeAddress: string;
  coinStatus: any[];
}

function ShopInfo({ likeCount, storeName, storeAddress, coinStatus }: ShopInfoProps) {
  // 찜 상태 관리
  const [isWishlisted, setIsWishlisted] = useState(false);

  // 찜 토글 함수
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="flex flex-col self-center mt-3 w-full font-bold text-center text-black">
      {/* 좋아요 정보 */}
      <div className="flex flex-col items-end px-16 w-full text-sm leading-none text-right whitespace-nowrap text-zinc-500">
        <div className="flex gap-1.5 items-center">
          <div className="flex gap-0.5 items-center self-stretch px-0.5 my-auto rounded-lg min-h-7">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f858afd6afdcae51bee8f20618fc3d278d3c28a1?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a"
              alt="Like icon"
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            />
            <span className="self-stretch my-auto" aria-label={`${likeCount} likes`}>
              {likeCount}
            </span>
          </div>
        </div>
      </div>

      {/* 가게 이름 및 주소 */}
      <h2 className="text-xl tracking-tight leading-snug">
        {storeName}
      </h2>
      <p className="self-center text-base tracking-tight leading-7">
        주소: {storeAddress}
      </p>

      {/* 코인 태그(coinStatus)를 표시하고 싶다면 아래와 같이 활용 가능(임의 예시) */}
      <div className="flex self-center space-x-2 mb-2 mt-3">
        <CryptocurrencyTags tags={coinStatus} />
      </div>

      {/* 찜 버튼 예시 */}
      <button
        onClick={toggleWishlist}
        className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {isWishlisted ? "찜 해제" : "찜 하기"}
      </button>
    </div>
  );
}

export default ShopInfo;