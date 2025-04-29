import React from "react";

interface CartFooterProps {
  totalAmount: string;
  onAddMore: () => void;
  onSelectPayment: () => void;
}

export const CartFooter: React.FC<CartFooterProps> = ({
  totalAmount,
  onAddMore,
  onSelectPayment,
}) => {
  return (
    <footer>
      <div className="flex gap-1 self-center mt-16 max-w-full font-bold w-[119px]">
        <button
          onClick={onAddMore}
          className="flex items-center gap-1"
          aria-label="더 담으러 가기"
        >
          <div className="my-auto w-6 h-6 text-sm leading-6 text-center text-white whitespace-nowrap rounded bg-blue-950">
            +
          </div>
          <div className="text-base leading-7 text-black">더 담으러 가기</div>
        </button>
      </div>

      <div className="flex gap-5 justify-between self-center mt-11 w-full text-lg text-black max-w-[328px]">
        <div className="font-[250]">총금액</div>
        <div className="font-semibold">{totalAmount}</div>
      </div>

      <button
        onClick={onSelectPayment}
        className="self-center px-4 py-3.5 mt-11 w-full text-base font-bold leading-7 text-white rounded-lg bg-blue-950 max-w-[328px] min-h-14"
        aria-label="결제 수단 선택"
      >
        결제 수단 선택
      </button>

      <nav className="mt-7 w-full text-xs font-medium text-center text-white whitespace-nowrap bg-red-400">
        <div className="flex flex-col justify-center px-6 py-2.5 w-full bg-blue-500 min-h-16 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="flex gap-10 justify-center items-center w-full">
            <div className="flex flex-col self-stretch my-auto min-h-[46px] w-[57px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a10439626f691994e3cb915dcb0a46f03f188cd?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a"
                alt="Home icon"
                className="object-contain self-center w-6 aspect-square"
              />
              <div>홈</div>
            </div>
            <div className="flex flex-col self-stretch my-auto min-h-[46px] w-[57px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/fac5a4e1325eb144693a05d6f70b3c14af5d85a9?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a"
                alt="Shopping icon"
                className="object-contain self-center w-6 aspect-square"
              />
              <div>쇼핑몰</div>
            </div>
            <div className="flex flex-col self-stretch my-auto min-h-[46px] w-[57px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad1c6a86cfeca52dcb011bce3b5e47611ae8bc55?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a"
                alt="My page icon"
                className="object-contain self-center w-6 aspect-square"
              />
              <div>마이페이지</div>
            </div>
          </div>
        </div>
      </nav>
    </footer>
  );
};
