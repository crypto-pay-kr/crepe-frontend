"use client"

import { useState } from "react"
import LoginForm from "./LoginForm"
import Button from "../common/Button"


interface LoginHomeProps {
  onLogin: () => void
  onSignup: () => void
  buttonClassName?: string
}

export default function LoginHome({ onSignup, onLogin, buttonClassName  }: LoginHomeProps) {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const isButtonDisabled = !userId || !password

  return (
    <div className="px-5 mt-[129px]"> {/* 좌우 패딩 추가 */}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7c1a66a08012ee38b1897d831a899618cb0db434?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a"
        alt="Logo"
        className="object-contain w-[148px] aspect-[2.51] mx-auto"
      />

      {/* Login Form */}
      <div className="mt-12 w-full">
        <LoginForm onSubmit={() => { }}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-center gap-4  mt-4 mb-4 text-sm text-gray-500">
            <button onClick={onSignup} className="hover:underline">
              회원가입
            </button>
            <button className="hover:underline">아이디 찾기</button>
            <button className="hover:underline">비밀번호 찾기</button>
          </div>
          <Button
            text="로그인하기"
            onClick={onLogin}
            className={`w-full rounded-[9px] font-medium bg-[#0C2B5F] text-white ${buttonClassName}`}
          />

        </LoginForm>
      </div>
    </div>
  )
}