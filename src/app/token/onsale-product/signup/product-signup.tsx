import { useState, useEffect, useRef } from "react";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import Header from "@/components/common/Header";
import { getTagColor } from "@/utils/tagUtils";
import BankProductInfo from "@/components/token/onsale-product/TokenProductInfo";
import Button from "@/components/common/Button";
import ProductSignUpAgreementSection from "@/components/token/signup/ProductSignUpAgreementSection";
import ProductProtectionInfo from "@/components/token/signup/ProductProtectionInfo";
import { ProductLogo } from "@/components/common/ProductLogo";
import Input from "@/components/common/Input";
import { subscribeProduct, SubscribeProductRequest } from "@/api/subscribe";
import { addOccupation, checkActorIncome, checkEligibility, fetchMyUserInfo } from "@/api/user";
import { fetchMyStoreAllDetails } from "@/api/store";
import { isSellerToken } from "@/utils/authUtils";
import { FreeDepositCountPreferentialRate } from "@/types/FreeDepositCountPreferentialRate ";

// PDF.js 워커 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function TokenProductSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ productId: string }>();
  const productId = Number(params.productId);

  const [username, setUsername] = useState("");
  const token = sessionStorage.getItem("accessToken");
  const isSeller = isSellerToken(token);

  // PDF 페이지 수, 현재 페이지
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // pdf 컨테이너 ref, pdf 컨테이너 너비
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(0);

  const [subscribePurpose, setSubscribePurpose] = useState("");

  const [occupation, setOccupation] = useState("");
  const [isLoadingIncome, setIsLoadingIncome] = useState(false);
  const [isOccupationRegistered, setIsOccupationRegistered] = useState(false);
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);
  const [totalAsset, setTotalAsset] = useState<number | null>(null);
  const [isIncomeVisible, setIsIncomeVisible] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

  const [initialDepositAmount, setInitialDepositAmount] = useState("");
  const [selectedFreeDepositRate, setSelectedFreeDepositRate] = useState<FreeDepositCountPreferentialRate>("NONE");
  const [voucherQuantity, setVoucherQuantity] = useState("1");


  const signupState = location.state?.signupState || location.state || {};
  const {
    productName,
    bankName,
    tags,
    productType,
    imageUrl,
    guideFile,
    interestRange,
    step: stepFromState,
  } = signupState;

  // ─────────────────────────────────────────────
  // 가드: productId가 없으면 상세 페이지로 리다이렉트
  if (!signupState.productId) {
    alert('잘못된 접근입니다. 상세페이지로 이동합니다.')
    return <Navigate to={`/token/onsale/products/${productId || ""}`} replace />;
  }
  // ─────────────────────────────────────────────


  // step 상태 관리
  const [step, setStep] = useState(() => stepFromState || 1);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (isSeller) {
          const storeData = await fetchMyStoreAllDetails();
          setUsername(storeData.storeName);
        } else {
          const userData = await fetchMyUserInfo();
          setUsername(userData.name);
        }
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
      }
    };

    fetchUserData();
  }, [isSeller]);


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
            productType,
            imageUrl,
            guideFile,
            interestRange,
          },
        },
      });
      return;
    }
    if (step < 5) {
      setStep(step + 1);
    }
  };

  // 소득 조회
  const handleVerifyIncome = async () => {
    try {
      setIsLoadingIncome(true); // 로딩 상태 활성화
      const res = await checkActorIncome(); // 소득 조회 API 호출
      setAnnualIncome(res.annualIncome); // 연소득 설정
      setTotalAsset(res.totalAsset); // 총자산 설정
      setIsIncomeVisible(true); // 소득 데이터 표시 활성화
    } catch (error: any) {
      console.error("소득 조회 오류:", error.message);
      alert(error.message);
    } finally {
      setIsLoadingIncome(false); // 로딩 상태 비활성화
    }
  };

  // 4단계 자격 확인 처리
  const handleCheckEligibility = async () => {
    if (!productId) {
      alert("상품 정보가 없습니다.");
      return;
    }
    try {
      setIsCheckingEligibility(true);
      const eligible = await checkEligibility(productId);
      if (eligible) {
        alert("상품 가입 자격이 확인되었습니다.");
        setStep(5);
      } else {
        alert("상품 가입 자격이 없습니다.");
      }
    } catch (error: any) {
      console.error("자격 확인 오류:", error.message);
      alert(error.message);
    } finally {
      setIsCheckingEligibility(false);
    }
  };
  const handleSubscribe = async () => {
    try {
      // 상품 유형에 따라 request 객체에 필드 채우기
      const req: SubscribeProductRequest = { productId, purpose: subscribePurpose };

      if (productType === "VOUCHER") {
        req.voucherQuantity = voucherQuantity ? parseInt(voucherQuantity, 10) : 0;
      } else {
        // INSTALLMENT or SAVING
        req.initialDepositAmount = initialDepositAmount ? parseFloat(initialDepositAmount) : 0;
        req.selectedFreeDepositRate = selectedFreeDepositRate;
      }

      console.log("subscribe request:", req);

      // 구독 API 호출
      const response = await subscribeProduct(req);

      alert("상품 가입이 완료되었습니다!");
      navigate(`/token/onsale/products/${productId}/signup-complete`, {
        state: { subscribeResponse: response },
      });
    } catch (error: any) {
      console.error("상품 가입 실패:", error);
      alert(error.message || "상품 가입 중 오류가 발생했습니다.");
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
                <h2 className="text-base font-bold text-gray-800">가입 전 꼭 알아야 할 내용도 확인해주세요.</h2>
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
                    className="px-3 py-1 bg-gray-200 text-base font-medium rounded-md"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mt-6 mb-4">
                <h2 className="text-xl font-bold">상품 가입 자격 확인이 필요해요.</h2>
                <h2 className="text-xl font-bold">{username}님의 직업과 소득을 조회할게요.</h2>
              </div>

              {/* 직업 입력 */}
              <div className="mb-3">
                <label className="block text-gray-500 text-sm mb-1">직업 등록</label>
                <div className="flex items-center space-x-2">
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                  >
                    <option value="">직업 선택</option>
                    <option value="직장인">직장인</option>
                    <option value="자영업자">자영업자</option>
                    <option value="공무원">공무원</option>
                    <option value="군인">군인</option>
                    <option value="학생">학생</option>
                    <option value="주부">주부</option>
                    <option value="무직">무직</option>
                  </select>
                  {!isOccupationRegistered && (
                    <button
                      onClick={async () => {
                        if (!occupation.trim()) {
                          alert("직업을 입력해주세요.");
                          return;
                        }
                        try {
                          const message = await addOccupation(occupation.trim());
                          alert(message);
                          setIsOccupationRegistered(true);
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }}
                      className="px-4 py-2 bg-[#4B5EED] text-sm font-medium text-white rounded-lg"
                    >
                      등록
                    </button>
                  )}
                </div>
              </div>

              {/* 소득 조회 버튼 + 로딩 스피너 (직업 등록 후 나타나도록 처리) */}
              {isOccupationRegistered && !isIncomeVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center mb-4"
                >
                  {isLoadingIncome ? (
                    // LoadingPage에 쓰인 스피너 가져오기
                    <div className="flex flex-col items-center">
                      <div className="relative w-20 h-20 mb-2">
                        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#4B5EED] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-gray-800 text-sm">소득 조회 중...</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleVerifyIncome}
                      className="w-full py-2 bg-[#4B5EED] text-sm font-medium  text-white rounded-lg flex justify-center items-center"
                    >
                      내 소득 조회하기
                    </button>
                  )}
                </motion.div>
              )}

              {/* 소득 데이터 표출 */}
              {isIncomeVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-5">
                    <label className="block text-gray-500 text-sm mb-1">소득 데이터</label>
                    {/* 연소득 */}
                    <div className="flex items-center mb-2">
                      <label className="w-24 text-gray-700 text-sm font-medium">연소득</label>
                      <input
                        type="text"
                        placeholder="연소득"
                        readOnly
                        value={annualIncome !== null ? annualIncome.toLocaleString() + " 원" : ""}
                        className="flex-1 p-2 border border-gray-300 rounded"
                      />
                    </div>
                    {/* 총자산 */}
                    <div className="flex items-center">
                      <label className="w-24 text-gray-700 text-sm font-medium">총자산</label>
                      <input
                        type="text"
                        placeholder="총자산"
                        readOnly
                        value={totalAsset !== null ? totalAsset.toLocaleString() + " 원" : ""}
                        className="flex-1 p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}


          {step === 5 && (

            <div>
              <div className="mt-6 mb-4">
                <h2 className="text-xl font-bold">가입 전 필수 정보를 입력해주세요.</h2>
              </div>

              <div className="space-y-6 px-1">
                {/* 상품권 수량 (고정) */}
                {/* 가입목적 */}
                <Input
                  label="가입목적"
                  value={subscribePurpose}
                  onChange={(e) => setSubscribePurpose(e.target.value)}
                  placeholder="가입목적을 작성해주세요"
                />

                {/* 상품권 수량 (VOUCHER일 때만 표시) */}
                {productType === "VOUCHER" && (
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">상품권 수량</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={voucherQuantity}
                      onChange={(e) => setVoucherQuantity(e.target.value)}
                      placeholder="상품권 수량을 입력해주세요"
                    />
                  </div>
                )}

                {/* 최초 납입액 (SAVING일 때만 표시) */}
                {productType === "SAVING" && (
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">최초 납입액</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={initialDepositAmount}
                      onChange={(e) => setInitialDepositAmount(e.target.value)}
                      placeholder="최초 납입액을 입력해주세요"
                    />
                  </div>
                )}
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
              ? "bg-[#4B5EED] text-white"
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
            className="text-base font-medium"
            disabled={numPages > 0 && pageNumber < numPages}
          />
        )}

        {/* 3단계: 상품설명서 최종 확인 */}
        {step === 3 && (
          <Button text="확인했습니다" onClick={handleNextStep} fullWidth className="text-sm font-medium" />
        )}

        {/* 4단계: 직업 및 소득 조회 */}
        {step === 4 && (
          <Button
            text="자격 확인하기"
            onClick={handleCheckEligibility}
            fullWidth
            className="text-base font-medium"
            disabled={isCheckingEligibility}
          />
        )}


        {/* 4단계: 가입 폼 작성 */}
        {step === 5 && (
          <Button text="제출하기" onClick={handleSubscribe} fullWidth className="text-base font-medium" />
        )}

      </div>
    </div>
  );
}