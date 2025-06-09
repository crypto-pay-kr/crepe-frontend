import React from "react";
import TokenProductItem, { TokenProductItemProps } from "./TokenProductItem";

interface TokenProductListProps {
  items: TokenProductItemProps[];
}

export default function TokenProductList({ items }: TokenProductListProps) {
  return (
    <div className="space-y-6 p-2">
      {items.map((item) => (
        <TokenProductItem key={item.productId} {...item} />
      ))}
    </div>
  );
}