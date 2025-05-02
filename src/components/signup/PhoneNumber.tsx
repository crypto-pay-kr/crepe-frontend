import { useState, useEffect } from "react"
import Header from "../common/Header"
import Button from "../common/Button"

interface PhoneNumberProps {
  onNext: () => void,
  isStore?: boolean
}

export default function PhoneNumber({ onNext, isStore }: PhoneNumberProps) {
  const [phoneNumber, setPhoneNumber] = useState("01012345678")
  const [formattedNumber, setFormattedNumber] = useState("")
  const isButtonDisabled = !phoneNumber || phoneNumber.length < 10

  // 전화번호 포맷팅 함수 (010-1234-5678 형식)
  useEffect(() => {
    if (phoneNumber) {
      let formatted = phoneNumber.replace(/[^0-9]/g, '')
      
      if (formatted.length > 3 && formatted.length <= 7) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`
      } else if (formatted.length > 7) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 7)}-${formatted.slice(7, 11)}`
      }
      
      setFormattedNumber(formatted)
    } else {
      setFormattedNumber("")
    }
  }, [phoneNumber])

  // 전화번호 입력 처리
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9-]/g, '')
    setPhoneNumber(value.replace(/-/g, ''))
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={2} isStore={isStore}/>
      <div className="flex-1 flex flex-col p-5">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">휴대폰 번호를</h2>
          <p className="text-2xl font-bold mb-8">입력해주세요</p>
        </div>
        <div className="flex-1 px-4">
          <div className="border-b border-gray-300 py-2">
            <div className="text-sm text-gray-500 mb-1">Phone Number</div>
            <input
              type="tel"
              value={formattedNumber}
              onChange={handlePhoneNumberChange}
              placeholder="010-0000-0000"
              className="w-full focus:outline-none text-gray-800 text-lg"
            />
          </div>
        </div>
      </div>
      <div className="p-5">
        <Button 
          text="다음" 
          onClick={onNext} 
          color={isButtonDisabled ? "gray" : "primary"}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  )
}