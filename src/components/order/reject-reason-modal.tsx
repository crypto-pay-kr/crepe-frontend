import { useState } from "react"
import OrderModal from "./OrderModal"


interface RejectionReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onReject: (reason: string) => void
}

const reasonMap: Record<string, string> = {
  "매장에 자리가 없어요": "자리없음",
  "매장 주문이 너무 많아요": "주문많음",
  "매장에 재고가 없어요": "재고없음",
}

export function RejectionReasonModal({ isOpen, onClose, onReject }: RejectionReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const reasonOptions = ["매장에 자리가 없어요", "매장 주문이 너무 많아요", "매장에 재고가 없어요"]

  const handleReject = () => {
    if (selectedReason !== null) {
      const backendReason = reasonMap[selectedReason]
      onReject(backendReason)
      onClose()
    }
  }

  return (
    <OrderModal isOpen={isOpen} onClose={onClose}>
      <div className="p-2">
        <h3 className="text-center text-base font-medium mb-4">거절 사유를 선택해주세요.</h3>
        <div className="space-y-2">
          {reasonOptions.map((reason) => (
            <div
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`p-3 rounded-md cursor-pointer ${
                selectedReason === reason ? "bg-red-50 border border-red-500" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border ${
                    selectedReason === reason ? "border-red-500 bg-red-500" : "border-gray-300"
                  } mr-3 flex items-center justify-center`}
                >
                  {selectedReason === reason && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <span>{reason}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleReject}
          disabled={selectedReason === null}
          className={`w-full mt-6 py-3 rounded-md text-white font-medium ${
            selectedReason === null ? "bg-red-300" : "bg-red-500"
          }`}
        >
          거절
        </button>
      </div>
    </OrderModal>
  )
}
