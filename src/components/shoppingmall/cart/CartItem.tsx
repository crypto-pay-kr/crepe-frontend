import React from "react";
import { CartItemType } from "./type";


interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  return (
    <div className="px-3 w-full min-h-[70px]">
      <div className="flex gap-5 justify-between py-1 w-full max-w-[308px]">
        <div className="flex gap-5">
          <img
            src={item.image}
            alt={item.name}
            className="object-contain shrink-0 aspect-[1.32] w-[82px]"
          />
          <div className="flex flex-col my-auto">
            <div className="self-start text-xs font-medium text-blue-900 opacity-90">
              {item.price}
            </div>
            <div className="text-base font-semibold text-black">
              {item.name}
            </div>
          </div>
        </div>
        <div className="my-auto text-base font-medium text-zinc-500">
          {item.quantity}
        </div>
      </div>
      <div className="mt-3 max-w-full min-h-0 border border-solid border-neutral-100 w-[308px]" />
    </div>
  );
};
