"use client"

import { useState } from "react"
import Header from "../common/Header"
import Button from "../common/Button"
import CheckCircle from "../common/CheckCircle"
import ChevronRight from "../common/ChevronRight"

interface TermsAgreementProps {
  onNext: () => void
}

export default function TermsAgreement({ onNext }: TermsAgreementProps) {
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
  })

  const handleToggleAll = () => {
    const newValue = !agreements.all
    setAgreements({
      all: newValue,
      terms: newValue,
      privacy: newValue,
    })
  }

  const handleToggleItem = (key: "terms" | "privacy") => {
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    }

    // Update "all" checkbox based on individual items
    newAgreements.all = newAgreements.terms && newAgreements.privacy

    setAgreements(newAgreements)
  }

  return (
    <div className="h-full flex flex-col">
      <Header title="시작하기" />
      <div className="flex-1 flex flex-col p-5">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">서비스 이용을 위해</h2>
          <p className="text-2xl font-bold mb-8">이용약관 동의가 필요합니다</p>
        </div>

        <div className="flex-1">
          <div className="flex items-center py-4 cursor-pointer" onClick={handleToggleAll}>
            <CheckCircle checked={agreements.all} />
            <span className="ml-3 text-base">모든 약관에 동의합니다.</span>
          </div>

          <div
            className="flex items-center justify-between py-4 cursor-pointer border-t border-gray-100"
            onClick={() => handleToggleItem("terms")}
          >
            <div className="flex items-center">
              <CheckCircle checked={agreements.terms} />
              <span className="ml-3 text-base">
                이용약관 <span className="text-gray-400">(필수)</span>
              </span>
            </div>
            <ChevronRight />
          </div>

          <div
            className="flex items-center justify-between py-4 cursor-pointer border-t border-gray-100"
            onClick={() => handleToggleItem("privacy")}
          >
            <div className="flex items-center">
              <CheckCircle checked={agreements.privacy} />
              <span className="ml-3 text-base">
                개인정보 처리방침 <span className="text-gray-400">(필수)</span>
              </span>
            </div>
            <ChevronRight />
          </div>
        </div>
      </div>
      <div className="p-5">
        <Button text="다음" onClick={onNext} />
      </div>
    </div>
  )
}
