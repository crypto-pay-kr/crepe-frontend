import { PaymentOption } from "@/constants/paymentOption";

interface PaymentInfoProps {
  option: PaymentOption;
}

export default function PaymentInfo({ option }: PaymentInfoProps) {
  return (
    <div>
      <div className="font-medium">{option.label}</div>
      <div className="flex items-center">
        <span className="text-lg font-bold">{option.amount}</span>
        {option.insufficientBalance && (
          <span className="ml-2 text-sm text-red-500">잔액 부족</span>
        )}
      </div>
    </div>
  );
}