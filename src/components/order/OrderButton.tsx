import Button from "../common/Button";

interface OrderButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

function OrderButton({ onClick, disabled = false }: OrderButtonProps) {
  return (
    <div className="flex justify-center mt-auto">
      <div className="w-full px-4">
        <Button
          text="주문하기"
          onClick={onClick}
          color="primary"
          disabled={disabled}
          fullWidth={true}
        />
      </div>
    </div>
  );
}