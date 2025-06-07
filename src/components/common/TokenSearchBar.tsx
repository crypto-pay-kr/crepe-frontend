// components/common/TokenSearchBar.tsx
import React from "react";

interface TokenSearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function TokenSearchBar({
                                         value,
                                         onChange,
                                       }: TokenSearchBarProps) {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="상품 검색어를 입력해 주세요."
        className="w-full py-3 px-4 bg-gray-100 rounded-full focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
