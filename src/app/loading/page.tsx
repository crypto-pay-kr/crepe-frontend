import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/common/Header"
import BottomNav from "@/components/common/BottomNavigate"

export default function LoadingPage() {
    const navigate = useNavigate()
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/mall/store/pay-complete")
        }, 2000)
        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="주문 요청" isStore={false} />
            <div className="flex-grow bg-white flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 border-t-4 border-b-4 border-[#002169] rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">결제 처리 중...</p>
                </div>
            </div>
            <BottomNav />
        </div>
    )
}
