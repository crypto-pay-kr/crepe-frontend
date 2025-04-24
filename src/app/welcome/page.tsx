"use client"

import Welcome from "@/components/signup/Welcome"
import { useNavigate } from "react-router-dom"

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <Welcome
      onLogin={() => navigate("/login")}
      onSignup={() => navigate("/terms")}
      onStoreSignup={() => navigate("/terms?store=true")}
      buttonClassName="mx-auto px-4"
    />
  )
}
