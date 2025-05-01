import { useState } from "react"
import Header from "../common/Header"
import Button from "../common/Button"

interface PhoneVerificationProps {
  onNext: () => void
  buttonColor: "blue" | "gray"
  onToggleColor: () => void
  isStore?: boolean
}

export default function PhoneVerification({ 
  onNext, 
  buttonColor, 
  onToggleColor,
  isStore,
}: PhoneVerificationProps) {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)


      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  const isButtonDisabled = verificationCode.some((digit) => !digit)

  return (
    <div className="h-full flex flex-col ">
      <Header title="회원가입" progress={3} isStore={isStore}/>
      <div className="flex-1 flex flex-col p-5">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">휴대폰 번호 인증</h2>
          <p className="text-sm text-gray-500">
            휴대폰에 전송된
            <br />
            6자리 숫자를 입력해주세요 <button className="text-[#0a5ca8]">번호 변경</button>
          </p>
        </div>

        <div className="flex-1">
          <div className="flex mb-6 justify-between gap-2">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                className="input-box"
              />
            ))}
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500">코드가 전송되지 않았나요? </span>
            <button className="text-[#0a5ca8] font-medium">코드 재전송</button>
          </div>
        </div>
      </div>
      <div className="p-5">
        <Button
          text={buttonColor === "blue" ? "다음" : "인증하기"}
          onClick={() => {
            onToggleColor()
            if (buttonColor === "blue") {
              onNext()
            }
          }}
          color={isButtonDisabled ? "gray" : buttonColor}
        />
      </div>
    </div>
  )
}