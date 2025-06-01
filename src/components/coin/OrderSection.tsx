import { OrderItem } from "./OrderItem";
import { Order } from "@/types/order";

interface OrderSectionProps {
  orders: Order[];
}

export function OrderSection({ orders }: OrderSectionProps) {
  return (
    <div className="mx-6 mt-8 pb-6">
      <h2 className="mb-6 text-2xl font-bold">Crepe 주문 현황</h2>
      
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
}
