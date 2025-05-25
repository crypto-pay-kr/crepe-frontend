import LoginHome from "@/components/signup/LoginHome";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <LoginHome
      onSignup={() => navigate("/terms")}
      onStoreSignup={() => navigate("/store/signup")}
    />
  );
}