import React from "react"
import BankProductItem, {BankProductItemProps} from "./BankProductItem"


interface BankProductListProps {
  items: BankProductItemProps[]
}

export default function BankProductList({ items }: BankProductListProps) {
  return (
    <div className="space-y-6">
      {items.map((item, idx) => (
        <BankProductItem key={idx} {...item} />
      ))}
    </div>
  )
}