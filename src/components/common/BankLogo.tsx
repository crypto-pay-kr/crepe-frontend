export interface BankLogoProps {

    bank: "WTK" | "STK" | "HTK" | "KTK" | "NTK"
}

const bankData: Record<BankLogoProps["bank"], { label: string; image: string }> = {
    WTK: { label: "우리은행", image: "/woori.png" },
    STK: { label: "신한은행", image: "/shinhan.png" },
    HTK: { label: "하나은행", image: "/hana.png" },
    KTK: { label: "국민은행", image: "/hana.png" },
    NTK: { label: "농협은행", image: "/hana.png" },

}



export function BankLogo({ bank }: BankLogoProps) {
    const { label, image } = bankData[bank]
    return (
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                <img src={image} alt={label} className="object-cover w-full h-full" />
            </div>
        </div>
    )
}
