"use client"

import PhoneVerification from "@/components/signup/PhoneVerification"
import { useNavigate,useLocation } from "react-router-dom"

export default function PhoneVerificationPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNext = () => {
    const params = new URLSearchParams(location.search)
    if (params.get("store") === "true") {
      navigate("/store-info")
    } else {
      navigate("/additional-info")
    }
  }

  return (
    <PhoneVerification
      onNext={handleNext}
      buttonColor="blue"
      onToggleColor={() => {}}
    />
  )
}
