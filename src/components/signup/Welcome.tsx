"use client"

import Button from "../common/Button"

interface WelcomeProps {
  onLogin: () => void
  onSignup: () => void
  onStoreSignup: () => void
  buttonClassName?: string
}

export default function Welcome({ onLogin, onSignup, onStoreSignup, buttonClassName = "" }: WelcomeProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-10 mt-20">
        <h1 className="text-2xl font-bold text-[#0a5ca8] mb-2">Crepe는</h1>
        <p className="text-lg">블록체인 코인 결제를 지원합니다.</p>
      </div>
      <div className="w-full mt-20">
        <div className="text-center">
          <span>이미 가입하셨나요? </span>
          <button className="text-[#0a5ca8] font-medium" onClick={onLogin}>
            로그인 하기
          </button>
        </div>
        <div className="px-5">
          <Button
            text="지금 시작하기"
            onClick={onSignup}
            className={`w-full rounded-[9px] font-medium bg-[#0C2B5F] text-white ${buttonClassName}`}
          />
        </div>
        <div className="text-center">
          <span>사장님이신가요? </span>
          <button className="text-[#0a5ca8] font-medium" onClick={onStoreSignup}>
            가맹점 회원가입하기
          </button>
        </div>
      </div>
    </div>
  )
}
