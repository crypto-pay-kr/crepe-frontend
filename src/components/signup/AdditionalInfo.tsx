"use client"

import { useState } from "react"
import Header from "../common/Header"
import Button from "../common/Button"

interface AdditionalInfoProps {
  onNext: () => void
  buttonColor: "blue" | "gray"
  onToggleColor: () => void
}

export default function AdditionalInfo({ onNext, buttonColor, onToggleColor }: AdditionalInfoProps) {
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")

  return (
    <div className="h-full flex flex-col">
      <Header title="회원가입" progress={3} />
      <div className="flex-1 flex flex-col p-5">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">추가 정보 입력</h2>
          <p className="text-sm text-gray-500">시작하기 위한 정보를 입력해주세요</p>
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">이름</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-gray-300 py-2 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">닉네임</div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border-b border-gray-300 py-2 focus:outline-none"
            />
          </div>

          <div className="flex justify-center items-center mt-8 mb-4">
            <img
              src="/lock.png"
              alt="Lock Icon"
              className="w-6 h-6 text-gray-400"
            />
          </div>
          <p className="text-center text-sm text-gray-500">모든 개인정보는 암호화되어 저장됩니다.</p>
        </div>
      </div>
      <div className="p-5">
        <Button
          text={buttonColor === "blue" ? "제출 하기" : "계속 하기"}
          onClick={() => {
            onToggleColor()
            if (buttonColor === "blue") {
              onNext()
            }
          }}
          color={buttonColor}
        />
      </div>
    </div>
  )
}
