import React from "react"


interface OrderDetail {
  menuName: string;
  menuCount: number;
  menuPrice: number;
}

interface OrderSummaryCardProps {
  orderId: string;
  totalPrice: number;
  orderStatus: string;
  orderType: string;
  orderDetails: OrderDetail[];
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  orderId,
  totalPrice,
  orderStatus,
  orderType,
  orderDetails,
}) => {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-2">
          <ShoppingCartIcon />
        </div>
        <div>
          <div className="font-bold">Order #{orderId}</div>
          <div className="text-xs text-green-500">주문 완료</div>
        </div>
      </div>

      <div className="text-sm text-gray-700 mb-2">
        <p>주문 유형: {orderType}</p>
        <p>총 금액: {totalPrice.toLocaleString()} 원</p>
      </div>
      <div className="mt-4">
        {orderDetails.map((item, index) => (
          <div key={index} className="flex justify-between text-sm py-1 border-b last:border-0">
            <span>{item.menuName} x {item.menuCount}</span>
            <span>{(item.menuPrice * item.menuCount).toLocaleString()} 원</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ShoppingCartIcon: React.FC = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default OrderSummaryCard