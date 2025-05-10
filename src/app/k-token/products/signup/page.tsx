import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Document, Page, pdfjs } from "react-pdf"
import Header from "@/components/common/Header"
import { BankLogo } from "@/components/common/BankLogo"
import { ProductTag } from "@/components/k-token/product/ProductTag"
import Button from "@/components/common/Button"
import BankProductInfo from "@/components/k-token/product/BankProductInfo";
import {
  bankProductData,
  productTags,
} from "@/mocks/token";
import ProductSignUpAgreementSection from "@/components/k-token/signup/ProductSignUpAgreementSection"
import ProductProtectionInfo from "@/components/k-token/product/ProductProtectionInfo"

// PDF.js 워커 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


export default function KTokenProductSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  // PDF 컨테이너 ref & width state
  const pdfWrapperRef = useRef<HTMLDivElement>(null)
  const [pageWidth, setPageWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => {
      if (pdfWrapperRef.current) {
        setPageWidth(pdfWrapperRef.current.clientWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // PDF 문서 로드 성공 시 호출
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1) // 첫 페이지로 초기화
  }

  // 페이지 변경 함수
  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset
      return Math.min(Math.max(1, newPageNumber), numPages)
    })
  }

  // 이전 페이지로 이동
  const previousPage = () => changePage(-1)

  // 다음 페이지로 이동
  const nextPage = () => changePage(1)


  // 동의 항목 상태 (전체동의 포함)
  const [consents, setConsents] = useState({
    all: false,
    privacy: false, // [필수] 개인정보 수집/이용 동의
    identification: false, // [필수] 고유식별정보 처리 동의
    telecom: false, // [필수] 통신사 이용약관 동의
    service: false, // [필수] 서비스 이용약관 동의
    thirdParty: false, // [필수] 개인정보 제 3자 제공 동의
  })

  // 예금자 보호 안내 '네' 버튼 클릭 여부 상태
  const [protectionConfirmed, setProtectionConfirmed] = useState(false)

  const allRequiredAgreed =
    consents.privacy &&
    consents.identification &&
    consents.telecom &&
    consents.service &&
    consents.thirdParty

  const handleNextStep = () => {
    if (step === 1 && (!allRequiredAgreed || !protectionConfirmed)) return
    if (step < 3) {
      setStep(step + 1)
    } else {
      navigate("/k-token/products/signup-complete")
    }
  }

  const toggleAll = () => {
    const newValue = !consents.all
    setConsents({
      all: newValue,
      privacy: newValue,
      identification: newValue,
      telecom: newValue,
      service: newValue,
      thirdParty: newValue,
    })
  }

  const toggleConsent = (key: keyof typeof consents) => {
    const newValue = !consents[key]
    const updated = { ...consents, [key]: newValue }
    const newAll =
      updated.privacy &&
      updated.identification &&
      updated.telecom &&
      updated.service &&
      updated.thirdParty
    setConsents({ ...updated, all: newAll })
  };

  const tagColorMapping = {
    "29세이하": "gray",
    "월 최대 50만 토큰": "purple",
    "세제혜택": "green",
  };

  // PDF 파일 경로 
  const pdfFile = "/product-info.pdf";

  return (
    <div className="flex flex-col h-full">
      <Header title="상품 가입" />

      <div className="flex-1 overflow-auto">
        {/* 상단 정보 영역 */}
        <div className="p-4">
          <BankLogo bank="woori" />
          <BankProductInfo {...bankProductData} />
          <div className="flex gap-2 mt-2 mb-4">
            {productTags.map((tag, index) => (
              <ProductTag
                key={index}
                text={tag}
                color={(tagColorMapping[tag as keyof typeof tagColorMapping] || "gray") as "gray" | "purple" | "green"}
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <div className="mt-6 mb-4">
                <h2 className="text-xl font-bold">가입 전 꼭 알아야 할 내용도 확인해주세요.</h2>
              </div>

              {/* 동의 항목들 */}
              <ProductSignUpAgreementSection
                consents={consents}
                toggleAll={toggleAll}
                toggleConsent={toggleConsent}
              />

              {/* 예금자 보호 안내 */}
              <ProductProtectionInfo
                protectionConfirmed={protectionConfirmed}
                onConfirm={() => setProtectionConfirmed(true)}
                onDeny={() => setProtectionConfirmed(false)}
              />
            </div>
          )}

          {(step === 2 || step === 3) && (
            <div>
              <h2 className="text-xl font-bold mt-6 mb-4">상품설명서</h2>

              {/* PDF 확대/축소 및 페이지 조작 버튼 */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={previousPage}
                    className="px-3 py-1 bg-gray-200 rounded-md"
                    disabled={pageNumber <= 1}
                  >
                    이전
                  </button>
                  <span>{pageNumber} / {numPages}</span>
                  <button
                    onClick={nextPage}
                    className="px-3 py-1 bg-gray-200 rounded-md"
                    disabled={pageNumber >= numPages}
                  >
                    다음
                  </button>
                </div>
              </div>

              {/* PDF 뷰어 */}
              <div ref={pdfWrapperRef} className="border rounded-md bg-gray-100 p-4">
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-500">PDF 불러오는 중...</p>
                    </div>
                  }
                  error={
                    <div className="flex justify-center items-center h-64">
                      <p className="text-red-500">PDF 로드에 실패했습니다.</p>
                    </div>
                  }
                  noData={
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-500">PDF 파일이 없습니다.</p>
                    </div>
                  }
                >
                  {/* 한 페이지만 보여주는 방식으로 변경 */}
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth}    
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </Document>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {step === 1 && (
          <button
            onClick={handleNextStep}
            disabled={!allRequiredAgreed || !protectionConfirmed}
            className={`w-full py-3 rounded-md ${allRequiredAgreed && protectionConfirmed ? "bg-[#0a2d6b] text-white" : "bg-gray-200 text-gray-400"
              }`}
          >
            다음
          </button>
        )}
        {step === 2 && (
          <Button text="다음" onClick={handleNextStep} fullWidth />
        )}
        {step === 3 && (
          <Button text="확인했습니다" onClick={handleNextStep} fullWidth />
        )}
      </div>
    </div>
  )
}