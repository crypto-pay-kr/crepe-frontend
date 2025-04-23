"use client"

import SignupComplete from "@/components/signup/SignupComplete"
import { useNavigate } from "react-router-dom" // Updated import

export default function SignupCompletePage() {
  const navigate = useNavigate() // Updated hook

  return <SignupComplete onNext={() => navigate("/login")} />; // Updated navigation logic
}
