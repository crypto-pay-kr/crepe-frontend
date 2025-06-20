import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { signUpUser, checkNicknameDuplicate } from "@/api/user";

export default function AdditionalUserInfoPage() {
  const navigate = useNavigate();
  const [name, setName] = useState(""); // 사용자 입력 이름
  const [nickname, setNickname] = useState(""); // 사용자 입력 닉네임
  const [nicknameMessage, setNicknameMessage] = useState(""); // 닉네임 검증 메시지
  const [nicknameMessageColor, setNicknameMessageColor] = useState(""); // 메시지 색상
  const [isNicknameValid, setIsNicknameValid] = useState(false); // 닉네임 유효성 여부

  // 유효성 검사
  const isFormValid = name.trim() && isNicknameValid;

  // 닉네임 중복 확인
  useEffect(() => {
    const checkNickname = async () => {
      if (!nickname.trim()) {
        setNicknameMessage("닉네임을 입력해주세요.");
        setNicknameMessageColor("text-red-500");
        setIsNicknameValid(false);
        return;
      }

      try {
        const isDuplicate = await checkNicknameDuplicate(nickname.trim());
        if (isDuplicate) {
          setNicknameMessage("이미 사용중인 닉네임입니다.");
          setNicknameMessageColor("text-red-500");
          setIsNicknameValid(false);
        } else {
          setNicknameMessage("사용 가능한 닉네임입니다.");
          setNicknameMessageColor("text-green-500");
          setIsNicknameValid(true);
        }
      } catch (error) {
        console.error("닉네임 중복 확인 중 오류 발생:", error);
        setNicknameMessage("닉네임 중복 확인 중 오류가 발생했습니다.");
        setNicknameMessageColor("text-red-500");
        setIsNicknameValid(false);
      }
    };

    if (nickname.trim()) {
      checkNickname();
    } else {
      setNicknameMessage("");
      setIsNicknameValid(false);
    }
  }, [nickname]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert("이름과 닉네임을 모두 입력해주세요.");
      return;
    }

    try {
      // 기존 sessionStorage에서 데이터 가져오기
      const storedData = sessionStorage.getItem("signUpData");
      if (!storedData) {
        alert("회원가입 정보를 찾을 수 없습니다.");
        return;
      }

      const signUpData = JSON.parse(storedData);

      // 최종 Request Body 생성
      const requestBody = {
        ...signUpData,
        name: name.trim(),
        nickname: nickname.trim(),
      };

      // POST 요청 보내기
      const response = await signUpUser(requestBody);

      if (response.ok) {
        // 회원가입 성공 시 localStorage와 sessionStorage 데이터 삭제
        sessionStorage.removeItem("signUpData");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        // 완료 페이지로 이동
        navigate("/signup-complete");
      } else {
        const errorData = await response.json();
        alert(`회원가입 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      alert("회원가입 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={4} />
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">추가 정보 입력</h2>
          <p className="text-gray-500">시작하기 위한 정보를 입력해주세요</p>
        </div>

        <div className="flex-1 space-y-6 px-1">
          <Input
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
          />
          <div>
            <Input
              label="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
            />
            {nicknameMessage && (
              <p className={`text-sm mt-1 ${nicknameMessageColor}`}>{nicknameMessage}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-10 mb-4">
          <div className="bg-gray-50 p-3 rounded-full shadow-sm mb-4">
            <img src="/lock.png" alt="Lock Icon" className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-center text-sm text-gray-500">
            모든 개인정보는 암호화되어 안전하게 저장됩니다.
          </p>
        </div>
      </div>

      <div className="p-12 pt-0">
        <Button
          text={isFormValid ? "제출하기" : "계속하기"}
          onClick={handleSubmit}
          color={isFormValid ? "primary" : "gray"}
          disabled={!isFormValid}
        />
      </div>
    </div>
  );
}