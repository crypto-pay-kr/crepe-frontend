import React from "react"
import BankProductItem, {BankProductItemProps} from "./TokenProductItem"


interface BankProductListProps {
  items: BankProductItemProps[]
}

export default function BankProductList({ items }: BankProductListProps) {
  return (
    <div className="space-y-6 p-3">
      {items.map((item, idx) => (
        <BankProductItem key={idx} {...item} />
      ))}
    </div>
  )
}