import React from "react"
import { BankLogo } from "@/components/common/BankLogo"
import { ProductTag } from "@/components/token/onsale-product/ProductTag";
import { LucideIcon, Clock, AlertCircle } from "lucide-react"


export interface BankProductItemProps {
    productId: number;
    bank: "WTK" | "STK" | "HTK" | "KTK" | "NTK"
    name: string
    subtitle?: string
    tags: string[]
    statusText?: string
    statusIcon?: LucideIcon
    statusIconColor?: string
    onClick?: () => void
}

const tagColors = ["gray", "purple", "green"] as const;
type TagColor = typeof tagColors[number];

function getColorForTag(tag: string): TagColor {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % tagColors.length;
  return tagColors[index];
}


export default function BankProductItem({
    bank,
    name,
    subtitle,
    tags,
    statusText,
    statusIcon: StatusIcon,
    statusIconColor,
    onClick,
}: BankProductItemProps) {

    return (
        <div
            onClick={onClick}
            className="border-b pb-4 cursor-pointer hover:bg-gray-50"
        >
            <BankLogo bank={bank} />
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
                        <ProductTag key={index} text={tag}  color={getColorForTag(tag)} />
                    ))}
                </div>

            </div>

        </div>
    )
}