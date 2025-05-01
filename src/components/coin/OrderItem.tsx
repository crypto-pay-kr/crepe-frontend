import { Check, ShoppingBag, X } from "lucide-react";
import ChevronRight from "../common/ChevronRight";
import { Order } from '@/constants/coinData';

interface OrderItemProps {
  order: Order;
}

export function OrderItem({ order }: OrderItemProps) {
  const { 
    id, 
    status, 
    reason, 
    storeName, 
    orderItems, 
    orderDate, 
    orderNumber, 
    storeLocation 
  } = order;

  const isCompleted = status === 'completed';
  
  return (
    <div className="mb-6 rounded-2xl bg-white shadow-md">
      <div className="flex items-center justify-between border-b p-6">
        <div className="flex items-center">
          <div className="relative mr-4">
            <ShoppingBag className="h-8 w-8" />
            <div className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ${isCompleted ? 'bg-green-500' : 'bg-red-500'}`}>
              {isCompleted ? <Check className="h-4 w-4 text-white" /> : <X className="h-4 w-4 text-white" />}
            </div>
          </div>
          <p className="text-xl font-medium">Order #{id}</p>
        </div>
        <div className="text-base text-gray-500">
          <p>{isCompleted ? '주문 완료' : `주문 거절${reason ? ' - ' + reason : ''}`}</p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      <div className="p-6">
        <p className="mb-3 text-lg font-medium">{storeName}</p>
        <div className="text-base text-gray-500">
          <p>{orderItems}</p>
          <p>주문일시: {orderDate}</p>
          <p>주문번호: {orderNumber}</p>
          <p>주문점포: {storeLocation}</p>
        </div>
      </div>
    </div>
  );
}