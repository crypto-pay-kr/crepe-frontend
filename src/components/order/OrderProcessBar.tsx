import React from "react"

interface OrderProgressBarProps {
  currentStep: number
}

const OrderProgressBar: React.FC<OrderProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { label: "주문요청", number: 1 },
    { label: "주문확인", number: 2 },
    { label: "준비완료", number: 3 }
  ]

  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex-1 flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full ${
                step.number <= currentStep 
                  ? "bg-[#4B5EED] text-white" 
                  : "bg-gray-300 text-gray-500"
              } flex items-center justify-center mb-2`}
            >
              {currentStep >= step.number ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <div 
              className={`text-xs ${
                step.number <= currentStep ? "text-[#4B5EED] font-medium" : "text-gray-500"
              }`}
            >
              {step.label}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="w-16 h-1 bg-gray-300"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default OrderProgressBar