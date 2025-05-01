import LoginHome from "@/components/signup/LoginHome"
import * as React from "react"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <LoginHome
      onLogin={() => navigate("/user/coin")}  // ✅ 라우팅 이동
      onSignup={() => navigate("/signup")}    // 회원가입도 연결하고 싶다면
    />
  )
}