import React from "react";
import { StoreInfoType } from "./type";


interface StoreInfoProps {
  storeInfo: StoreInfoType;
}

export const StoreInfo: React.FC<StoreInfoProps> = ({ storeInfo }) => {
  return (
    <section className="flex flex-col justify-center items-center mt-5 w-full font-bold">
      <div className="flex overflow-hidden flex-col px-5 w-full">
        <div className="flex flex-col w-full text-center text-black">
          <div className="flex gap-5 justify-between w-full text-sm leading-none text-right text-zinc-500">
            <div
              className="flex gap-0.5 items-center px-0.5 whitespace-nowrap rounded-lg min-h-7"
              aria-label="Likes"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f858afd6afdcae51bee8f20618fc3d278d3c28a1?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a"
                alt="Like icon"
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              />
              <div className="self-stretch my-auto">{storeInfo.likes}</div>
            </div>
            <div className="flex gap-2 my-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/877be8f997d681bad94537f6db1ba185dcb5f369?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a"
                alt="Status icon"
                className="object-contain shrink-0 self-start w-5 aspect-square stroke-[1.5px] stroke-zinc-700"
              />
              <div>{storeInfo.isOpen ? "영업 중" : "영업 종료"}</div>
            </div>
          </div>
          <h2 className="text-xl tracking-tight leading-snug">
            {storeInfo.name}
          </h2>
          <p className="self-center text-base tracking-tight leading-7">
            주소: {storeInfo.address}
          </p>
        </div>
        <div className="flex gap-1 items-center self-center mt-4 text-sm leading-6 whitespace-nowrap text-stone-500">
          {storeInfo.supportedCoins.map((coin, index) => (
            <div
              key={index}
              className={`self-stretch px-1.5 py-px my-auto rounded ${coin.className}`}
            >
              {coin.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
