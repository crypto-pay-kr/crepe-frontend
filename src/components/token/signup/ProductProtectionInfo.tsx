import React from "react";

export interface ProductProtectionInfoProps {
  protectionConfirmed: boolean;
  onConfirm: () => void;
  onDeny: () => void;
}

export default function ProductProtectionInfo({
  protectionConfirmed,
  onConfirm,
  onDeny,
}: ProductProtectionInfoProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">
        예금자 보호 안내 및 이해 확인
      </h3>
      <div className="border p-4 rounded-md mb-4">
        <img
          src="/finance-mark.png"
          alt="Finance Mark"
          className="w-16 h-16 object-contain mx-auto"
        />
        <p className="text-sm">
          이 예금은 예금자보호법에 따라 원금과 소정의 이자를 합하여 1인당 "5천만원까지"(본 은행의 여타 보호상품과 합산) 보호됩니다.
        </p>
      </div>
      <p className="mb-4">
        예금자 보호에 대한 내용을  <span className="font-bold text-[#4B5EED]">충분히</span> <span className="font-bold text-[#4B5EED]">이해하고 확인</span>하셨나요?
      </p>
      <div className="flex gap-2">
        <button
          onClick={onDeny}
          className="flex-1 py-2  text-sm font-medium border border-gray-200 rounded-md text-center"
        >
          아니오
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 py-2 rounded-md text-center text-sm font-medium ${protectionConfirmed
            ? "bg-[#4B5EED] text-white"
            : "bg-gray-200 border border-gray-200 text-gray-500"
            }`}
        >
          네
        </button>
      </div>
    </div>
  );
}