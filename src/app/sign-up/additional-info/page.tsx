import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/common/Header"
import Button from "@/components/common/Button"
import Input from "@/components/common/Input"

export default function AdditionalUserInfoPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")
  const [buttonColor, setButtonColor] = useState<"blue" | "gray">("blue")

  const handleSubmit = () => {
    if (buttonColor === "blue") {
      navigate("/signup-complete")
    } else {
      setButtonColor("blue")
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Header title="회원가입" progress={4} />
      <div className="flex-1 flex flex-col p-5">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">추가 정보 입력</h2>
          <p className="text-sm text-gray-500">시작하기 위한 정보를 입력해주세요</p>
        </div>

        <div className="flex-1">
          <Input
            label="이름"
            value={name}
            onChange={setName}
            placeholder="이름을 입력해주세요"
          />
          <Input
            label="닉네임"
            value={nickname}
            onChange={setNickname}
            placeholder="닉네임을 입력해주세요"
          />

          <div className="flex justify-center items-center mt-8 mb-4">
            <img src="/lock.png" alt="Lock Icon" className="w-6 h-6 text-gray-400  " />
          </div>
          <p className="text-center text-sm text-gray-500">모든 개인정보는 암호화되어 저장됩니다.</p>
        </div>
      </div>

      <div className="p-5">
        <Button
          text={buttonColor === "blue" ? "제출 하기" : "계속 하기"}
          onClick={handleSubmit}
          color={buttonColor}
        />
      </div>
    </div>
  )
}
