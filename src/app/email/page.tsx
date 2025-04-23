"use client"

import EmailPassword from "@/components/signup/EmailPassword"
import { useNavigate } from "react-router-dom" // Updated import

export default function EmailPasswordPage() {
  const navigate = useNavigate() // Updated hook

  return <EmailPassword onNext={() => navigate("/email-filled")} /> // Updated navigation logic
}
