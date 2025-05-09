import Button from "@/components/common/Button"
import Header from "@/components/common/Header"
import Input from "@/components/common/Input"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


export default function IDVerificationStep3() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        idNumberFirst: "",
        idNumberLast: "",
        licenseNumber: "",
        registrationDate: "",
    })

    // 실제 구현에서는 이전 단계에서 OCR로 인식된 데이터를 받아올 수 있음
    useEffect(() => {
        // 예시 데이터 (실제로는 OCR 결과나 서버에서 받아온 데이터를 사용)
        setFormData({
            name: "김국민",
            idNumberFirst: "910120",
            idNumberLast: "2******",
            licenseNumber: "21-29-293292",
            registrationDate: "2019.08.27",
        })
    }, [])


    const handleChange = (
        field: keyof typeof formData,
        value: string
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = () => {
        // 실제로는 여기서 데이터 검증 및 제출 로직이 들어갈 것입니다
        navigate("id/verification/complete")
    }

    return (
        <div className="flex flex-col h-full">
            <Header title="본인확인" />

            <div className="flex-1 p-6 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">인증정보 입력</h1>
                <p className="text-gray-600 mb-6">신분증에서 인식된 정보를 확인하고 필요한 경우 수정해주세요.</p>

                <Input
                    label="이름"
                    value={formData.name}
                    onChange={e => handleChange("name", e.target.value)}
                />

                <div className="mb-6">
                    <label className="block text-gray-500 mb-2">주민등록번호</label>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={formData.idNumberFirst}
                            onChange={(e) => handleChange("idNumberFirst", e.target.value)}
                            className="w-full py-3 px-0 border-0 border-b border-gray-300 focus:outline-none focus:border-[#0a2d6b] text-xl"
                            maxLength={6}
                        />
                        <span className="mx-4 text-xl">-</span>
                        <input
                            type="text"
                            value={formData.idNumberLast}
                            readOnly
                            className="w-full py-3 px-0 border-0 border-b border-gray-300 focus:outline-none focus:border-[#0a2d6b] text-xl"
                        />
                    </div>
                </div>

                <Input
                    label="면허번호"
                    value={formData.licenseNumber}
                    onChange={(e) => handleChange("licenseNumber", e.target.value)}
                />

                <Input
                    label="등록 날짜"
                    value={formData.registrationDate}
                    onChange={(e) => handleChange("registrationDate", e.target.value)}
                    type="text"
                    placeholder="YYYY.MM.DD"
                />
            </div>

            <div className="p-4">
                <Button text="다음" onClick={handleSubmit} fullWidth />
            </div>
        </div>
    )
}
