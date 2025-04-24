"use client"

import TermsAgreement from "@/components/signup/TermsAgreement"
import { useNavigate, useLocation } from "react-router-dom"

export default function TermsAgreementPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNext = () => {
    const params = new URLSearchParams(location.search)
    if (params.get("store") === "true") {
      navigate("/email?store=true") 
    } else {
      navigate("/email") 
    }
  }

  return <TermsAgreement onNext={handleNext} />
}
