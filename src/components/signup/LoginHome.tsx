import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import LoginForm from "./LoginForm";
import { loginUser } from "@/api/user";

interface LoginHomeProps {
  onSignup: () => void;
  buttonClassName?: string;
}

export default function LoginHome({ onSignup, buttonClassName }: LoginHomeProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isButtonDisabled = !userId || !password;

  // 로그인 요청 처리 함수
  const handleLogin = async () => {
    if (isButtonDisabled) {
      alert("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      const res = await loginUser(userId, password);
      if (!res.ok) {
        alert("로그인에 실패했습니다.");
        return;
      }

      const { accessToken, refreshToken, role } = await res.json();

      // 토큰을 localStorage 등에 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // role에 따라 페이지 이동
      if (role === "USER") {
        navigate("/user/coin");
      } else if (role === "SELLER") {
        navigate("/store/coin");
      } else {
        alert("알 수 없는 사용자 유형입니다.");
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-5 pt-24 pb-10">
      {/* 로고 */}
      <img
        src="/crepe-newlogo2.png"
        alt="Logo"
        className="object-contain w-[500px] aspect-[2.51] mx-auto"
      />

      {/* Login Form */}
      <div className="mt-12 w-full">
        <LoginForm onSubmit={handleLogin}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-center gap-4 mt-4 mb-4 text-sm text-gray-500">
            <button onClick={onSignup} className="hover:underline">
              회원가입
            </button>
            <button className="hover:underline">아이디 찾기</button>
            <button className="hover:underline">비밀번호 찾기</button>
          </div>
          <Button
            text="로그인하기"
            onClick={handleLogin}
            className={`w-full rounded-[9px] font-medium bg-[#0C2B5F] text-white ${buttonClassName}`}
          />
        </LoginForm>
      </div>
    </div>
  );
}