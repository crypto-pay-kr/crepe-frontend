import Button from "@/components/common/Button";
import CheckCircle from "@/components/common/CheckCircle";
import ChevronRight from "@/components/common/ChevronRight";
import Header from "@/components/common/Header";
import { useState } from "react";

export default function IDVerificationStep4() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [carrier, setCarrier] = useState("SKT");
    const [remainingTime, setRemainingTime] = useState("03:00");
    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
    });


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

    const handleRequestVerification = () => {
        alert("인증번호가 요청되었습니다.");
    };

    const handleVerify = () => {
        alert("인증이 완료되었습니다.");
    };

    const handleComplete = () => {
        alert("본인 인증이 완료되었습니다.");
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="본인확인" />
            <main className="flex-1 px-5 flex flex-col">
                <div className="rounded-lg p-3 mt-4">
                    <h3 className="text-xl font-bold mb-4">약관에 동의해주세요.</h3>
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
                <div className="px-3 pt-5">
                    <h3 className="text-xl font-bold mb-4">인증정보 입력</h3>

                    {/* Carrier selection */}
                    <div className="mb-3">
                        <label className="block text-gray-500 text-sm mb-1">휴대폰</label>
                        <div className="relative">
                            <select
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-white appearance-none pr-8"
                            >
                                <option value="SKT">SKT</option>
                                <option value="KT">KT</option>
                                <option value="LG U+">LG U+</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Phone number input */}
                    <div className="flex mb-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="휴대폰번호 입력"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    {/* Request verification button */}
                    <button
                        onClick={handleRequestVerification}
                        className="w-full py-2 bg-gray-100 text-gray-700 rounded mb-3"
                    >
                        인증번호 요청
                    </button>

                    {/* Verification number */}
                    <div className="mb-5 mt-5">
                        <label className="block text-gray-500 text-sm mb-1">인증번호</label>
                        <input
                            type="text"
                            placeholder="숫자 6자리 입력"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {/* Timer and extend button */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-gray-500">
                            <svg className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>잔여시간 {remainingTime}</span>
                        </div>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">
                            재요청
                        </button>
                    </div>

                    {/* Verify button */}
                    <button
                        onClick={handleVerify}
                        className="w-full py-2 bg-gray-100 text-gray-700 rounded mb-4"
                    >
                        인증번호 확인
                    </button>
                </div>



            </main >

            <div className="p-5 bg-white">
                <Button
                    text="본인 인증 완료"
                    onClick={handleComplete}
                    className={`w-full py-3.5 rounded-lg font-medium text-white ${isButtonActive
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-300 cursor-not-allowed"
                        }`}
                    disabled={!isButtonActive}
                />
            </div>
        </div>

    );
}
