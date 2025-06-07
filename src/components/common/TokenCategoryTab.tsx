import React from "react"

interface TokenCategoryTabProps {
  categories: string[]
  selected: string
  onSelect: (cat: string) => void
}


export default function TokenCategoryTab({
  categories,
  selected,
  onSelect,
}: TokenCategoryTabProps) {
  return (
    <div className="flex border-b mb-4">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`pb-2 px-4 ${
            selected === cat ? "border-b-2 border-black font-bold" : "text-gray-500"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}