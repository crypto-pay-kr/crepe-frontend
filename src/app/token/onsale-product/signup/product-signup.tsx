import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import Header from "@/components/common/Header";
import { getTagColor } from "@/utils/tagUtils";
import BankProductInfo from "@/components/token/onsale-product/TokenProductInfo";
import Button from "@/components/common/Button";
import ProductSignUpAgreementSection from "@/components/token/signup/ProductSignUpAgreementSection";
import ProductProtectionInfo from "@/components/token/signup/ProductProtectionInfo";
import { ProductLogo } from "@/components/common/ProductLogo";
import Input from "@/components/common/Input";
import { subscribeProduct } from "@/api/subscribe"; 

// PDF.js 워커 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function TokenProductSignup() {
  const navigate = useNavigate();
  const location = useLocation();

  // 상품 정보 및 step을 state에서 추출
  const {
    productId,
    productName,
    bankName,
    tags,
    imageUrl,
    guideFile,
    interestRange,
    step: stepFromState,
  } = location.state || {};

  // step 상태 관리
  const [step, setStep] = useState(() => stepFromState || 1);

  // PDF 페이지 수, 현재 페이지
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // pdf 컨테이너 ref, pdf 컨테이너 너비
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(0);

  const [subscribePurpose, setSubscribePurpose] = useState(""); 

  // step이 state로 넘어오면 반영
  useEffect(() => {
    if (location.state?.step) setStep(location.state.step);
  }, [location.state?.step]);

  useEffect(() => {
    // PDF 컨테이너 너비 업데이트
    const updateWidth = () => {
      if (pdfWrapperRef.current) {
        setPageWidth(pdfWrapperRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // PDF 문서 로드 성공
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  // 페이지 이동
  const changePage = (offset: number) => {
    setPageNumber((prev) => {
      const newPageNumber = prev + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };
  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  // 동의 항목 상태
  const [consents, setConsents] = useState({
    all: false,
    privacy: false,
    identification: false,
    telecom: false,
    service: false,
    thirdParty: false,
  });

  // 예금자 보호 안내 '네' 버튼 클릭 여부
  const [protectionConfirmed, setProtectionConfirmed] = useState(false);

  // 필수 동의 체크
  const allRequiredAgreed =
    consents.privacy &&
    consents.identification &&
    consents.telecom &&
    consents.service &&
    consents.thirdParty;

  // 다음 스텝 이동
  const handleNextStep = () => {
    if (step === 1) {
      // 상품 정보와 step을 함께 넘김
      navigate("/id/verification", {
        state: {
          from: location.pathname,
          signupState: {
            productId,
            productName,
            bankName,
            tags,
            imageUrl,
            guideFile,
            interestRange,
          },
        },
      });
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } 
  };

  const handleSubscribe = async () => {
    try {
      // 구독 요청 데이터 생성
      const request = {
        // productId, // 상품 ID
        // initialDepositAmount, // 초기 납입액
        // selectedFreeDepositRate, // 선택한 우대금리
        // voucherQuantity, // 상품권 수량
        subscribePurpose, // 가입 목적
      };

      // 구독 API 호출
      const response = await subscribeProduct(request);

      // 성공 시 가입 완료 화면으로 이동
      alert("상품 가입이 완료되었습니다!");
      navigate("/token/onsale/products/signup-complete", {
        state: { subscribeResponse: response }, // 응답 데이터를 다음 화면으로 전달
      });
    } catch (error) {
      console.error("상품 가입 실패:", error);
      alert("상품 가입 중 오류가 발생했습니다.");
    }
  };


  // 전체 동의 토글
  const toggleAll = () => {
    const newValue = !consents.all;
    setConsents({
      all: newValue,
      privacy: newValue,
      identification: newValue,
      telecom: newValue,
      service: newValue,
      thirdParty: newValue,
    });
  };

  // 개별 동의 항목 토글
  const toggleConsent = (key: keyof typeof consents) => {
    const newValue = !consents[key];
    const updated = { ...consents, [key]: newValue };
    const newAll =
      updated.privacy &&
      updated.identification &&
      updated.telecom &&
      updated.service &&
      updated.thirdParty;
    setConsents({ ...updated, all: newAll });
  };

  // PDF 파일 경로 (guideFile이 없으면 기본값 사용 가능)
  const pdfFile = guideFile || "/product-info.pdf";

  return (
    <div className="flex flex-col h-full">
      <Header title="상품 가입" />

      <div className="flex-1 overflow-auto">
        {/* 상단 상품 정보 영역 */}
        <div className="p-4">
          {/* 은행 로고 */}
          <ProductLogo imageUrl={imageUrl} />

          {/* 상품 정보 */}
          <BankProductInfo
            productTitle={productName || "상품명 미지정"}
            interestRange={interestRange || "연 0%"}
          />

          {/* 태그 목록 */}
          <div className="flex gap-2 mt-2 mb-4">
            {(tags || []).map((tag: string, index: number) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}
              >
                {tag}
              </span>
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

              {/* 페이지 이동 버튼 */}
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

          {step === 4 && (
            <div>
              <div className="mt-6 mb-4">
                <h2 className="text-xl font-bold">가입 전 필수 정보를 입력해주세요.</h2>
              </div>

              <div className="flex-1 space-y-6 px-1">
                <Input
                  label="가입목적"
                  value={subscribePurpose}
                  onChange={(e) => setSubscribePurpose(e.target.value)}
                  placeholder="가입목적을 작성해주세요"
                />
              </div>  
            </div>
          )}

        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="p-4">
        {/* 1단계: 약관 동의 & 예금자 보호 확인 */}
        {step === 1 && (
          <button
            onClick={handleNextStep}
            disabled={!allRequiredAgreed || !protectionConfirmed}
            className={`w-full py-3 rounded-md ${allRequiredAgreed && protectionConfirmed
              ? "bg-[#0a2d6b] text-white"
              : "bg-gray-200 text-gray-400"
              }`}
          >
            다음
          </button>
        )}

        {/* 2단계: 상품설명서 확인 */}
        {step === 2 && (
          <Button
            text="다음"
            onClick={handleNextStep}
            fullWidth
            disabled={numPages > 0 && pageNumber < numPages}
          />
        )}

        {/* 3단계: 상품설명서 최종 확인 */}
        {step === 3 && (
          <Button text="확인했습니다" onClick={handleNextStep} fullWidth />
        )}

        {/* 4단계: 가입 목적 작성 */}
        {step === 4 && (
          <Button text="제출하기" onClick={handleSubscribe} fullWidth />
        )}

      </div>
    </div>
  );
}