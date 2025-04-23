"use client"

import { useState } from "react"
import Header from "../common/Header"
import Button from "../common/Button"

interface PhoneNumberProps {
  onNext: () => void
}

export default function PhoneNumber({ onNext }: PhoneNumberProps) {
  const [phoneNumber, setPhoneNumber] = useState("08085472417")
  const isButtonDisabled = !phoneNumber

  return (
    <div className="h-full flex flex-col">
      <Header title="회원가입" progress={1} />
      <div className="flex-1 flex flex-col p-5">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">휴대폰 번호를</h2>
          <p className="text-2xl font-bold mb-8">입력해주세요</p>
        </div>

        <div className="flex-1">
          <div className="flex border-b border-gray-300 py-2">
            <div className="w-24">
              <div className="text-sm text-gray-500 mb-1">Country</div>
              <div className="flex items-center">
                <div className="w-6 h-4 bg-green-600 mr-2 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
                <span>+234</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">Phone Number</div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-5">
        <Button text="다음" onClick={onNext} color={isButtonDisabled ? "gray" : "blue"} />
      </div>
    </div>
  )
}
