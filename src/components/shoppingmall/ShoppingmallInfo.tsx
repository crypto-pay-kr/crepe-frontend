import React from "react";
import CryptocurrencyTags from "./CryptocurrencyTags";
import { CoinStatus } from '@/types/store';

interface ShopInfoProps {
    storeId: number;
    likeCount?: number;
    coinStatus?: CoinStatus[]; // CoinStatus 타입으로 변경
    storeName?: string;
    storeAddress?: string;
}

function ShopInfo({ storeId, likeCount, coinStatus, storeName, storeAddress }: ShopInfoProps) {
    // coinStatus 데이터 디버깅
    console.log('ShopInfo에서 받은 coinStatus:', coinStatus);
    
    return (
        <div className="flex flex-col self-center mt-3 w-full text-center">
            {/* 좋아요 섹션 */}
            <div className="flex justify-end px-4 w-full text-sm text-zinc-500">
                <div className="flex gap-1.5 items-center">
                    <div className="flex gap-0.5 items-center px-0.5 rounded-lg">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f858afd6afdcae51bee8f20618fc3d278d3c28a1?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a"
                            alt="좋아요 아이콘"
                            className="w-4 aspect-square"
                        />
                        <span aria-label={`좋아요 ${likeCount || 0}개`}>
                            {likeCount || 0}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* 가게 이름 */}
            <h2 className="text-xl font-bold tracking-tight">
                {storeName || "명동칼국수 상암IT타워점"}
            </h2>
            
            {/* 가게 주소 */}
            <p className="text-base tracking-tight mt-1 text-gray-700">
                주소: {storeAddress || "부천광역시 마장동 본훈구 21동 2층"}
            </p>
            
            {/* 암호화폐 태그 - 업데이트된 CryptocurrencyTags 컴포넌트 사용 */}
            <div className="flex justify-center mt-6 mb-2">
                {coinStatus && <CryptocurrencyTags coins={coinStatus} />}
            </div>
        </div>
    );
}

export default ShopInfo;