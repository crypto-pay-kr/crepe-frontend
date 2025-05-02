import LoginHome from "@/components/signup/LoginHome";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <LoginHome
      onSignup={() => navigate("/signup")} // 회원가입 페이지로 이동
    />
  );
}