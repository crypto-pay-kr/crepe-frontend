import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/common/Header"
import BottomNav from "@/components/common/BottomNavigate"
import { Home, ShoppingBag, User } from "lucide-react"

export default function LoadingPage() {
  const navigate = useNavigate()
  const isSeller = false

  const goBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/shoppingmall/store/pay-complete")
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigate])

  const navItems = [
    {
      icon: <Home className="w-6 h-6" color="white" />,
      label: "홈",
      isActive: false,
      onClick: () => navigate("/home"),
    },
    {
      icon: <ShoppingBag className="w-6 h-6" color="white" />,
      label: "쇼핑몰",
      isActive: true,
      onClick: () => navigate("/shoppingmall"),
    },
    {
      icon: <User className="w-6 h-6" color="white" />,
      label: "마이페이지",
      isActive: false,
      onClick: () => navigate(isSeller ? "/my/store" : "/my"),
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Header title="주문 요청" isStore={false} />
      <div className="flex-grow bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 border-t-4 border-b-4 border-[#002169] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">결제 처리 중...</p>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <BottomNav navItems={navItems} />
      </div>
    </div>
  )
}
