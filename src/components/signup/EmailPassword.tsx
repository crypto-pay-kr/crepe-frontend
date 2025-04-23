"use client"

import { useState } from "react"
import Header from "../common/Header"
import Button from "../common/Button"
import Input from "../common/Input"

interface EmailPasswordProps {
  onNext: () => void
}

export default function EmailPassword({ onNext }: EmailPasswordProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const isButtonDisabled = !email || !password

  return (
    <div className="h-full flex flex-col">
      <Header title="회원가입" progress={0} />
      <div className="flex-1 flex flex-col p-5">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">회원가입을 위한</h2>
          <p className="text-2xl font-bold mb-8">정보를 입력해주세요</p>
        </div>

        <div className="flex-1">
          <Input label="Email Address" type="email" value={email} onChange={setEmail} placeholder="" />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder=""
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        </div>
      </div>
      <div className="p-5">
        <Button text="다음" onClick={onNext} color={isButtonDisabled ? "gray" : "blue"} />
      </div>
    </div>
  )
}
