import React from "react";
import CryptocurrencyTags from "./CryptocurrencyTags";
import { stores } from "../../mocks/stores";

interface ShopInfoProps {
    storeId: number; // 가게 ID를 props로 전달받음
}

function ShopInfo({ storeId }: ShopInfoProps) {

    const store = stores.find((store) => store.id === storeId);


    // 가게 정보가 없을 경우 처리
    if (!store) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-bold text-gray-500">가게 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }


    return (
        <div className="flex flex-col self-center mt-3 w-full font-bold text-center text-black">
            <div className="flex flex-col items-end px-16 w-full text-sm leading-none text-right whitespace-nowrap text-zinc-500">
                <div className="flex gap-1.5 items-center">
                    <div className="flex gap-0.5 items-center self-stretch px-0.5 my-auto rounded-lg min-h-7">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f858afd6afdcae51bee8f20618fc3d278d3c28a1?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a"
                            alt="Like icon"
                            className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                        />
                        <span className="self-stretch my-auto" aria-label="50 likes">
                            50
                        </span>
                    </div>
                </div>
            </div>
            <h2 className="text-xl tracking-tight leading-snug">
                명동칼국수 상암IT타워점
            </h2>
            <p className="self-center text-base tracking-tight leading-7">
                주소: 부천광역시 마장동 본훈구 21동 2층
            </p>
            <div className="flex self-center space-x-2 mb-2 mt-10">
                <CryptocurrencyTags tags={store.tags} />
            </div>
        </div>
    );
}

export default ShopInfo;
