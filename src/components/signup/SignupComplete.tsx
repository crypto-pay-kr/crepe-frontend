"use client"

import Button from "../common/Button"

interface SignupCompleteProps {
  onNext: () => void
}

export default function SignupComplete({ onNext }: SignupCompleteProps) {
  return (
    <div className="h-full flex flex-col">
        <div className="text-center mb-10 mt-20">
          <h1 className="text-2xl font-bold text-[#0a5ca8] mb-2">Crepe에</h1>
          <p className="text-xl">오신 것을 환영합니다.</p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-32 h-40">
            <img src="/crepe-logo.png" alt="Crepe Logo" className="w-full h-full" />
          </div>
        </div>
      <div className="p-5">
        <Button text="다음" onClick={onNext} />
      </div>
    </div>
  )
}
