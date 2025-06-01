import React from "react";

interface OrderStatusMessageProps {
  orderStatus: string;
}

const OrderStatusMessage: React.FC<OrderStatusMessageProps> = ({ orderStatus }) => {
  let title = "";
  let subtitle = "";
  let bgColor = "";
  let icon: React.ReactNode = null;

  switch (orderStatus) {
    case "PAID":
      title = "주문이 확인되었습니다";
      subtitle = "결제가 완료되었습니다.";
      bgColor = "bg-blue-100";
      icon = (
        <svg className="w-12 h-12 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
    case "COMPLETED":
      title = "준비완료";
      subtitle = "주문하신 상품이 준비되었습니다.";
      bgColor = "bg-green-100";
      icon = (
        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
    case "CANCELLED":
      title = "주문이 취소되었습니다";
      subtitle = "취소된 주문입니다.";
      bgColor = "bg-red-100";
      icon = (
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
    default:
      title = "주문이 접수되었습니다";
      subtitle = "곧 매장에서 주문을 확인할 예정입니다.";
      bgColor = "bg-indigo-100";
      icon = (
        <svg className="w-12 h-12 text-[#4B5EED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
  }

  return (
    <div className="text-center mb-8">
      <div className={`inline-block rounded-full ${bgColor} p-4 mb-4 shadow-md`}>
        {icon}
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

export default OrderStatusMessage;