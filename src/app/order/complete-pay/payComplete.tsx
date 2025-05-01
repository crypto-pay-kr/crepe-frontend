import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Header from "@/components/common/Header"
import BottomNav from "@/components/common/BottomNavigate"
import Button from "@/components/common/Button"
import OrderProgressBar from "@/components/order/OrderProcessBar"
import OrderSummaryCard from "@/components/order/OrderSummaryCard"

export default function PayCompletePage() {
  const navigate = useNavigate()

  // 애니메이션 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header title="주문 요청" isStore={false} />
      <motion.div
        className="flex-grow"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="p-6">
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <div className="inline-block rounded-full bg-green-100 p-4 mb-4 shadow-md">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">주문이 접수되었습니다</h1>
            <p className="text-gray-600">곧 매장에서 주문을 확인할 예정입니다</p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <OrderProgressBar currentStep={1} />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="my-8 transition-all duration-300 hover:shadow-lg rounded-xl"
          >
            <OrderSummaryCard 
              orderNumber="90897"
              storeName="명동 칼국수 마장동"
              items="칼국수 외 1개"
              orderDate="2024년 12월 20일 19시 52분"
              orderCode="11YP0000PM12"
              storeLocation="테스트시..."
            />
          </motion.div>
          
          <motion.div 
            className="mt-6"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button 
              text="홈으로 돌아가기" 
              onClick={() => navigate("/mall")} 
              color="primary"
              className="py-4 rounded-xl shadow-lg"
              fullWidth={true}
            />
          </motion.div>
          
          <motion.div 
            className="mt-6 text-center text-gray-500 text-sm"
            variants={itemVariants}
          >

          </motion.div>
        </div>
      </motion.div>
      <BottomNav/>
    </div>
  )
}