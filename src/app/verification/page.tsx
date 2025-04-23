"use client"

import PhoneVerification from "@/components/signup/PhoneVerification"
import { useNavigate } from "react-router-dom"

export default function PhoneVerificationPage() {
  const navigate = useNavigate()

  return (
    <PhoneVerification
      onNext={() => navigate("/additional-info")}
      buttonColor="blue"
      onToggleColor={() => {}}
    />
  )
}
