import React from "react";

interface MenuItemProps {
    name: string;
    price: number | string; // 가격은 숫자 또는 문자열로 받을 수 있음
    currency: string; // 통화 단위 (예: USD, KRW 등)
    image: string; // 이미지 URL
    onClick?: () => void;
}

function MenuItem({ name, price, currency, image, onClick }: MenuItemProps) {
  return (
    <li onClick={onClick} className="flex gap-10 py-1 pl-2 mt-2.5 first:mt-0 max-w-full cursor-pointer">
      <div className="flex-1 my-auto">
        <h3 className="text-base font-semibold text-black">{name}</h3>
        <div className="flex gap-1.5 mt-1.5 text-xs">
          <span className="text-zinc-500">{price}</span>
          <span className="font-semibold text-blue-900">{currency}</span>
        </div>
      </div>
      <img
        src={image}
        alt={`${name} dish`}
        className="object-contain shrink-0 aspect-[1.32] w-[82px]"
      />
    </li>
  );
}

export default MenuItem;
