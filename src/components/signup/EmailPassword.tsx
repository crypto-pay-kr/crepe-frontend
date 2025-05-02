import React, { useState } from "react"
import Header from "../common/Header"
import Button from "../common/Button"
import Input from "../common/Input"

interface EmailPasswordProps {
  onNext: () => void
  isStore?: boolean
}

export default function EmailPassword({ onNext, isStore }: EmailPasswordProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  
  const isButtonDisabled = !email || !password
  
  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={1} isStore={isStore} />
      
      <main className="flex-1 overflow-auto px-6 pt-6 pb-24 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">회원가입을 위한</h2>
          <p className="text-2xl font-bold mb-8">정보를 입력해주세요</p>
        </div>
          
        <div className="flex-1">
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={setEmail} 
            placeholder="이메일을 입력해주세요"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="비밀번호를 입력해주세요"
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        </div>
        
        {/* 자동으로 늘어나는 여백 추가 */}
        <div className="flex-grow"></div>
      </main>

      <div className="p-5 bg-white">
        <Button 
          text="다음" 
          onClick={onNext} 
          className={`w-full py-3.5 rounded-lg font-medium text-white ${
            isButtonDisabled 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  )
}