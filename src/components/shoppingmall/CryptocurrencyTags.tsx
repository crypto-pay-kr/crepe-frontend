import React from "react";

interface CryptocurrencyTagsProps {
  tags: string[];
}

function CryptocurrencyTags({ tags }: CryptocurrencyTagsProps) {
  const tagStyles: { [key: string]: string } = {
    XRP: "bg-gray-200 text-gray-700",
    SOL: "bg-purple-200 text-purple-700",
    USDT: "bg-green-200 text-green-700",
  };

  return (
    <div className="flex space-x-2 mb-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`px-2 py-1 text-xs rounded-xl ${
            tagStyles[tag] || "bg-blue-200 text-blue-700"
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default CryptocurrencyTags;