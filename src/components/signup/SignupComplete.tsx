"use client"

import Button from "../common/Button"

interface SignupCompleteProps {
  onNext: () => void
}

export default function SignupComplete({ onNext }: SignupCompleteProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-0.5">
          {/* 로고 + '에' 한 줄로 정렬 */}
          <div className="flex items-center gap-0 ">
            <img
              src="/crepe-newlogosmall.png"
              alt="Crepe Logo"
              className="w-[120px] h-[100px] object-contain"
            />
            <span className="text-xl font-bold text-slate-700 leading-none pb-[1px]">에</span>
          </div>

          {/* 아래 텍스트 */}
          <p className="text-xl font-bold text-slate-700 leading-none leading-tight">    오신 것을 환영합니다.</p>
        </div>
      </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-45 h-40">
            <img src="/crepe-newlogo.png" alt="Crepe Logo" className="w-full h-full" />
          </div>
        </div>
      <div className="p-5">
        <Button text="다음" onClick={onNext} />
      </div>
    </div>
  )
}
