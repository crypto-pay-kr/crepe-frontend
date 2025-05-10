interface BankLogoProps {
    bank: "woori" | "shinhan" | "hana"
}

const bankData: Record<BankLogoProps["bank"], { label: string; image: string }> = {
    woori: { label: "우리은행", image: "/woori.png" },
    shinhan: { label: "신한은행", image: "/shinhan.png" },
    hana: { label: "하나은행", image: "/hana.png" },
}

export function BankLogo({ bank }: BankLogoProps) {
    const { label, image } = bankData[bank]
    return (
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                <img src={image} alt={label} className="object-cover w-full h-full" />
            </div>
            <div className="ml-2 font-bold text-lg">{label}</div>
        </div>
    )
}
