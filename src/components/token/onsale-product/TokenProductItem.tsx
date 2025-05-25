import React from "react";
import { ProductTag } from "@/components/token/onsale-product/ProductTag";
import { LucideIcon } from "lucide-react";

export interface TokenProductItemProps {
  productId: number;
  bankName: string;
  imageUrl: string;
  name: string;
  subtitle?: string;
  tags: { text: string; color: string }[];
  statusText?: string;
  statusIcon?: LucideIcon; // LucideIcon 타입으로 수정
  statusIconColor?: string;
  onClick?: () => void;
}

export default function TokenProductItem({
  bankName,
  imageUrl,
  name,
  subtitle,
  tags,
  statusText,
  statusIcon: StatusIcon,
  statusIconColor,
  onClick,
}: TokenProductItemProps) {
  return (
    <div
      onClick={onClick}
      className="border-b pb-4 cursor-pointer hover:bg-gray-50"
    >
      <img src={imageUrl} alt={bankName} className="w-12 h-12 rounded-full" />
      <div className="px-2">
        <div className="mt-2 font-bold text-2xl">{name}</div>
        {subtitle && (
          <div className="text-1xl font-bold mb-2 text-blue">{subtitle}</div>
        )}
        {StatusIcon && statusText && (
          <div className="flex items-center mb-2 mt-2">
            <StatusIcon size={20} className={statusIconColor} />
            <span className="ml-1 text-sm text-red-500">{statusText}</span>
          </div>
        )}
        <div className="flex gap-2 mt-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-sm font-medium ${tag.color}`}
            >
              {tag.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}