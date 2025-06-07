import { useState } from "react"
import OrderModal from "./OrderModal"


interface TimeSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (time: string) => void
}

export function TimeSelectionModal({ isOpen, onClose, onAccept }: TimeSelectionModalProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const timeOptions = ["10분", "20분", "30분", "40분", "50분", "60분"];

  const handleAccept = () => {
    if (selectedTime !== null) {
      onAccept(selectedTime)
      onClose()
    }
  };

  return (
    <OrderModal isOpen={isOpen} onClose={onClose}>
      <div className="p-2">
        <h3 className="text-center text-base font-medium mb-4">주문 처리까지 필요한 시간을 선택해주세요.</h3>
        <div className="space-y-2">
          {timeOptions.map((time) => (
            <div
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-md cursor-pointer ${selectedTime === time ? "bg-blue-50 border border-blue-500" : "hover:bg-gray-50"
                }`}
            >
              {time}
            </div>
          ))}
        </div>
        <button
          onClick={handleAccept}
          disabled={selectedTime === null}
          className={`w-full mt-6 py-3 rounded-md text-white font-medium ${selectedTime === null ? "bg-blue-300" : "bg-[#4B5EED]"
            }`}
        >
          수락
        </button>
      </div>
    </OrderModal>
  )
}
