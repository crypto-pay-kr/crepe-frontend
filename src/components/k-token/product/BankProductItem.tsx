import React from "react"
import { BankLogo } from "@/components/common/BankLogo"
import { ProductTag } from "@/components/k-token/product/ProductTag";
import { LucideIcon, Clock, AlertCircle } from "lucide-react"


export interface BankProductItemProps {
    bank: "woori" | "shinhan"
    name: string
    subtitle?: string
    tags: string[]
    statusText?: string
    statusIcon?: LucideIcon
    statusIconColor?: string
    onClick?: () => void
}

const tagColorMapping: { [key: string]: string } = {
    "29세이하": "gray",
    "월 최대 50만 토큰": "purple",
    "세제혜택": "green",
};


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
            <div className="mt-2 font-bold text-2xl">{name}</div>
            {subtitle && (
                <div className="text-2xl font-bold mb-2">{subtitle}</div>
            )}
            {StatusIcon && statusText && (
                <div className="flex items-center mb-2 mt-2">
                    <StatusIcon size={20} className={statusIconColor} />
                    <span className={`ml-1 text-sm ${statusIconColor}`}>{statusText}</span>
                </div>
            )}
            <div className="flex gap-2 mt-2 mb-4">
                {tags.map((tag, index) => (
                    <ProductTag key={index} text={tag} color={(tagColorMapping[tag] || "gray") as "gray" | "purple" | "green"} />
                ))}
            </div>
        </div>
    )
}