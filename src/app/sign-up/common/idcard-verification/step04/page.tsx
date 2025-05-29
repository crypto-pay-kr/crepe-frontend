
import CheckCircle from "@/components/common/CheckCircle";
import ChevronRight from "@/components/common/ChevronRight";
import Header from "@/components/common/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/common/Button";
import { sendSMS, verifySMS } from "@/api/user"; 

export default function IDVerificationStep4() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
    });

    const [hasRequestedVerification, setHasRequestedVerification] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const handleToggleAll = () => {
        const newValue = !agreements.all;
        setAgreements({
            all: newValue,
            terms: newValue,
            privacy: newValue,
        });
    };
    const handleToggleItem = (key: "terms" | "privacy") => {
        const newAgreements = {
            ...agreements,
            [key]: !agreements[key],
        };
        newAgreements.all = newAgreements.terms && newAgreements.privacy;
        setAgreements(newAgreements);
    };

    const isButtonActive = agreements.terms && agreements.privacy;

    // 인증번호 요청 API
    const handleRequestVerification = async () => {
        try {
            if (!phoneNumber) {
                alert("휴대폰번호를 입력해주세요.");
                return;
            }
            // user.ts의 sendSMS 호출
            const res = await sendSMS(phoneNumber, "SUBSCRIBE_PRODUCT");
            if (!res.ok) {
                alert("인증번호 요청에 실패했습니다.");
                return;
            }
            alert("인증번호가 요청되었습니다.");
            setHasRequestedVerification(true);
        } catch (error) {
            console.error(error);
            alert("인증번호 요청 중 오류가 발생했습니다.");
        }
    };

    // 인증번호 확인 API
    const handleVerify = async () => {
        try {
            if (!verificationCode) {
                alert("인증번호를 입력해주세요.");
                return;
            }
            const res = await verifySMS(verificationCode, phoneNumber, "SUBSCRIBE_PRODUCT");
            if (!res.ok) {
                alert("인증번호가 일치하지 않습니다.");
                return;
            }
            alert("인증이 완료되었습니다.");
            setIsVerified(true);
        } catch (error) {
            console.error(error);
            alert("인증 확인 중 오류가 발생했습니다.");
        }
    };

    const handleComplete = () => {
        const signupState = location.state?.signupState || {};
        const { productId } = signupState;     
        navigate(
            `/token/onsale/products/${productId}/signup`, 
            { state: { ...signupState, step: 2 } }
        );
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="본인확인" />
            <main className="flex-1 px-5 flex flex-col">
                <div className="rounded-lg p-3 mt-4">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">약관에 동의해주세요.</h3>
                    <div
                        className="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 transition-colors"
                        onClick={handleToggleAll}
                    >
                        <CheckCircle checked={agreements.all} />
                        <span className="ml-3 text-base font-medium text-gray-800">
                            모든 약관에 동의합니다.
                        </span>
                    </div>

                    <div className="h-px bg-gray-200 my-1 mx-1"></div>

                    {/* Terms of Service */}
                    <div
                        className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 transition-colors"
                        onClick={() => handleToggleItem("terms")}
                    >
                        <div className="flex items-center">
                            <CheckCircle checked={agreements.terms} />
                            <span className="ml-3 text-base text-gray-800">
                                이용약관 <span className="text-gray-500 font-medium">(필수)</span>
                            </span>
                        </div>
                        <ChevronRight className="text-gray-400" />
                    </div>

                    {/* Privacy Policy */}
                    <div
                        className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 transition-colors"
                        onClick={() => handleToggleItem("privacy")}
                    >
                        <div className="flex items-center">
                            <CheckCircle checked={agreements.privacy} />
                            <span className="ml-3 text-base text-gray-800">
                                개인정보 처리방침{" "}
                                <span className="text-gray-500 font-medium">(필수)</span>
                            </span>
                        </div>
                        <ChevronRight className="text-gray-400" />
                    </div>
                </div>

                {/* Personal Information Section */}
              <div className="px-4 py-6 space-y-4">
                <h3 className="text-xl font-bold">인증정보 입력</h3>

                {/* 휴대폰 번호 */}
                <div className="space-y-1">
                  <label className="block text-sm text-gray-600 mb-2">휴대폰</label>
                  <input
                    type="text"
                    placeholder="휴대폰번호 입력"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-lg"
                  />
                </div>

                {/* 인증번호 요청 버튼 */}
                <button
                  onClick={handleRequestVerification}
                  className="mt-2 w-full py-2.5 text-sm font-medium text-white bg-[#4B5EED] rounded-lg"
                >
                  인증번호 요청
                </button>

                {/* 인증번호 입력 */}
                <div className="space-y-1 mb-2">
                  <label className="block text-sm text-gray-600 mb-2">인증번호</label>
                  <input
                    type="text"
                    placeholder="숫자 6자리 입력"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-lg"
                  />
                </div>

                {/* 인증번호 확인 버튼 */}
                <button
                  onClick={handleVerify}
                  className="mt-2 w-full py-2.5 text-sm font-medium text-white bg-[#4B5EED] rounded-lg"
                >
                  인증번호 확인
                </button>
              </div>
            </main >

            <div className="p-6 bg-white">
                <Button
                    text="본인 인증 완료"
                    onClick={handleComplete}
                    className={`w-full py-3.5 rounded-lg text-base font-medium text-white ${isButtonActive
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!isButtonActive || !isVerified}
                />
            </div>
        </div>

    );
}
