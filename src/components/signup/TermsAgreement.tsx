import { useState } from 'react'
import Header from '../common/Header'
import Button from '../common/Button'
import CheckCircle from '../common/CheckCircle'
import ChevronRight from '../common/ChevronRight'

interface TermsAgreementProps {
  onNext: () => void
  isStore?: boolean
}

export default function TermsAgreement({
  onNext,
  isStore,
}: TermsAgreementProps) {
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

  const handleToggleItem = (key: 'terms' | 'privacy') => {
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    }

    // Update "all" checkbox based on individual items
    newAgreements.all = newAgreements.terms && newAgreements.privacy

    setAgreements(newAgreements)
  }

  const isButtonActive = agreements.terms && agreements.privacy

  return (
    <div className="flex h-full flex-col bg-white">
      <Header title="시작하기" isStore={isStore} />

      <main className="flex flex-1 flex-col overflow-auto px-5 pb-24">
        <div className="mb-8 flex flex-1 flex-col items-center justify-center">
          <div className=" text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              서비스 이용을 위해
            </h2>
            <p className="text-2xl font-bold text-gray-800">
              이용약관 동의가 필요합니다
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-gray-50 p-5 shadow-sm">
          {/* All agreements checkbox */}
          <div
            className="flex cursor-pointer items-center rounded-lg px-3 py-4 transition-colors hover:bg-gray-100"
            onClick={handleToggleAll}
          >
            <CheckCircle checked={agreements.all} />
            <span className="ml-3 text-base font-medium text-gray-800">
              모든 약관에 동의합니다.
            </span>
          </div>

          <div className="mx-1 my-2 h-px bg-gray-200"></div>

          {/* Terms of Service */}
          <div
            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-4 transition-colors hover:bg-gray-100"
            onClick={() => handleToggleItem('terms')}
          >
            <div className="flex items-center">
              <CheckCircle checked={agreements.terms} />
              <span className="ml-3 text-base text-gray-800">
                이용약관{' '}
                <span className="font-medium text-gray-500">(필수)</span>
              </span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>

          {/* Privacy Policy */}
          <div
            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-4 transition-colors hover:bg-gray-100"
            onClick={() => handleToggleItem('privacy')}
          >
            <div className="flex items-center">
              <CheckCircle checked={agreements.privacy} />
              <span className="ml-3 text-base text-gray-800">
                개인정보 처리방침{' '}
                <span className="font-medium text-gray-500">(필수)</span>
              </span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
      </main>

      <div className="bg-white p-12 mt-10">
        <Button
          text="다음"
          onClick={onNext}
          className={`w-full rounded-lg py-3.5 font-medium text-white ${
            isButtonActive
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300'
          }`}
          disabled={!isButtonActive}
        />
      </div>
    </div>
  )
}
